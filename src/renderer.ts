interface Camera {
	x: number;
	y: number;
	scale: number;
}

class Renderer {
	private readonly ctx: CanvasRenderingContext2D;
	private readonly textures: { [k in TextureName]: CanvasPattern } = Object.create(null);
	public constructor(private readonly canvas: HTMLCanvasElement, textureImgs: Textures) {
		const ctx = this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		
		for(var k in textureImgs) {
			if(Object.prototype.hasOwnProperty.call(textureImgs, k)) {
				this.textures[k as TextureName] = ctx.createPattern(textureImgs[k as TextureName], 'repeat') as CanvasPattern;
			}
		}
	}
	
	public draw(scene: Scene2, camera: Camera) {
		const ctx = this.ctx;
		const tx = this.textures;
		
		const width = this.canvas.width;
		const height = this.canvas.height;
		
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = '#0000D0';
		ctx.fillRect(0, 0, width, height);
		
		const cx = (width/2) - camera.x;
		const cy = (height/2) - camera.y;
		const cs = camera.scale;
		
		const polygons = scene.polygons;
		for(let i = 0; i < polygons.length; ++i) {
			var polygon = polygons[i];
			this.drawPolygon(polygons[i], cx, cy, cs);
		}
	}
	
	private drawPolygon(polygon: Polygon2, cx: number, cy: number, cs: number): void {
		const ctx = this.ctx;
		const points = polygon.points;
		
		ctx.setTransform(cs, 0, 0, cs, cx, cy);
		
		ctx.beginPath();
		var v = points[0];
		ctx.moveTo(v.x, v.y);
		for(var i = 1; i < points.length; ++i) {
			v = points[i];
			ctx.lineTo(v.x, v.y);
		}
		ctx.closePath();
		
		var tf = polygon.textureTransform;
		ctx.setTransform(cs*tf.a, cs*tf.b, cs*tf.c, cs*tf.d, tf.x + cx, tf.y + cy);
		
		ctx.fillStyle = this.textures[polygon.as3d.texture];
		ctx.fill();
		
		ctx.setTransform(cs, 0, 0, cs, cx, cy);
		ctx.stroke();
	}
}
