type SceneData = {
    faces: Array<{
        label?: string,
        isWalkable: boolean,
        texture: ImageName,
        coords: Array<Vector3>
    }>,
    lights: Array<Light>,
    player: Player
};

/**
 * Data to represent the map.
 */
const SCENE_DATA = (function (): SceneData {
    function v(x: number, y: number, z: number): Vector3 {
        return new Vector3(x, y, z);
    }

    return {
        faces: [
            // Room 1
            { label: "C", isWalkable: true, texture: "floor", coords: [v(0, 0, 0), v(6, 0, 0), v(6, 10, 0), v(0, 10, 0)] },
            { label: "A", isWalkable: false, texture: "wall", coords: [v(0, 0, 0), v(0, 0, 1), v(6, 0, 1), v(6, 0, 0)] },
            { label: "B", isWalkable: false, texture: "wall", coords: [v(6, 10, 1), v(6, 10, 0), v(6, 0, 0), v(6, 0, 1)] },
            { label: "D", isWalkable: false, texture: "wall", coords: [v(0, 0, 0), v(0, 0, 1), v(0, 10, 1), v(0, 10, 0)] },
            { label: "E", isWalkable: false, texture: "wall", coords: [v(0, 10, 0), v(0, 10, 1), v(2, 10, 1), v(2, 10, 0)] },
            { label: "F", isWalkable: false, texture: "wall", coords: [v(4, 10, 0), v(4, 10, 1), v(6, 10, 1), v(6, 10, 0)] },

            // Corridor
            { label: "O", isWalkable: true, texture: "floor", coords: [v(2, 10, 0), v(4, 10, 0), v(4, 15, 1), v(2, 15, 1)] },
            { label: "G", isWalkable: false, texture: "wall", coords: [v(4, 10, 0), v(4, 10, 1), v(4, 15, 2), v(4, 15, 1)] },
            { label: "H", isWalkable: false, texture: "wall", coords: [v(2, 10, 0), v(2, 10, 1), v(2, 15, 2), v(2, 15, 0)] },

            // Room 2
            { label: "N", isWalkable: true, texture: "floor", coords: [v(-4, 15, 1), v(6, 15, 1), v(6, 23, 1), v(-4, 23, 1)] },
            { label: "I", isWalkable: false, texture: "wall", coords: [v(-4, 15, 1), v(-4, 15, 2), v(2, 15, 2), v(2, 15, 1)] },
            { label: "J", isWalkable: false, texture: "wall", coords: [v(-4, 23, 1), v(-4, 23, 2), v(-4, 15, 2), v(-4, 15, 1)] },
            { label: "K", isWalkable: false, texture: "wall", coords: [v(-4, 23, 1), v(-4, 23, 2), v(6, 23, 2), v(6, 23, 1)] },
            { label: "L", isWalkable: false, texture: "wall", coords: [v(6, 15, 1), v(6, 15, 2), v(6, 23, 2), v(6, 23, 1)] },
            { label: "M", isWalkable: false, texture: "wall", coords: [v(4, 15, 1), v(4, 15, 2), v(6, 15, 2), v(6, 15, 1)] },
        ],

        lights: [
            new AmbientLight(new RGB(100, 100, 100)),
            new DirectionalLight(new Vector3(3, -1, 5), new RGB(50, 60, 40)),
            new PointLight(new Vector3(5, 2, 0.5), new RGB(255, 255, 200), 1, 'static'),
        ],

        player: new Player(v(5, 2, 0), "stick_figure")
    };
})();
