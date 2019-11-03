type SceneData = {
    faces: Array<{
        label?: string,
        is_walkable: boolean,
        texture: ImageName,
        coords: Array<Vector3>
    }>,
    lights: Array<Light>,
    figures: Array<Figure>
};

/**
 * Data to represent the map.
 */
const SCENE_DATA = (function (): SceneData {
    function v(x: number, y: number, z: number): Vector3 {
        return new Vector3(x, y, z);
    }

    return {
        "faces": [
            // Room 1
            { label: "C", is_walkable: true, texture: "floor", coords: [v(0, 0, 0), v(6, 0, 0), v(6, 10, 0), v(0, 10, 0)] },
            { label: "A", is_walkable: false, texture: "wall", coords: [v(0, 0, 0), v(0, 0, 1), v(6, 0, 1), v(6, 0, 0)] },
            { label: "B", is_walkable: false, texture: "wall", coords: [v(6, 10, 1), v(6, 10, 0), v(6, 0, 0), v(6, 0, 1),] },
            { label: "D", is_walkable: false, texture: "wall", coords: [v(0, 0, 0), v(0, 0, 1), v(0, 10, 1), v(0, 10, 0)] },
            { label: "E", is_walkable: false, texture: "wall", coords: [v(0, 10, 0), v(0, 10, 1), v(2, 10, 1), v(2, 10, 0)] },
            { label: "F", is_walkable: false, texture: "wall", coords: [v(4, 10, 0), v(4, 10, 1), v(6, 10, 1), v(6, 10, 0)] },

            // Corridor
            { label: "O", is_walkable: true, texture: "floor", coords: [v(2, 10, 0), v(4, 10, 0), v(4, 15, 1), v(2, 15, 1)] },
            { label: "G", is_walkable: false, texture: "wall", coords: [v(4, 10, 0), v(4, 10, 1), v(4, 15, 2), v(4, 15, 1)] },
            { label: "H", is_walkable: false, texture: "wall", coords: [v(2, 10, 0), v(2, 10, 1), v(2, 15, 2), v(2, 15, 0)] },

            // Room 2
            { label: "N", is_walkable: true, texture: "floor", coords: [v(-4, 15, 1), v(6, 15, 1), v(6, 23, 1), v(-4, 23, 1)] },
            { label: "I", is_walkable: false, texture: "wall", coords: [v(-4, 15, 1), v(-4, 15, 2), v(2, 15, 2), v(2, 15, 1)] },
            { label: "J", is_walkable: false, texture: "wall", coords: [v(-4, 23, 1), v(-4, 23, 2), v(-4, 15, 2), v(-4, 15, 1)] },
            { label: "K", is_walkable: false, texture: "wall", coords: [v(-4, 23, 1), v(-4, 23, 2), v(6, 23, 2), v(6, 23, 1)] },
            { label: "L", is_walkable: false, texture: "wall", coords: [v(6, 15, 1), v(6, 15, 2), v(6, 23, 2), v(6, 23, 1)] },
            { label: "M", is_walkable: false, texture: "wall", coords: [v(4, 15, 1), v(4, 15, 2), v(6, 15, 2), v(6, 15, 1)] },
        ],

        lights: [
            new AmbientLight(new RGB(100, 100, 100)),
            new DirectionalLight(new Vector3(3, -1, 5), new RGB(50, 60, 40)),
            new PointLight(new Vector3(5, 2, 0.5), new RGB(255, 255, 200), 1, 'static'),
        ],

        figures: [
            new Figure(250, 0, 0, "stick_figure"),
            new Figure(350, 0, 0, "stick_figure")
        ]
    };
})();
