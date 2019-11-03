class Camera {
	public tlX: number = 0;
	public tlY: number = 0;
	public width: number = 0;
	public height: number = 0;
	public x: number = 500;
	public y: number = 100;
	public scale: number = 1;
	
	public resizeWindow(width: number, height: number): void {
		this.width = width;
		this.height = height;
		this.tlX = width/2 - this.x;
		this.tlY = height/2 - this.y;
	}
	
	public translate(dx: number, dy: number): void {
		this.x += dx;
		this.y += dy;
		this.tlX -= dx;
		this.tlY -= dy;
	}
	
	public setTransform(ctx: CanvasRenderingContext2D): void {
		ctx.setTransform(this.scale, 0, 0, this.scale, this.tlX, this.tlY);
	}
}

class Renderer {
	private readonly textures: { [k in TextureName]: CanvasPattern } = Object.create(null);
	
	private readonly canvas: HTMLCanvasElement;
	private readonly lightCanvas: HTMLCanvasElement;
	
	private readonly ctx: CanvasRenderingContext2D;
	private readonly lightCtx: CanvasRenderingContext2D;
	
	public constructor(textureImgs: Textures) {
		const canvas = this.canvas = document.createElement('canvas');
		const ctx = this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.strokeStyle = 'gray';
		ctx.lineWidth = 1;
		
		const lc = this.lightCanvas = document.createElement('canvas');
		this.lightCtx = lc.getContext('2d') as CanvasRenderingContext2D;
		
		for(var k in textureImgs) {
			let kk = k as TextureName;
			this.textures[kk] = ctx.createPattern(textureImgs[kk], 'repeat') as CanvasPattern;
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
	
	public draw(scene: Scene2, camera: Camera, figures:Figure[], dynamicLights: boolean) {
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
		for(let i = 0; i < polygons.length; ++i) {
			let polygon = polygons[i];
			
			this.drawPolygon(polygon, camera);
			
			this.lightPolygon(polygon, scene.as3d.staticLights, camera);
			if(dynamicLights) {
				this.lightPolygon(polygon, scene.as3d.dynamicLights, camera);
			}
		}

		// Draw figures
		figures.forEach(figure => figure.drawOn(ctx));


		// Draw all??
		ctx.globalCompositeOperation = 'multiply';
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.drawImage(this.lightCanvas, 0, 0);
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
		for(let i = 0; i < lights.length; ++i) {
			lights[i].drawForPolygon(lightCtx, camera, polygon);
		}
	}
}
