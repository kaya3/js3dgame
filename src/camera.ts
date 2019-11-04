class Camera {
    public tlX: number = 0;
    public tlY: number = 0;
    public halfWidth: number = 0;
    public halfHeight: number = 0;
    public x: number = 0;
    public y: number = 0;
    public scale: number = 1;

    public resizeWindow(width: number, height: number): void {
        this.halfWidth = width / 2;
        this.halfHeight = height / 2;
        this.moveTo(0, 0);
    }

    public moveTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.tlX = this.halfWidth - x;
        this.tlY = this.halfHeight - y;
    }

    public translate(dx: number, dy: number): void {
        this.moveTo(this.x + dx, this.y + dy);
    }

    public setTransform(ctx: CanvasRenderingContext2D): void {
        ctx.setTransform(this.scale, 0, 0, this.scale, this.tlX, this.tlY);
    }
}
