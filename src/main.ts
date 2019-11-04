function main(sceneData: SceneData) {
    // construct the scene
    const scene: Scene2 = new Scene3(sceneData).project2d();

    const keys: { [k: number]: number } = Object.create(null);
    for (let i = 0; i < 256; ++i) { keys[i] = 0; }
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

            renderer.draw(game, true);
            window.requestAnimationFrame(tick);
        }

        tick();
    });
}
