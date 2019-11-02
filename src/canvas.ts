class Renderer {
	private readonly ctx: CanvasRenderingContext2D;
	public constructor(private readonly canvas: HTMLCanvasElement) {
		this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	}
	
	public draw(scene: Scene2, camera: Camera) {
		const ctx = this.ctx;
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2; 
		
		
	}
}

function main(canvas: HTMLCanvasElement) {
	var game = new Renderer(canvas);
	
	
	game.draw(scene, camera);
}
