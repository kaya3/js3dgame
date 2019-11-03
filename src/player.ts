class Player extends Sprite {
    constructor(public pos: Vector3, public readonly sprite: ImageName) {
        super(pos, sprite);
    }
}