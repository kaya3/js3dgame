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
    npcStartPos: Vector3,
    npcSprite: ImageName,
    itemStartPos: Vector3,
    itemSprite: ImageName,
    backgroundColor: Color,
    numGeese: number,
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
    const Z_PLAT3 = 1;

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
            { label: "N", isWalkable: true, texture: "floor", coords: [v(-4, 15, Z_PLAT2), v(6, 15, Z_PLAT2), v(6, 23, Z_PLAT2), v(-4, 23, Z_PLAT2), v(-4, 20, Z_PLAT2), v(-1,20,Z_PLAT2), v(-1,18,Z_PLAT2),v(-4,18,Z_PLAT2)] },
            { label: "I", isWalkable: false, texture: "wall", coords: [v(-4, 15, Z_GROUND), v(-4, 15, Z_PLAT2), v(2, 15, Z_PLAT2), v(2, 15, Z_GROUND)] },
            { label: "K", isWalkable: false, texture: "wall", coords: [v(-4, 23, Z_GROUND), v(-4, 23, Z_PLAT2), v(6, 23, Z_PLAT2), v(6, 23, Z_GROUND)] },
            { label: "L", isWalkable: false, texture: "wall", coords: [v(6, 15, Z_GROUND), v(6, 15, Z_PLAT2), v(6, 23, Z_PLAT2), v(6, 23, Z_GROUND)] },
            { label: "M", isWalkable: false, texture: "wall", coords: [v(4, 15, Z_GROUND), v(4, 15, Z_PLAT2), v(6, 15, Z_PLAT2), v(6, 15, Z_GROUND)] },
            { isWalkable: false, texture: "wall", coords: [v(-4, 15, Z_PLAT3), v(-4, 15, Z_PLAT2), v(-4, 18, Z_PLAT2), v(-4, 18, Z_PLAT3) ] },
            { isWalkable: false, texture: "wall", coords: [v(-4, 20, Z_PLAT3), v(-4, 20, Z_PLAT2), v(-4, 23, Z_PLAT2), v(-4, 23, Z_PLAT3) ] },
			
			// RAMP
            { isWalkable: true, texture: "floor", coords: [v(-4, 18, Z_PLAT3), v(-1, 18, Z_PLAT2), v(-1, 20, Z_PLAT2), v(-4, 20, Z_PLAT3)] },
            { isWalkable: false, texture: "wall", coords: [v(-4, 18, Z_PLAT3), v(-4, 18, Z_PLAT2), v(-1, 18, Z_PLAT2) ] },
			{ isWalkable: false, texture: "wall", coords: [v(-4, 20, Z_PLAT3), v(-1, 20, Z_PLAT2), v(-4, 20, Z_PLAT2) ] },
			
			// Room 3
            { isWalkable: true, texture: "floor", coords: [v(-4, 15, Z_PLAT3), v(-4, 23, Z_PLAT3), v(-12, 23, Z_PLAT3), v(-12, 15, Z_PLAT3)] }
        ],

        lights: [
            new AmbientLight(Color.greyscale(10)),
            new DirectionalLight(new Vector3(3, -1, 5), Color.rgb(50, 60, 40))
        ],

        playerStartPos: v(5, 2, 0),
        playerSprite: 'stick_figure',
        npcStartPos: v(5, 4, 0),
        npcSprite: 'npc',
        itemStartPos: v(5, 4, 0),
        itemSprite: 'item',
        backgroundColor: Color.rgb(48, 200, 48),
        numGeese: 140
    };
})();
