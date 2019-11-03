const KEYCODE_PAGE_UP = 33;
const KEYCODE_PAGE_DOWN = 33;
const KEYCODE_W = 87;
const KEYCODE_A = 65;
const KEYCODE_S = 83;
const KEYCODE_D = 68;

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
            (keys[39] - keys[37]) * dc, // right - left
            (keys[40] - keys[38]) * dc, // down - up
        );

        this.handleKeyPresses(dt, keys);
    }

    private handleKeyPresses(dt: number, keys: { [k: number]: number }) {
        let dz = dt * Game.CAMERA_ZOOM_SPEED;
        if (keys[KEYCODE_PAGE_UP]) {
            this.camera.scale = Util.limitNumberRange(this.camera.scale + dz, Game.MIN_ZOOM, Game.MAX_ZOOM);
        } // page up/zoom in
        if (keys[KEYCODE_PAGE_DOWN]) {
            this.camera.scale = Util.limitNumberRange(this.camera.scale - dz, Game.MIN_ZOOM, Game.MAX_ZOOM);
        } // page down/zoom out

        const stepSize = 0.1;
        if (keys[KEYCODE_A]) {
            this.movePlayerWithinBounds(SCENE_DATA.player, -stepSize, -stepSize);
        } else if (keys[KEYCODE_D]) {
            this.movePlayerWithinBounds(SCENE_DATA.player, +stepSize, +stepSize);
        } else if (keys[KEYCODE_W]) {
            this.movePlayerWithinBounds(SCENE_DATA.player, +stepSize, -stepSize);
        } else if (keys[KEYCODE_S]) {
            this.movePlayerWithinBounds(SCENE_DATA.player, -stepSize, +stepSize);
        }
    }

    private movePlayerWithinBounds(player: Player, dx: number, dy: number) {
        let desiredX = player.position.x + dx;
        let desiredY = player.position.y + dy;
        let desiredZ = 0;

        const isPermitted = this.isPositionInsideGameBounds(new Vector3(desiredX, desiredY, desiredZ));
        if (isPermitted) {
            player.move(dx, dy);
        }
    }

    private isPositionInsideGameBounds(position: Vector3): boolean {
        let isPermitted = false;

        const walkableFaces = SCENE_DATA.faces.filter(face => face.isWalkable);
        // console.debug("walkableFaces: ", walkableFaces);

        if (walkableFaces.length > 0) {
            for (const face of walkableFaces) {
                let points = face.coords;
                // if inside bounds of a walkable face, approve request to move
                if (Util.isPointInPolygon3D(points, position)) {
                    isPermitted = true;
                }
            }
        } else {
            console.warn("EMPTY: ", walkableFaces);
        }

        return isPermitted;
    }
}
