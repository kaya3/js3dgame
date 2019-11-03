type OnMoveCallback = (pos: Vector3) => void;

class Sprite {
    private readonly onMoveCallbacks: Array<OnMoveCallback> = [];

    constructor(public pos: Vector3, public readonly sprite: ImageName) {}

    public setPos(pos: Vector3): void {
        this.pos = pos;
        let callbacks = this.onMoveCallbacks;
        for(let i = 0; i < callbacks.length; ++i) {
            callbacks[i](pos);
        }
    }

    public onMove(callback: OnMoveCallback): void {
        this.onMoveCallbacks.push(callback);
    }
}
