

function main() {

	// Map the given input data into polygons and vectors
	const environment: Polygon3[] = Util.convertInputJsonToPolygonArray(SCENE_DATA);

	let figure : Figure = new Figure(4, 5, 0.1, 1);
	const figures: Polygon3[] = [figure.getPolygon()];

	// Combine all the polygons into a single collection
	let scenePolygons: Polygon3[] = [];
	scenePolygons.push(...environment);
	scenePolygons.push(...figures);

	// Insert all polygons into the scene and project to 2d
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
