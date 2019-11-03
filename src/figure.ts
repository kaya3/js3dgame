class Figure {
    private canvasPosX: number;
    private canvasPosY: number;
    private canvasPosZ: number;
    private textureName: ImageName;

    constructor(canvasPosX: number, canvasPosY: number, canvasPosZ: number, textureName : ImageName) {
        this.canvasPosX = canvasPosX;
        this.canvasPosY = canvasPosY;
        this.canvasPosZ = canvasPosZ;
        this.textureName = textureName;
    }

    public getTextureName() : ImageName {
        return this.textureName;
    }

    public getX() {
        return this.canvasPosX;
    }
    public getY() {
        return this.canvasPosY;
    }
}
