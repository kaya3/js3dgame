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
    public static CAMERA_ZOOM_SPEED = 1/1000;
    public static MAX_ZOOM = 4;
    public static MIN_ZOOM = 1/4;
    public static PLAYER_SPEED = 1/500;
    public static NPC_SPEED = 0.08;

    public readonly camera: Camera;
    public readonly player: Player;
    public readonly playerLight: PointLight;
    public readonly npcs: NPC[];
    public readonly npc: NPC;
	public readonly item: Item;
	
    public constructor(public scene: Scene2) {
        this.player = new Player(Vector3.ZERO, scene.as3d.data.playerSprite);
        this.npc = new NPC(new Vector3(2.5, 17, 0), scene.as3d.data.npcSprite);
        this.item = new Item(new Vector3(2.3, 4, 0), scene.as3d.data.itemSprite);


        const camera = this.camera = new Camera();
        this.player.onMove(p => {
			const pos2d = p.project2d();
            camera.moveTo(pos2d.x, pos2d.y);
		});
		
        const light = this.playerLight = new PointLight(Vector3.ZERO, Color.rgb(255, 255, 200), 1, 'dynamic');
        this.scene.as3d.addDynamicLight(light);
        const cameraOffset = new Vector3(0.105, 0.105, 0.452);
        this.player.onMove(p => light.pos = p.add(cameraOffset));
        this.player.setPos(scene.as3d.data.playerStartPos);


        this.npcs = [];
        for(let i=0; i<scene.as3d.data.numGeese; i++) {
            this.npcs[i] = new NPC(scene.as3d.data.playerStartPos, scene.as3d.data.npcSprite);
        }
    }

    public tick(dt: number, keys: { [k: number]: number }): void {
        let dc = dt * Game.CAMERA_SPEED;
        this.camera.translate(
            (keys[CAMERA_RIGHT] - keys[CAMERA_LEFT]) * dc, // right - left
            (keys[CAMERA_DOWN] - keys[CAMERA_UP]) * dc, // down - up
        );
        this.handleKeyPresses(dt, keys);
        this.moveNpcs();

        const newIntensity = this.playerLight.intensity + (Math.random() - 0.5)*dt/64;
        this.playerLight.intensity = Util.limitNumberRange(newIntensity, 0.8, 1.2);
    }

    private moveNpcs() {
        this.npcs.forEach(npc => {
            if(!this.moveSpriteWithinBounds(npc, npc.dx, npc.dy)) {
                npc.updateDirection();
            }
        });
    }

    private handleKeyPresses(dt: number, keys: { [k: number]: number }) {
        const dz = Game.CAMERA_ZOOM_SPEED * (keys[ZOOM_IN] - keys[ZOOM_DOWN]) * dt;
        this.camera.scale = Util.limitNumberRange(this.camera.scale * (1 + dz), Game.MIN_ZOOM, Game.MAX_ZOOM);
		
        const dxy = Game.PLAYER_SPEED * dt;
        this.moveSpriteWithinBounds(
            this.player,
            (keys[PLAYER_RIGHT] - keys[PLAYER_LEFT] - keys[PLAYER_DOWN] + keys[PLAYER_UP]) * dxy,
            (keys[PLAYER_RIGHT] - keys[PLAYER_LEFT] + keys[PLAYER_DOWN] - keys[PLAYER_UP]) * dxy
        );
    }

    private moveSpriteWithinBounds(sprite : Sprite, dx: number, dy: number) : boolean {
        const x = sprite.pos.x + dx;
        const y = sprite.pos.y + dy;

        const floors = this.findFloorsByXY(x, y);
        if (!floors.length) { return false; }

        const oldZ = sprite.pos.z;
        let closestZ = floors[0].projectZ(x, y);
        for(let i = 1; i < floors.length; ++i) {
            let newZ = floors[i].projectZ(x, y);
            if(Math.abs(newZ - oldZ) < Math.abs(closestZ - oldZ)) {
                closestZ = newZ;
            }
        }

        sprite.setPos(new Vector3(x, y, closestZ));

        return true;
    }

    private findFloorsByXY(x: number, y: number): Array<Polygon3> {
        const xy = new Vector3(x, y, 0);
        return this.scene.as3d.polygons
            .filter(face => face.isWalkable && Util.isPointInPolygon(face.points, xy));
    }
}
