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
		this.moveTo(0, 0);
    }

	public moveTo(x: number, y: number): void {
		this.x = x; this.y = y;
        this.tlX = this.width / 2 - x;
        this.tlY = this.height / 2 - y;
	}
    public translate(dx: number, dy: number): void {
		this.moveTo(this.x + dx, this.y + dy);
    }
	
    public setTransform(ctx: CanvasRenderingContext2D): void {
        ctx.setTransform(this.scale, 0, 0, this.scale, this.tlX, this.tlY);
    }
}
