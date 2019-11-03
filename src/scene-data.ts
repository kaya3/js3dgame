type SceneDataVector = { x: number, y: number, z: number };
type FigureDataVector = { x: number, y: number, z: number, scale: number };

type SceneData = {
	faces: Array<{
	    label?: string,
        is_walkable: boolean,
        texture: ImageName,
        coords: Array<SceneDataVector>
	}>,
	lights: Array<Light>
};

type FigureData = {
    figures: Array<Figure>
};


/**
 * Data to represent the map.
 */
const SCENE_DATA: SceneData = {
    "faces": [
        // Room 1
        { label: "C", is_walkable: true, texture: "floor", coords: [{x:0, y:0, z:0}, {x:6, y:0, z:0}, {x:6, y:10, z:0}, {x:0, y:10, z:0}]},
        { label: "A", is_walkable: false, texture: "wall", coords: [{x:0, y:0, z:0}, {x:0, y:0, z:1}, {x:6, y:0, z:1}, {x:6, y:0, z:0}]},
        { label: "B", is_walkable: false, texture: "wall", coords: [{x:6, y:10, z:1},{x:6, y:10, z:0},{x:6, y:0, z:0},{x:6, y:0, z:1}, ]},
        { label: "D", is_walkable: false, texture: "wall", coords: [{x:0, y:0, z:0}, {x:0, y:0, z:1}, {x:0, y:10, z:1}, {x:0, y:10, z:0}]},
        { label: "E", is_walkable: false, texture: "wall", coords: [{x:0, y:10, z:0}, {x:0, y:10, z:1}, {x:2, y:10, z:1}, {x:2, y:10, z:0}]},
        { label: "F", is_walkable: false, texture: "wall", coords: [{x:4, y:10, z:0}, {x:4, y:10, z:1}, {x:6, y:10, z:1}, {x:6, y:10, z:0}]},

        // Corridor
        { label: "O", is_walkable: true, texture: "floor", coords: [{x:2, y:10, z:0}, {x:4, y:10, z:0},{x:4, y:15, z:1},{x:2, y:15, z:1}]},
        { label: "G", is_walkable: false, texture: "wall", coords: [{x:4, y:10, z:0}, {x:4, y:10, z:1}, {x:4, y:15, z:2}, {x:4, y:15, z:1}]},
        { label: "H", is_walkable: false, texture: "wall", coords: [{x:2, y:10, z:0}, {x:2, y:10, z:1}, {x:2, y:15, z:2}, {x:2, y:15, z:0}]},

        // Room 2
        { label: "N", is_walkable: true, texture: "floor", coords: [{x:-4, y:15, z:1}, {x:6, y:15, z:1}, {x:6, y:23, z:1}, {x:-4, y:23, z:1}]},

        // { label: "N", is_walkable: true, texture: "floor", coords: [{x:-4, y:15, z:1}, {x:2, y:15, z:1}, {x:2, y:15, z:1}, {x:6, y:15, z:1}, {x:6, y:23, z:1}, {x:-4, y:23, z:1}]},
        // { label: "P", is_walkable: false, texture: "wall", coords: [{x:4, y:15, z:1}, {x:4, y:10, z:1}, {x:4, y:10, z:2}, {x:4, y:15, z:2}]},
       // { label: "Q", is_walkable: false, texture: "wall", coords: [{x:2, y:17, z:1}, {x:2, y:10, z:1}, {x:4, y:10, z:1}, {x:4, y:15, z:1}]},
        { label: "I", is_walkable: false, texture: "wall", coords: [{x:-4, y:15, z:1}, {x:-4, y:15, z:2}, {x:2, y:15, z:2}, {x:2, y:15, z:1}]},
        { label: "J", is_walkable: false, texture: "wall", coords: [{x:-4, y:23, z:1}, {x:-4, y:23, z:2}, {x:-4, y:15, z:2}, {x:-4, y:15, z:1}]},
        { label: "K", is_walkable: false, texture: "wall", coords: [{x:-4, y:23, z:1}, {x:-4, y:23, z:2}, {x:6, y:23, z:2}, {x:6, y:23, z:1}]},
        { label: "L", is_walkable: false, texture: "wall", coords: [{x:6, y:15, z:1}, {x:6, y:15, z:2}, {x:6, y:23, z:2}, {x:6, y:23, z:1}]},
        { label: "M", is_walkable: false, texture: "wall", coords: [{x:4, y:15, z:1}, {x:4, y:15, z:2}, {x:6, y:15, z:2}, {x:6, y:15, z:1}]},
	],
	
	lights: [
		new AmbientLight(new RGB(100, 100, 100)),
		new DirectionalLight(new Vector3(3, -1, 5), new RGB(50, 60, 40)),
		new PointLight(new Vector3(5, 2, 0.5), new RGB(255, 255, 200), 1, 'static'),
	]
};

/**
 * Data to represent mobile / dynamic elements
 * TODO: Use a sprite (not a polygon to represent players) and rename
 */
const FIGURES_DATA: FigureData = {
    figures: [
        new Figure(250,0,0, "stick_figure"),
        new Figure(350,0,0, "stick_figure")
    ]
};
