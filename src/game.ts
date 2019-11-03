// Reference Values
const KEYCODE_PAGE_UP = 33;
const KEYCODE_PAGE_DOWN = 34;
const KEYCODE_Q = 81;
const KEYCODE_E = 69;
const KEYCODE_W = 87;
const KEYCODE_A = 65;
const KEYCODE_S = 83;
const KEYCODE_D = 68;
const KEYCODE_ARROW_LEFT = 37;
const KEYCODE_ARROW_RIGHT = 39;
const KEYCODE_ARROW_UP = 38;
const KEYCODE_ARROW_DOWN = 40;


// Configuration Options:
const PLAYER_UP = KEYCODE_ARROW_UP;
const PLAYER_DOWN = KEYCODE_ARROW_DOWN;
const PLAYER_RIGHT = KEYCODE_ARROW_RIGHT;
const PLAYER_LEFT = KEYCODE_ARROW_LEFT;

const CAMERA_UP = KEYCODE_W;
const CAMERA_DOWN = KEYCODE_S;
const CAMERA_RIGHT = KEYCODE_D;
const CAMERA_LEFT = KEYCODE_A;

// const ZOOM_IN = KEYCODE_Q;
// const ZOOM_DOWN = KEYCODE_E;
const ZOOM_IN = KEYCODE_PAGE_UP;
const ZOOM_DOWN = KEYCODE_PAGE_DOWN;


class Game {
    public static CAMERA_SPEED = 0.4;
    public static CAMERA_ZOOM_SPEED = 0.001;
    public static MAX_ZOOM = 4;
    public static MIN_ZOOM = 0.25;
    public static PLAYER_SPEED = 0.003;

    public readonly camera: Camera;
    public readonly player: Player;
    public readonly playerLight: PointLight;

    public constructor(public scene: Scene2) {
        this.player = new Player(Vector3.ZERO, scene.as3d.data.playerSprite);

        this.camera = new Camera();
        this.player.onMove(p => {
            // TODO: update camera position
        });

        const light = this.playerLight = new PointLight(Vector3.ZERO, new RGB(255, 255, 200), 1, 'dynamic');
        this.scene.as3d.addDynamicLight(light);
        const halfZ = new Vector3(0, 0, 0.5);
        this.player.onMove(p => light.pos = p.add(halfZ));
        this.player.setPos(scene.as3d.data.playerStartPos);
    }

    public tick(dt: number, keys: { [k: number]: number }): void {
        let dc = dt * Game.CAMERA_SPEED;
        this.camera.translate(
            (keys[CAMERA_RIGHT] - keys[CAMERA_LEFT]) * dc, // right - left
            (keys[CAMERA_DOWN] - keys[CAMERA_UP]) * dc, // down - up
        );

        this.handleKeyPresses(dt, keys);
    }

    private handleKeyPresses(dt: number, keys: { [k: number]: number }) {
        let dz = (keys[ZOOM_IN] - keys[ZOOM_DOWN]) * dt * Game.CAMERA_ZOOM_SPEED;
        this.camera.scale = Util.limitNumberRange(this.camera.scale + dz, Game.MIN_ZOOM, Game.MAX_ZOOM);

        const dxy = Game.PLAYER_SPEED * dt;
        this.movePlayerWithinBounds(
            (keys[PLAYER_RIGHT] - keys[PLAYER_LEFT] - keys[PLAYER_DOWN] + keys[PLAYER_UP]) * dxy,
            (keys[PLAYER_RIGHT] - keys[PLAYER_LEFT] + keys[PLAYER_DOWN] - keys[PLAYER_UP]) * dxy
        );
    }

    private movePlayerWithinBounds(dx: number, dy: number) {
        const player = this.player;
        const x = player.pos.x + dx;
        const y = player.pos.y + dy;

        const floors = this.findFloorsByXY(x, y);
        if (!floors.length) { return; }

        const oldZ = player.pos.z;
        let closestZ = floors[0].projectZ(x, y);
        for(let i = 1; i < floors.length; ++i) {
            let newZ = floors[i].projectZ(x, y);
            if(Math.abs(newZ - oldZ) < Math.abs(closestZ - oldZ)) {
                closestZ = newZ;
            }
        }

        player.setPos(new Vector3(x, y, closestZ));
    }

    private findFloorsByXY(x: number, y: number): Array<Polygon3> {
        const xy = new Vector3(x, y, 0);
        return this.scene.as3d.polygons
            .filter(face => face.isWalkable && Util.isPointInPolygon3D(face.points, xy));
    }
}
