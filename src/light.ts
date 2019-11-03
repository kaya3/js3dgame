class RGB {
	public constructor(public readonly r: number, public readonly g: number, public readonly b: number) {}
	
	public toString(alpha=1): string {
		return ['rgba(', this.r|0, ',', this.g|0, ',', this.b|0, ',', alpha, ')'].join('');
	}
}

type LightKind = 'ambient'|'static'|'dynamic';
interface Light {
	kind: LightKind;
	drawForPolygon(ctx: CanvasRenderingContext2D, camera: Camera, polygon: Polygon2): void;
}

class AmbientLight implements Light {
	public constructor(public readonly color: RGB) {}
	
	public readonly kind = 'ambient';
	public drawForPolygon(ctx: CanvasRenderingContext2D, camera: Camera, polygon: Polygon2): void {
		throw new Error('Ambient light should not be drawn per-polygon');
	}
}

class DirectionalLight implements Light {
	private readonly direction: Vector3;
	public constructor(direction: Vector3, private readonly color: RGB) {
		this.direction = direction.unit();
	}
	
	public readonly kind = 'static';
	public drawForPolygon(ctx: CanvasRenderingContext2D, camera: Camera, polygon: Polygon2): void {
		const intensity = -polygon.as3d.normal.dot(this.direction);
		if(intensity > 0) {
			camera.setTransform(ctx);
			polygon.drawPath(ctx);
			ctx.fillStyle = this.color.toString(intensity);
			ctx.fill();
		}
	}
}

class PointLight implements Light {
	public constructor(
		private readonly pos: Vector3,
		private readonly color: RGB,
		private readonly intensity: number,
		public readonly kind: 'static'|'dynamic'
	) {}
	
	public drawForPolygon(ctx: CanvasRenderingContext2D, camera: Camera, polygon: Polygon2): void {
		const normal = polygon.as3d.normal;
		const uvOrigin = polygon.as3d.points[0];
		const distance = this.pos.subtract(uvOrigin).dot(normal);
		
		if(distance >= 0) {
			const projected = this.pos.subtract(normal.scale(distance));
			const uvOffset = projected.subtract(uvOrigin);
			
			const u = polygon.as3d.u.dot(uvOffset);
			const v = polygon.as3d.v.dot(uvOffset);
			
			ctx.save();
			
			camera.setTransform(ctx);
			polygon.drawPath(ctx);
			ctx.clip();
			polygon.uvTransform.apply(ctx, camera);
			ctx.fillStyle = this.color.toString();
			ctx.fillRect(u-0.25, v-0.25, 0.5, 0.5);
			
			ctx.restore();
		}
	}
}
