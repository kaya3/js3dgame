const sqrt2 = Math.sqrt(2), sqrt3 = Math.sqrt(3), sqrt6 = Math.sqrt(6);

class Vector3 {
    public static readonly ZERO = new Vector3(0, 0, 0);
    public static readonly X_UNIT = new Vector3(1, 0, 0);
    public static readonly Y_UNIT = new Vector3(0, 1, 0);
    public static readonly Z_UNIT = new Vector3(0, 0, 1);

    public constructor(public readonly x: number, public readonly y: number, public readonly z: number) {}

    public add(other: Vector3): Vector3 {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    public subtract(other: Vector3): Vector3 {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    public lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public scale(factor: number): Vector3 {
        return new Vector3(factor * this.x, factor * this.y, factor * this.z);
    }

    public unit(): Vector3 {
        return this.scale(1 / this.length());
    }

    public dot(other: Vector3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    public cross(other: Vector3): Vector3 {
        return new Vector3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }

    public project2d(): Vector2 {
        return new Vector2(
            2 * CAMERA_SCALE * (this.x + this.y),
            CAMERA_SCALE * (this.y - this.x - sqrt6 * this.z)
        );
    }

    public cameraOrder(): number {
        return sqrt3 * (this.x - this.y) + sqrt2 * this.z;
    }

    public equals(other: Vector3, eps = 1e-5): boolean {
        return this.subtract(other).isZero(eps);
    }

    public isZero(eps = 1e-5): boolean {
        return Math.abs(this.x) < eps && Math.abs(this.y) < eps && Math.abs(this.z) < eps;
    }
}

class Vector2 {
    public constructor(public readonly x: number, public readonly y: number) {}

    public add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    public subtract(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    public scale(factor: number): Vector2 {
        return new Vector2(factor * this.x, factor * this.y);
    }

    public dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    public equals(other: Vector2, eps = 1e-10): boolean {
        return Math.abs(this.x - other.x) < eps
            && Math.abs(this.y - other.y) < eps;
    }
}

class Polygon3 {
    public readonly normal: Vector3;
    public readonly u: Vector3;
    public readonly v: Vector3;
	public readonly cameraOrder: number;
	private readonly xyBoundingBox: BoundingBox2;

    public constructor(public readonly points: ReadonlyArray<Vector3>, public readonly texture: ImageName, public readonly isWalkable: boolean) {
        const n = this.normal = points[1].subtract(points[0]).cross(points[2].subtract(points[1])).unit();
        let u = n.cross(Vector3.Z_UNIT);
        this.u = u = (u.isZero() ? Vector3.X_UNIT : u.unit());
        this.v = n.cross(u).unit();

        let m = points[0].cameraOrder();
        for (let i = 1; i < points.length; ++i) {
            m = Math.min(points[i].cameraOrder(), m);
        }
		this.cameraOrder = -m;
		
		this.xyBoundingBox = new BoundingBox2(points);
    }

    public project2d(): Polygon2 {
        return new Polygon2(
            this.points.map(v => v.project2d()),
            this
        );
    }

    public projectZ(x: number, y: number): number {
        let n = this.normal;
        return (n.dot(this.points[0]) - x * n.x - y * n.y) / n.z;
    }

    public contains(point: Vector3): boolean {
		return this.xyBoundingBox.contains(point)
			&& Util.isPointInPolygon(this.points, point);
    }
}

class Polygon2 {
	public readonly boundingBox: BoundingBox2;
	public readonly uvTransform: UVTransform;

    public constructor(public readonly points: ReadonlyArray<Vector2>, public readonly as3d: Polygon3) {
		this.boundingBox = new BoundingBox2(points);
		
        const u = as3d.u.project2d();
        const v = as3d.v.project2d();
        const p = points[0];
        this.uvTransform = new UVTransform(
            u.x, u.y,
            v.x, v.y,
            p.x, p.y
		);
    }

    public drawPath(ctx: CanvasRenderingContext2D): void {
        const points = this.points;
        ctx.beginPath();
        let v = points[0];
        ctx.moveTo(v.x, v.y);
        for (let i = 1; i < points.length; ++i) {
            v = points[i];
            ctx.lineTo(v.x, v.y);
        }
        ctx.closePath();
    }

    public contains(point: Vector2): boolean {
		return this.boundingBox.contains(point)
			&& Util.isPointInPolygon(this.points, point);
    }
}

class BoundingBox2 {
	public readonly left: number;
	public readonly top: number;
	public readonly right: number;
	public readonly bottom: number;
	constructor(points: ReadonlyArray<Vector2|Vector3>) {
		let p = points[0];
		let left = p.x, top = p.y, right = p.x, bottom = p.y;
		for(let i = 1; i < points.length; ++i) {
			p = points[i];
			left = Math.min(left, p.x);
			top = Math.min(left, p.y);
			right = Math.max(left, p.x);
			bottom = Math.max(left, p.y);
		}
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
	}
	
	public contains(point: Vector2|Vector3): boolean {
		return this.left <= point.x && point.x <= this.right
			&& this.top <= point.y && point.y <= this.bottom;
	}
}
