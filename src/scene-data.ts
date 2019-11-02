type SceneDataVector = { x: number, y: number, z: number };

type SceneData = {
    faces: Array<{ label?: string, texture: TextureName, coords: Array<SceneDataVector> }>
};


/**
 * Data to represent the map
 *
 * Note the polygons are drawn in the order shown --
 * thus, if you include the floor after the wall, the floor will draw on top of the walls
 */
const SCENE_DATA: SceneData = {
    "faces": [
        // Room 1
        { label: "C", texture: "floor", coords: [{x:0, y:0, z:0}, {x:6, y:0, z:0}, {x:6, y:10, z:0}, {x:0, y:10, z:0}]},
        { label: "A", texture: "wall", coords: [{x:0, y:0, z:0}, {x:0, y:0, z:1}, {x:6, y:0, z:1}, {x:6, y:0, z:0}]},
        { label: "B", texture: "wall", coords: [{x:6, y:10, z:1},{x:6, y:10, z:0},{x:6, y:0, z:0},{x:6, y:0, z:1}, ]},
        { label: "D", texture: "wall", coords: [{x:0, y:0, z:0}, {x:0, y:0, z:1}, {x:0, y:10, z:1}, {x:0, y:10, z:0}]},
        { label: "E", texture: "wall", coords: [{x:0, y:10, z:0}, {x:0, y:10, z:1}, {x:2, y:10, z:1}, {x:2, y:10, z:0}]},
        { label: "F", texture: "wall", coords: [{x:4, y:10, z:0}, {x:4, y:10, z:1}, {x:6, y:10, z:1}, {x:6, y:10, z:0}]},

        // Corridor
        { label: "O", texture: "floor", coords: [{x:2, y:10, z:0}, {x:4, y:10, z:0},{x:4, y:15, z:0},{x:2, y:15, z:0}]},
        { label: "G", texture: "wall", coords: [{x:4, y:10, z:0}, {x:4, y:10, z:1}, {x:4, y:15, z:1}, {x:4, y:15, z:0}]},
        { label: "H", texture: "wall", coords: [{x:2, y:10, z:0}, {x:2, y:10, z:1}, {x:2, y:15, z:1}, {x:2, y:15, z:0}]},

        // Room 2
        // { label: "N", texture: "floor", coords: [{x:-4, y:17, z:0}, {x:2, y:17, z:0}, {x:2, y:15, z:0}, {x:6, y:15, z:0}, {x:6, y:23, z:0}, {x:-4, y:23, z:0}]},
        // { label: "P", texture: "wall", coords: [{x:4, y:15, z:0}, {x:4, y:10, z:0}, {x:4, y:10, z:1}, {x:4, y:15, z:1}]},
        // { label: "Q", texture: "wall", coords: [{x:2, y:17, z:0}, {x:2, y:10, z:0}, {x:4, y:10, z:0}, {x:4, y:15, z:0}]},
        // { label: "I", texture: "wall", coords: [{x:-4, y:17, z:0}, {x:-4, y:17, z:1}, {x:2, y:17, z:1}, {x:2, y:17, z:0}]},
        // { label: "J", texture: "wall", coords: [{x:-4, y:23, z:0}, {x:-4, y:23, z:1}, {x:-4, y:17, z:1}, {x:-4, y:17, z:0}]},
        // { label: "K", texture: "wall", coords: [{x:-4, y:23, z:0}, {x:-4, y:23, z:1}, {x:6, y:23, z:1}, {x:6, y:23, z:0}]},
        // { label: "L", texture: "wall", coords: [{x:6, y:15, z:0}, {x:6, y:15, z:1}, {x:6, y:23, z:1}, {x:6, y:23, z:0}]},
        // { label: "M", texture: "wall", coords: [{x:4, y:15, z:0}, {x:4, y:15, z:1}, {x:6, y:15, z:1}, {x:6, y:15, z:0}]},
    ]
};
