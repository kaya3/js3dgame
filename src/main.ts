const CAMERA_SPEED = 0.25;
const CAMERA_ZOOM_SPEED = 0.001;
const MAX_ZOOM = 10;
const MIN_ZOOM = 1;
const DEFAULT_X = 400;
const DEFAULT_Y = 100;
const DEFAULT_SCALE = 1;

class Game {
	public readonly camera: Camera;
	
	public constructor(public scene: Scene2) {
		this.camera = { x: DEFAULT_X, y: DEFAULT_Y, scale: DEFAULT_SCALE };
	}

	public tick(dt: number, keys: { [k: number]: boolean }): void {
		var dc = dt * CAMERA_SPEED;
		var dz = dt * CAMERA_ZOOM_SPEED;
		if(keys[37]) { this.camera.x -= dc; } // left
		if(keys[38]) { this.camera.y -= dc; } // up
		if(keys[39]) { this.camera.x += dc; } // right
		if(keys[40]) { this.camera.y += dc; } // down
		if(keys[33]) { this.camera.scale = Util.limitNumberRange(this.camera.scale + dz, MIN_ZOOM, MAX_ZOOM); } // page up/zoom in
		if(keys[34]) { this.camera.scale = Util.limitNumberRange(this.camera.scale - dz, MIN_ZOOM, MAX_ZOOM); } // page down/zoom out
	}
}

function main() {
	function vec(x: number, y: number, z: number): Vector3 {
		return new Vector3(x, y, z);
	}

	// Map the given input data into polygons and vectors
	const environment: Polygon3[] = SCENE_DATA.faces.map(faceJson => {
		const vecArray: Vector3[] = faceJson.coords.map(coord => { return new Vector3(coord.x, coord.y, coord.z);});
		const texture = faceJson.texture;
		console.info('faceJson', faceJson);
		return new Polygon3(vecArray, texture);
	});

	let figure : Figure = new Figure(4, 5, 0.1, 1);
	const figures: Polygon3[] = [figure.getPolygon()];

	// Combine all the polygons into a single collection
	let scenePolygons: Polygon3[] = [];
	scenePolygons.push(...environment);
	scenePolygons.push(...figures);

	// insert all polygons into the scene and project to 2d
	const scene: Scene2 = new Scene3(scenePolygons).project2d();


	// Add into the HTML DOM and react to user input/activity
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
