const CAMERA_SPEED = 0.25;
const CAMERA_ZOOM_SPEED = 0.001;
const MAX_ZOOM = 10;
const MIN_ZOOM = 1;
const DEFAULT_X = 400;
const DEFAULT_Y = 100;
const DEFAULT_SCALE = 1;

class Game {
    public readonly camera: Camera;

    public constructor(public scene: Scene2) {
        this.camera = { x: DEFAULT_X, y: DEFAULT_Y, scale: DEFAULT_SCALE };
    }

    public tick(dt: number, keys: { [k: number]: boolean }): void {
        var dc = dt * CAMERA_SPEED;
        var dz = dt * CAMERA_ZOOM_SPEED;
        if(keys[37]) { this.camera.x -= dc; } // left
        if(keys[38]) { this.camera.y -= dc; } // up
        if(keys[39]) { this.camera.x += dc; } // right
        if(keys[40]) { this.camera.y += dc; } // down
        if(keys[33]) { this.camera.scale = Util.limitNumberRange(this.camera.scale + dz, MIN_ZOOM, MAX_ZOOM); } // page up/zoom in
        if(keys[34]) { this.camera.scale = Util.limitNumberRange(this.camera.scale - dz, MIN_ZOOM, MAX_ZOOM); } // page down/zoom out
    }
}