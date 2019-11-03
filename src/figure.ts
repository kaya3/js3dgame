class Figure {
    private canvasPosX: number;
    private canvasPosY: number;
    private canvasPosZ: number;
    private texture: TextureName;

    constructor(canvasPosX: number, canvasPosY: number, canvasPosZ: number) {
        this.canvasPosX = canvasPosX;
        this.canvasPosY = canvasPosY;
        this.canvasPosZ = canvasPosZ;
        this.texture = "stick_figure";
    }

    drawOn(ctx: CanvasRenderingContext2D) {
        var spriteWidth  = 40,
            spriteHeight = 64,
            pixelsLeft   = 0,
            pixelsTop    = 0;

        var playerImg = new Image();
        playerImg.src = TEXTURES[this.texture];

        ctx.drawImage(
            playerImg,
            pixelsLeft,
            pixelsTop,
            spriteWidth,
            spriteHeight,
            this.canvasPosX,
            this.canvasPosY,
            spriteWidth,
            spriteHeight
        );
    }
}
