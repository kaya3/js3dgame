class Camera {
    public tlX: number = 0;
    public tlY: number = 0;
    public width: number = 0;
    public height: number = 0;
    public x: number = 0;
    public y: number = 0;
    public scale: number = 1;

    public resizeWindow(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.tlX = width / 2 - this.x;
        this.tlY = height / 2 - this.y;
    }

    public translate(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
        this.tlX -= dx;
        this.tlY -= dy;
    }

    public setTransform(ctx: CanvasRenderingContext2D): void {
        ctx.setTransform(this.scale, 0, 0, this.scale, this.tlX, this.tlY);
    }
}