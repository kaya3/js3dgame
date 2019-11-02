type SceneDataVector = { x: number, y: number, z: number };

type SceneData = {
    faces: Array<{ label?: string, texture: TextureName, coords: Array<SceneDataVector> }>
};

const SCENE_DATA: SceneData = {
    "faces": [
        { label: "A", texture: "wall", coords: [{x:0, y:0, z:0}, {x:0, y:0, z:7}, {x:6, y:0, z:7}, {x:6, y:0, z:0}]},
        { label: "B", texture: "wall", coords: [{x:6, y:0, z:0}, {x:6, y:0, z:7},{x:6, y:10, z:7},{x:6, y:10, z:0}]},
        { label: "C", texture: "wall", coords: [{x:0, y:10, z:0}, {x:0, y:0, z:0}, {x:6, y:0, z:0}, {x:6, y:10, z:0}]},
        { label: "D", texture: "floor", coords: [{x:0, y:10, z:0}, {x:0, y:0, z:0}, {x:0, y:0, z:7}, {x:0, y:10, z:7}]},
        { label: "E", texture: "wall", coords: [{x:0, y:10, z:7}, {x:0, y:0, z:7}, {x:6, y:0, z:7}, {x:6, y:10, z:7}]},
        { label: "F", texture: "wall", coords: [{x:0, y:10, z:0}, {x:0, y:10, z:7}, {x:6, y:10, z:7}, {x:6, y:10, z:0}]},
        { label: "G", texture: "wall", coords: [{x:2, y:17, z:0}, {x:2, y:10, z:0}, {x:2, y:10, z:7}, {x:4, y:15, z:7}]},
        { label: "H", texture: "wall", coords: [{x:2, y:17, z:7}, {x:2, y:10, z:7}, {x:4, y:10, z:7}, {x:4, y:15, z:7}]},
        { label: "P", texture: "wall", coords: [{x:4, y:15, z:0}, {x:4, y:10, z:0}, {x:4, y:10, z:7}, {x:4, y:15, z:7}]},
        { label: "Q", texture: "wall", coords: [{x:2, y:17, z:0}, {x:2, y:10, z:0}, {x:4, y:10, z:0}, {x:4, y:15, z:0}]},
        { label: "I", texture: "wall", coords: [{x:-4, y:17, z:0}, {x:-4, y:17, z:7}, {x:2, y:17, z:7}, {x:2, y:17, z:0}]},
        { label: "J", texture: "wall", coords: [{x:-4, y:23, z:0}, {x:-4, y:23, z:7}, {x:-4, y:17, z:7}, {x:-4, y:17, z:0}]},
        { label: "K", texture: "wall", coords: [{x:-4, y:23, z:0}, {x:-4, y:23, z:7}, {x:6, y:23, z:7}, {x:6, y:23, z:0}]},
        { label: "L", texture: "wall", coords: [{x:6, y:15, z:0}, {x:6, y:15, z:7}, {x:6, y:23, z:7}, {x:6, y:23, z:0}]},
        { label: "M", texture: "wall", coords: [{x:4, y:15, z:0}, {x:4, y:15, z:7}, {x:6, y:15, z:7}, {x:6, y:15, z:0}]},
        { label: "N", texture: "floor", coords: [{x:-4, y:17, z:0}, {x:2, y:17, z:0}, {x:2, y:15, z:0}, {x:6, y:15, z:0}, {x:6, y:23, z:0}, {x:-4, y:23, z:0}]},
        { label: "O", texture: "floor", coords: [{x:2, y:10, z:0}, {x:4, y:10, z:0},{x:4, y:15, z:0},{x:2, y:15, z:0}]}
    ]
};
