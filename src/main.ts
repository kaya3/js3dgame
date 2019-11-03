function main() {
    // Map the given input data into polygons
    const polygons: Polygon3[] = SCENE_DATA.faces.map(face => {
        return new Polygon3(face.coords, face.texture);
    });

    // Insert all polygons into the scene and project to 2d
    const scene: Scene2 = new Scene3(polygons, SCENE_DATA.lights).project2d();

    const keys: { [k: number]: number } = Object.create(null);
    keys[37] = keys[38] = keys[39] = keys[40] = 0;
    window.addEventListener('keydown', function (e) {
        keys[e.keyCode] = 1;
    });
    window.addEventListener('keyup', function (e) {
        keys[e.keyCode] = 0;
    });

    loadTextures(function (imgs) {
        const game = new Game(scene);
        const renderer = new Renderer(imgs);

        // TODO: camera follows player
        game.camera.translate(500, 0);

        function resizeCanvas() {
            let w = window.innerWidth, h = window.innerHeight;
            game.camera.resizeWindow(w, h);
            if (renderer) { renderer.resizeWindow(w, h); }
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let lastTime: DOMHighResTimeStamp | undefined;

        function tick(time?: DOMHighResTimeStamp) {
            if (time && lastTime) {
                game.tick(time - lastTime, keys);
            }
            lastTime = time;

            renderer.draw(game.scene, game.camera, SCENE_DATA.player, true);
            window.requestAnimationFrame(tick);
        }

        tick();
    });
}
