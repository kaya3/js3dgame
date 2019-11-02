class Renderer {
	private readonly ctx: CanvasRenderingContext2D;
	public constructor(private readonly canvas: HTMLCanvasElement) {
		this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	}
	
	public draw(scene: Scene2, cameraPos: Vector2) {
		const ctx = this.ctx;
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		ctx.fillStyle = '#0000D0';
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2; 
		ctx.fillStyle = '#00D000';
		
		const polygons = scene.polygons;
		for(let i = 0; i < polygons.length; ++i) {
			this.drawPolygon(polygons[i], cameraPos);
		}
	}
	
	private drawPolygon(polygon: Polygon2, cameraPos: Vector2): void {
		const ctx = this.ctx;
		const points = polygon.points;
		
		ctx.beginPath();
		var v = points[0].subtract(cameraPos);
		ctx.moveTo(v.x, v.y);
		for(var i = 1; i < points.length; ++i) {
			v = points[i].subtract(cameraPos);
			ctx.lineTo(v.x, v.y);
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}

function main(canvas: HTMLCanvasElement) {
	function vec(x: number, y: number, z: number): Vector3 {
		return new Vector3(x, y, z);
	}
	
	var scene: Scene2 = new Scene3([
		new Polygon3([ vec(0, 0, 0), vec(0, 10, 0), vec(10, 10, 0), vec(10, 0, 0) ]),
		new Polygon3([ vec(10, 0, 0), vec(10, 0, 2), vec(10, 10, 2), vec(10, 10, 0) ]),
		new Polygon3([ vec(0, 0, 0), vec(0, 0, 2), vec(10, 0, 2), vec(10, 0, 0) ]),
	]).project2d();
	
	var game = new Renderer(canvas);
	var cameraPos = new Vector2(-100, -400);
	
	function tick() {
		game.draw(scene, cameraPos);
		window.requestAnimationFrame(tick);
	}
	tick();
}
