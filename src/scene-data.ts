type SceneDataVector = { x: number, y: number, z: number };
type FigureDataVector = { x: number, y: number, z: number, scale: number };

type SceneData = {
	faces: Array<{ label?: string, texture: TextureName, coords: Array<SceneDataVector> }>,
	lights: Array<Light>
};

type FigureData = {
    figures: Array<{ label?: string, texture: TextureName, coords: FigureDataVector }>
};


/**
 * Data to represent the map.
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
        { label: "O", texture: "floor", coords: [{x:2, y:10, z:0}, {x:4, y:10, z:0},{x:4, y:15, z:1},{x:2, y:15, z:1}]},
        { label: "G", texture: "wall", coords: [{x:4, y:10, z:0}, {x:4, y:10, z:1}, {x:4, y:15, z:2}, {x:4, y:15, z:1}]},
        { label: "H", texture: "wall", coords: [{x:2, y:10, z:0}, {x:2, y:10, z:1}, {x:2, y:15, z:2}, {x:2, y:15, z:0}]},

        // Room 2
        { label: "N", texture: "floor", coords: [{x:-4, y:15, z:1}, {x:6, y:15, z:1}, {x:6, y:23, z:1}, {x:-4, y:23, z:1}]},

        // { label: "N", texture: "floor", coords: [{x:-4, y:15, z:1}, {x:2, y:15, z:1}, {x:2, y:15, z:1}, {x:6, y:15, z:1}, {x:6, y:23, z:1}, {x:-4, y:23, z:1}]},
        // { label: "P", texture: "wall", coords: [{x:4, y:15, z:1}, {x:4, y:10, z:1}, {x:4, y:10, z:2}, {x:4, y:15, z:2}]},
       // { label: "Q", texture: "wall", coords: [{x:2, y:17, z:1}, {x:2, y:10, z:1}, {x:4, y:10, z:1}, {x:4, y:15, z:1}]},
        { label: "I", texture: "wall", coords: [{x:-4, y:15, z:1}, {x:-4, y:15, z:2}, {x:2, y:15, z:2}, {x:2, y:15, z:1}]},
        { label: "J", texture: "wall", coords: [{x:-4, y:23, z:1}, {x:-4, y:23, z:2}, {x:-4, y:15, z:2}, {x:-4, y:15, z:1}]},
        { label: "K", texture: "wall", coords: [{x:-4, y:23, z:1}, {x:-4, y:23, z:2}, {x:6, y:23, z:2}, {x:6, y:23, z:1}]},
        { label: "L", texture: "wall", coords: [{x:6, y:15, z:1}, {x:6, y:15, z:2}, {x:6, y:23, z:2}, {x:6, y:23, z:1}]},
        { label: "M", texture: "wall", coords: [{x:4, y:15, z:1}, {x:4, y:15, z:2}, {x:6, y:15, z:2}, {x:6, y:15, z:1}]},
	],
	
	lights: [
		new AmbientLight(new RGB(50, 50, 50)),
		new DirectionalLight(new Vector3(3, -1, 5), new RGB(50, 60, 40)),
		new PointLight(new Vector3(5, 2, 0.5), new RGB(0, 255, 0), 1, 'static'),
	]
};

/**
 * Data to represent mobile / dynamic elements
 * TODO: Use a sprite (not a polygon to represent players) and rename
 */
const FIGURES_DATA: FigureData = {
    figures: [
        {label: "Player 1", texture: "stick-figure", coords: {x: 4, y: 5, z: 0.1, scale: 1}}
    ]
};
