const CAMERA_SPEED = 0.25;

class Game {
	public readonly camera: Camera;
	
	public constructor(public scene: Scene2) {
		this.camera = { x: 0, y: 0, scale: 1 };
	}
	
	public tick(dt: number, keys: { [k: number]: boolean }): void {
		var dc = dt * CAMERA_SPEED;
		if(keys[37]) { this.camera.x -= dc; } // left
		if(keys[38]) { this.camera.y -= dc; } // up
		if(keys[39]) { this.camera.x += dc; } // right
		if(keys[40]) { this.camera.y += dc; } // down
	}
}

function main() {
	function vec(x: number, y: number, z: number): Vector3 {
		return new Vector3(x, y, z);
	}
	
	const scene: Scene2 = new Scene3([
		new Polygon3([ vec(0, 0, 0), vec(0, 5, 0), vec(10, 5, 0), vec(10, 0, 0) ], 'floor'),
		new Polygon3([ vec(0, 5, 0), vec(0, 10, 1), vec(10, 10, 1), vec(10, 5, 0) ], 'floor'),
		new Polygon3([ vec(10, 0, 0), vec(10, 0, 2), vec(10, 10, 2), vec(10, 10, 1), vec(10, 5, 0) ], 'wall'),
		new Polygon3([ vec(10, 0, 0), vec(0, 0, 0), vec(0, 0, 2), vec(10, 0, 2) ], 'wall'),
		new Polygon3([ vec(0, 10, 0), vec(0, 10, 1), vec(10, 10, 1), vec(10, 10, 0) ], 'wall'),
		new Polygon3([ vec(0, 4, 0), vec(0, 10, 1), vec(0, 10, 0) ], 'wall'),
	]).project2d();
	
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	window.addEventListener('resize', resizeCanvas);
	resizeCanvas();
	
	const keys = Object.create(null);
	window.addEventListener('keydown', function(e) {
		keys[e.keyCode] = true;
	});
	window.addEventListener('keyup', function(e) {
		keys[e.keyCode] = false;
	});
	
	loadTextures(function(imgs) {
		const game = new Game(scene);
		const renderer = new Renderer(canvas, imgs);
		
		var lastTime: DOMHighResTimeStamp|undefined;
		function tick(time?: DOMHighResTimeStamp) {
			if(time && lastTime) {
				game.tick(time - lastTime, keys);
			}
			lastTime = time;
			
			renderer.draw(game.scene, game.camera);
			window.requestAnimationFrame(tick);
		}
		tick();
	});
}
