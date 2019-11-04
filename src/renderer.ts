const CAMERA_SCALE = 64;

class Renderer {
    // TODO: CanvasPatterns only for textures -- sprites do not need a CanvasPattern
    private readonly textures: { [k in ImageName]: CanvasPattern } = Object.create(null);

    private readonly canvas: HTMLCanvasElement;
    private readonly lightCanvas: HTMLCanvasElement;

    private readonly ctx: CanvasRenderingContext2D;
    private readonly lightCtx: CanvasRenderingContext2D;

    public constructor(private readonly images: { [k in ImageName]: HTMLImageElement }) {
        const canvas = this.canvas = document.createElement('canvas');
        const ctx = this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;

        const lc = this.lightCanvas = document.createElement('canvas');
        this.lightCtx = lc.getContext('2d') as CanvasRenderingContext2D;

        for (let k in images) {
            let kk = k as ImageName;
            this.textures[kk] = ctx.createPattern(images[kk], 'repeat') as CanvasPattern;
        }

        const body = document.getElementsByTagName('body')[0];
        body.appendChild(canvas);
        body.appendChild(lc);
        lc.style.display = 'none';
    }

    public resizeWindow(width: number, height: number): void {
        this.canvas.width = this.lightCanvas.width = width;
        this.canvas.height = this.lightCanvas.height = height;
    }

    public draw(game: Game, dynamicLights: boolean) {
        const camera = game.camera;
        const s3 = game.scene.as3d;
        const npcs = game.npcs;

        const ctx = this.ctx;
        const lightCtx = this.lightCtx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        //ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = s3.data.backgroundColor.toString();
        ctx.fillRect(0, 0, width, height);

        lightCtx.globalCompositeOperation = 'source-over';
        lightCtx.setTransform(1, 0, 0, 1, 0, 0);
        lightCtx.fillStyle = s3.ambientLightColor.toString();
        lightCtx.fillRect(0, 0, width, height);
        lightCtx.globalCompositeOperation = 'lighter';

        const polygons = game.scene.polygons;
        for (let i = 0; i < polygons.length; ++i) {
            let polygon = polygons[i];
            this.drawPolygon(polygon, camera);
            this.lightPolygon(polygon, s3.staticLights, camera);
            if (dynamicLights) {
                this.lightPolygon(polygon, s3.dynamicLights, camera);
            }
        }

        // Draw player
        this.drawSprite(ctx, game.player, camera);
        this.lightSprite(game.player, camera);

        // Draw sprites
        this.drawSprite(ctx, game.npc, camera);
        this.drawSprite(ctx, game.item, camera);

        // Draw npcs
        npcs.forEach(npc => this.drawSprite(ctx, npc, camera));

        // apply lighting
        ctx.globalCompositeOperation = 'multiply';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(this.lightCanvas, 0, 0);

        this.drawLights(s3.staticLights, camera);
        if (dynamicLights) {
            this.drawLights(s3.dynamicLights, camera);
        }
    }

    private drawSprite(ctx: CanvasRenderingContext2D, sprite: Sprite, camera: Camera) {
        const img = this.images[sprite.sprite];
        const sw = img.width, sh = img.height;
        const dw = sw * camera.scale * SPRITE_SCALE, dh = sh * camera.scale * SPRITE_SCALE;

        const pos2d = sprite.pos.project2d();

        ctx.drawImage(
            img, 0, 0,
            sw, sh,
            // drawImage draws an image, with the given x/y coordinates being the top-left corner
            // we want the middle of the base of the image
            pos2d.x - dw / 2, pos2d.y - dh,
            dw, dh
        );
    }

    private lightSprite(sprite: Sprite, camera: Camera) {
        this.lightCtx.globalCompositeOperation = 'destination-out';
        this.drawSprite(this.lightCtx, sprite, camera);

        // TODO: apply light to the mask
    }

    private drawPolygon(polygon: Polygon2, camera: Camera): void {
        const ctx = this.ctx;

        camera.setTransform(ctx);
        polygon.drawPath(ctx);

        polygon.uvTransform.apply(ctx, camera, TEXTURE_SCALE);
        ctx.fillStyle = this.textures[polygon.as3d.texture];
        ctx.fill();

        camera.setTransform(ctx);
        ctx.stroke();
    }

    private lightPolygon(polygon: Polygon2, lights: ReadonlyArray<Light>, camera: Camera): void {
        const lightCtx = this.lightCtx;
        for (let i = 0; i < lights.length; ++i) {
            lights[i].drawForPolygon(lightCtx, camera, polygon);
        }
    }

    private drawLights(lights: ReadonlyArray<Light>, camera: Camera): void {
        for (let i = 0; i < lights.length; ++i) {
            lights[i].drawForCamera(this.ctx, camera);
        }
    }
}
