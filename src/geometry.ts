const sqrt2 = Math.sqrt(2), sqrt3 = Math.sqrt(3), sqrt6 = Math.sqrt(6), CAMERA_SCALE = 6;

class Vector3 {
<<<<<<< HEAD
	public static readonly ZERO = new Vector3(0, 0, 0);
	public static readonly X_UNIT = new Vector3(1, 0, 0);
	public static readonly Y_UNIT = new Vector3(0, 1, 0);
	public static readonly Z_UNIT = new Vector3(0, 0, 1);
	
=======
	public static CAMERA_NORMAL: Vector3;

>>>>>>> c4ba09ecfa6e2816569578638bc150566d43ac2a
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
	public equals(other: Vector3, eps=1e-10): boolean {
		return Math.abs(this.x - other.x) < eps
			&& Math.abs(this.y - other.y) < eps
			&& Math.abs(this.z - other.z) < eps;
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
	public readonly cameraOrder: number;
	public constructor(public readonly points: ReadonlyArray<Vector3>, public readonly texture: TextureName) {
		this.normal = points[1].subtract(points[0]).cross(points[2].subtract(points[1])).unit();
		
		var points = this.points;
		var m = points[0].cameraOrder();
		for(var i = 1; i < points.length; ++i) {
			m = Math.min(points[i].cameraOrder(), m);
		}
		this.cameraOrder = m;
	}
	public project2d(): Polygon2 {
		return new Polygon2(
			this.points.map(v => v.project2d()),
			this
		);
	}
}

class Polygon2 {
	public readonly textureTransform: TextureTransform;
	public constructor(public readonly points: ReadonlyArray<Vector2>, public readonly as3d: Polygon3) {
		var u3 = as3d.normal.cross(Vector3.Z_UNIT);
		if(u3.equals(Vector3.ZERO)) { u3 = Vector3.X_UNIT; } else { u3 = u3.unit(); }
		const u = u3.project2d();
		const v = as3d.normal.cross(u3).unit().project2d();
		const p = points[0];
		
		this.textureTransform = {
			a: u.x * TEXTURE_SCALE,
			b: u.y * TEXTURE_SCALE,
			c: v.x * TEXTURE_SCALE,
			d: v.y * TEXTURE_SCALE,
			x: p.x,
			y: p.y
		};
	}
}

class Scene3 {
	public constructor(private readonly polygons: Array<Polygon3> = []) {}

	public addPolygon(polygon: Polygon3): void {
		this.polygons.push(polygon);
	}

	public project2d(): Scene2 {
		return new Scene2(this.polygons.map(p => p.project2d()));
	}
}

class Scene2 {
	public constructor(public readonly polygons: Array<Polygon2>) {
		polygons.sort((p,q) => p.as3d.cameraOrder - q.as3d.cameraOrder);
	}
}
