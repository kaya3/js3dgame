class Figure {
    private x: number;
    private y: number;
    private z: number;
    private texture: TextureName;
    private width: number;

    constructor(x:number, y:number, z:number, width: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.texture = "stick-figure";
    }


    public getPolygon(): Polygon3 {
        const halfWidth = this.width / 2;

        const vecArray: Vector3[] = [
            new Vector3(this.x - halfWidth, this.y, this.z),
            new Vector3(this.x - halfWidth, this.y, this.z + this.width),
            new Vector3(this.x + halfWidth, this.y, this.z + this.width),
            new Vector3(this.x + halfWidth, this.y, this.z),
        ];

        return new Polygon3(vecArray, this.texture);
    }


}