const CAMERA_SPEED = 0.25;
const CAMERA_ZOOM_SPEED = 0.001;
const MAX_ZOOM = 10;
const MIN_ZOOM = 0.5;

class Game {
	public readonly camera: Camera;
	
	public constructor(public scene: Scene2) {
		this.camera = new Camera();
	}
	
	public tick(dt: number, keys: { [k: number]: number }): void {
		var dc = dt * CAMERA_SPEED;
		this.camera.translate(
			(keys[39] - keys[37])*dc, // right - left
			(keys[40] - keys[38])*dc, // down - up
		);
		
        var dz = dt * CAMERA_ZOOM_SPEED;
        if(keys[33]) { this.camera.scale = Util.limitNumberRange(this.camera.scale + dz, MIN_ZOOM, MAX_ZOOM); } // page up/zoom in
        if(keys[34]) { this.camera.scale = Util.limitNumberRange(this.camera.scale - dz, MIN_ZOOM, MAX_ZOOM); } // page down/zoom out
	}
}
