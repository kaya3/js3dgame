type SceneData = {
    faces: Array<{
        label?: string,
        isWalkable: boolean,
        texture: ImageName,
        coords: Array<Vector3>
    }>,
    lights: Array<Light>,
    playerStartPos: Vector3,
    playerSprite: ImageName,
    backgroundColor: Color,
};

/**
 * Data to represent the map.
 */
const SCENE_DATA = (function (): SceneData {
    function v(x: number, y: number, z: number): Vector3 {
        return new Vector3(x, y, z);
    }

    const Z_GROUND = 0;
    const Z_PLAT1 = 0;
    const Z_PLAT2 = 2.5;

    return {
        faces: [
            // Room 1
            { label: "C", isWalkable: true, texture: "floor", coords: [v(0, 0, Z_PLAT1), v(6, 0, Z_PLAT1), v(6, 10, Z_PLAT1), v(0, 10, Z_PLAT1)] },
            { label: "A", isWalkable: false, texture: "wall", coords: [v(0, 0, Z_GROUND), v(0, 0, 1), v(6, 0, 1), v(6, 0, Z_GROUND)] },
            { label: "B", isWalkable: false, texture: "wall", coords: [v(6, 10, 1), v(6, 10, Z_GROUND), v(6, 0, Z_GROUND), v(6, 0, 1)] },
            { label: "D", isWalkable: false, texture: "wall", coords: [v(0, 0, Z_GROUND), v(0, 0, 1), v(0, 10, 1), v(0, 10, Z_GROUND)] },
            { label: "E", isWalkable: false, texture: "wall", coords: [v(0, 10, Z_GROUND), v(0, 10, 1), v(2, 10, 1), v(2, 10, Z_GROUND)] },
            { label: "F", isWalkable: false, texture: "wall", coords: [v(4, 10, Z_GROUND), v(4, 10, 1), v(6, 10, 1), v(6, 10, Z_GROUND)] },

            // Corridor
            { label: "O", isWalkable: true, texture: "floor", coords: [v(2, 10, Z_PLAT1), v(4, 10, Z_PLAT1), v(4, 15, Z_PLAT2), v(2, 15, Z_PLAT2)] },
            { label: "G", isWalkable: false, texture: "wall", coords: [v(4, 10, Z_GROUND), v(4, 10, 1), v(4, 15, Z_PLAT2), v(4, 15, 1)] },
            { label: "H", isWalkable: false, texture: "wall", coords: [v(2, 10, Z_GROUND), v(2, 10, 1), v(2, 15, Z_PLAT2), v(2, 15, Z_GROUND)] },

            // Room 2
            { label: "N", isWalkable: true, texture: "floor", coords: [v(-4, 15, Z_PLAT2), v(6, 15, Z_PLAT2), v(6, 23, Z_PLAT2), v(-4, 23, Z_PLAT2)] },
            { label: "I", isWalkable: false, texture: "wall", coords: [v(-4, 15, Z_GROUND), v(-4, 15, Z_PLAT2), v(2, 15, Z_PLAT2), v(2, 15, Z_GROUND)] },
            { label: "J", isWalkable: false, texture: "wall", coords: [v(-4, 15, Z_GROUND), v(-4, 15, Z_PLAT2), v(-4, 23, Z_PLAT2), v(-4, 23, Z_GROUND), ] },
            { label: "K", isWalkable: false, texture: "wall", coords: [v(-4, 23, Z_GROUND), v(-4, 23, Z_PLAT2), v(6, 23, Z_PLAT2), v(6, 23, Z_GROUND)] },
            { label: "L", isWalkable: false, texture: "wall", coords: [v(6, 15, Z_GROUND), v(6, 15, Z_PLAT2), v(6, 23, Z_PLAT2), v(6, 23, Z_GROUND)] },
            { label: "M", isWalkable: false, texture: "wall", coords: [v(4, 15, Z_GROUND), v(4, 15, Z_PLAT2), v(6, 15, Z_PLAT2), v(6, 15, Z_GROUND)] },
        ],

        lights: [
            new AmbientLight(Color.greyscale(30)),
            new DirectionalLight(v(3, -1, 5), Color.rgb(20, 25, 15)),
        ],

        playerStartPos: v(5, 2, 0),
        playerSprite: 'stick_figure',
        backgroundColor: Color.rgb(48, 200, 48)
    };
})();
