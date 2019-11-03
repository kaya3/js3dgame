const sqrt2 = Math.sqrt(2), sqrt3 = Math.sqrt(3), sqrt6 = Math.sqrt(6), CAMERA_SCALE = 20;

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
		return this.scale(1/this.length());
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
	public equals(other: Vector3, eps=1e-5): boolean {
		return this.subtract(other).isZero(eps);
	}
	public isZero(eps=1e-5): boolean {
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
	public equals(other: Vector2, eps=1e-10): boolean {
		return Math.abs(this.x - other.x) < eps
			&& Math.abs(this.y - other.y) < eps;
	}
}

class Polygon3 {
	public readonly normal: Vector3;
	public readonly u: Vector3;
	public readonly v: Vector3;
	public readonly cameraOrder: number;

	public constructor(public readonly points: ReadonlyArray<Vector3>, public readonly texture: ImageName) {
		const n = this.normal = points[1].subtract(points[0]).cross(points[2].subtract(points[1])).unit();
		let u = n.cross(Vector3.Z_UNIT);
		this.u = u = (u.isZero() ? Vector3.X_UNIT : u.unit());
		this.v = n.cross(u).unit();

		let m = points[0].cameraOrder();
		for (let i = 1; i < points.length; ++i) {
			m = Math.min(points[i].cameraOrder(), m);
		}
		this.cameraOrder = -m;
	}

	public project2d(): Polygon2 {
		return new Polygon2(
			this.points.map(v => v.project2d()),
			this
		);
	}

	public contains(point: Vector3): boolean {
		return Util.isPointInPolygon3D(this.points, point);
	}
}

class Polygon2 {
	public readonly uvTransform: UVTransform;
	public constructor(public readonly points: ReadonlyArray<Vector2>, public readonly as3d: Polygon3) {
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
		for(let i = 1; i < points.length; ++i) {
			v = points[i];
			ctx.lineTo(v.x, v.y);
		}
		ctx.closePath();
	}

	public contains(point: Vector2): boolean {
		return Util.isPointInPolygon2D(this.points, point);
	}
}

class Scene3 {
	public readonly ambientLightColor: RGB;
	public readonly staticLights: ReadonlyArray<Light>;
	public readonly dynamicLights: ReadonlyArray<Light>;

	public constructor(private readonly polygons: ReadonlyArray<Polygon3> = [], lights: Array<Light>) {
		let amb = lights.filter(x => x.kind === 'ambient')[0] as AmbientLight|undefined;
		this.ambientLightColor = (amb ? amb.color : new RGB(0, 0, 0));
		this.staticLights = lights.filter(x => x.kind === 'static');
		this.dynamicLights = lights.filter(x => x.kind === 'dynamic');
	}

	public project2d(): Scene2 {
		return new Scene2(
			this.polygons.map(p => p.project2d()),
			this
		);
	}
}

class Scene2 {
	public readonly polygons: ReadonlyArray<Polygon2>;
	public constructor(polygons: Array<Polygon2>, public readonly as3d: Scene3) {
		this.polygons = polygons.sort((p,q) => p.as3d.cameraOrder - q.as3d.cameraOrder);
	}
}
