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

    public draw(scene: Scene2, camera: Camera, player: Player, dynamicLights: boolean) {
        const ctx = this.ctx;
        const lightCtx = this.lightCtx;

        const width = this.canvas.width;
        const height = this.canvas.height;

        //ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#303030';
        ctx.fillRect(0, 0, width, height);

        lightCtx.globalCompositeOperation = 'source-over';
        lightCtx.setTransform(1, 0, 0, 1, 0, 0);
        lightCtx.fillStyle = scene.as3d.ambientLightColor.toString();
        lightCtx.fillRect(0, 0, width, height);
        lightCtx.globalCompositeOperation = 'lighter';

        const polygons = scene.polygons;
        for (let i = 0; i < polygons.length; ++i) {
            let polygon = polygons[i];
            this.drawPolygon(polygon, camera);
            this.lightPolygon(polygon, scene.as3d.staticLights, camera);
            if (dynamicLights) {
                this.lightPolygon(polygon, scene.as3d.dynamicLights, camera);
            }
        }

        // Draw player
        this.drawSprite(player);


        // Draw all??
        ctx.globalCompositeOperation = 'multiply';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(this.lightCanvas, 0, 0);
    }

    private drawSprite(sprite: Sprite) {
        const img = this.images[sprite.sprite];
        const spriteWidth = img.width,
            spriteHeight = img.height,
            pixelsLeft = 0,
            pixelsTop = 0;

        const pos = sprite.position.project2d();

        this.ctx.drawImage(
            img,
            pixelsLeft,
            pixelsTop,
            spriteWidth,
            spriteHeight,
            pos.x,
            pos.y,
            spriteWidth,
            spriteHeight
        );
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
}
