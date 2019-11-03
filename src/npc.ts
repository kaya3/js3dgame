class NPC extends Sprite {

    public dx: number;
    public dy: number;

    constructor(public pos: Vector3, public readonly sprite: ImageName) {
        super(pos, sprite);
        this.dx = this.dy = 0;

        this.updateDirection();
    }

    private randomSpeed(): number {
        return ((Math.random() * Game.NPC_SPEED) * 2) + Game.NPC_SPEED;
    }

    public updateDirection() {
        this.dx = this.randomSpeed();
        this.dy = this.randomSpeed();

        const rand = Math.random();
        if (rand < 0.1) {
            this.dx = this.dx * 2;
        } else if (rand < 0.2) {
            this.dy = this.dy * 2;
        } else if (rand < 0.4) {
            this.dx = this.dx * 3;
        } else if (rand < 0.5) {
            this.dy = this.dy * 3;
        }

        if (rand < 0.5) {
            this.dx = this.dx * -1;
        } else {
            this.dy = this.dy * -1;
        }
    }
}