class Vector3 {
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
			this.x * other.z - this.z * other.x,
			this.x * other.y - this.y * other.x
		);
	}
	public project2d(): Vector2 {
		// TODO
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
	public constructor(public readonly points: ReadonlyArray<Vector3>) {
		this.normal = points[1].subtract(points[0]).cross(points[2].subtract(points[1])).unit();
	}
	public project2d(): Polygon2 {
		return new Polygon2(this.points.map(v => v.project2d()));
	}
}

class Polygon2 {
	public constructor(public readonly points: ReadonlyArray<Vector2>) {}
}

class Scene3 {
	private readonly polygons: Array<Polygon3> = [];
	
	public addPolygon(polygon: Polygon3): void {
		this.polygons.push(polygon);
	}
}
