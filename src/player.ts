class Player extends Sprite {
    constructor(public position: Vector3, public readonly sprite: ImageName) {
        super(position, sprite);
    }

    public walk(dx: number, dy: number): void {
        super.move(dx, dy);
    }
}