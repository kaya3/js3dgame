

class Game {
	public static CAMERA_SPEED = 0.4;
	public static CAMERA_ZOOM_SPEED = 0.001;
	public static MAX_ZOOM = 10;
	public static MIN_ZOOM = 0.5;

	public readonly camera: Camera;
	
	public constructor(public scene: Scene2) {
		this.camera = new Camera();
	}
	
	public tick(dt: number, keys: { [k: number]: number }): void {
		let dc = dt * Game.CAMERA_SPEED;
		this.camera.translate(
			(keys[39] - keys[37])*dc, // right - left
			(keys[40] - keys[38])*dc, // down - up
		);
		
        let dz = dt * Game.CAMERA_ZOOM_SPEED;
        if(keys[33]) { this.camera.scale = Util.limitNumberRange(this.camera.scale + dz, Game.MIN_ZOOM, Game.MAX_ZOOM); } // page up/zoom in
        if(keys[34]) { this.camera.scale = Util.limitNumberRange(this.camera.scale - dz, Game.MIN_ZOOM, Game.MAX_ZOOM); } // page down/zoom out
	}
}
