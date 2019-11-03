function main() {
	/*
	function vec(x: number, y: number, z: number): Vector3 {
		return new Vector3(x, y, z);
	}
	
	const polys = [
		new Polygon3([ vec(0, 0, 0), vec(5, 0, 0), vec(5, 3, 0), vec(0, 3, 0) ], 'floor'),
		new Polygon3([ vec(0, 3, 0), vec(5, 3, 0), vec(5, 5, 0.5), vec(0, 5, 0.5) ], 'floor'),
		new Polygon3([ vec(5, 0, 0), vec(5, 0, 1), vec(5, 5, 1), vec(5, 5, 0.5), vec(5, 3, 0) ], 'wall'),
		new Polygon3([ vec(5, 0, 0), vec(0, 0, 0), vec(0, 0, 1), vec(5, 0, 1) ], 'wall'),
		new Polygon3([ vec(0, 5, 0), vec(0, 5, 0.5), vec(5, 5, 0.5), vec(5, 5, 0) ], 'wall'),
		new Polygon3([ vec(0, 3, 0), vec(0, 5, 0.5), vec(0, 5, 0) ], 'wall'),
	];
	const lights = [
		new AmbientLight(new RGB(50, 50, 50)),
		new DirectionalLight(vec(3, -1, 5), new RGB(50, 60, 40)),
		new PointLight(vec(4, 2, 0.5), new RGB(0, 255, 0), 1, 'static'),
	];
	const scene: Scene2 = new Scene3(polys, lights).project2d();
	const game = new Game(scene);
	
	*/
	
	// Map the given input data into polygons and vectors
	const environment: Polygon3[] = Util.convertInputSceneJsonToPolygonArray(SCENE_DATA);
	const figures: Figure[] = Util.convertInputFigureJsonToPolygonArray(FIGURES_DATA);
	const figuresPolygons = figures.map(figure => figure.getPolygon());

	// Combine all the polygons into a single collection
	let scenePolygons: Polygon3[] = [];
	scenePolygons.push(...environment);
	scenePolygons.push(...figuresPolygons);

	// Insert all polygons into the scene and project to 2d
	const scene: Scene2 = new Scene3(scenePolygons, SCENE_DATA.lights).project2d();
	
	const keys: { [k: number]: number } = Object.create(null);
	keys[37] = keys[38] = keys[39] = keys[40] = 0;
	window.addEventListener('keydown', function(e) {
		keys[e.keyCode] = 1;
	});
	window.addEventListener('keyup', function(e) {
		keys[e.keyCode] = 0;
	});

	loadTextures(function(imgs) {
		const game = new Game(scene);
		const renderer = new Renderer(imgs);
		
		// TODO: camera follows player
		game.camera.translate(500,-200);
		
		function resizeCanvas() {
			let w = window.innerWidth, h = window.innerHeight;
			game.camera.resizeWindow(w, h);
			if(renderer) { renderer.resizeWindow(w, h); }
		}
		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();

		var lastTime: DOMHighResTimeStamp|undefined;
		function tick(time?: DOMHighResTimeStamp) {
			if(time && lastTime) {
				game.tick(time - lastTime, keys);
			}
			lastTime = time;
			
			renderer.draw(game.scene, game.camera, true);
			window.requestAnimationFrame(tick);
		}
		tick();
	});
}
