class RGB {
    public constructor(public readonly r: number, public readonly g: number, public readonly b: number) {}

    public toString(alpha = 1): string {
        let r = this.r, g = this.g, b = this.b;
        alpha = Math.min(alpha, 1);
        return ['rgba(', r, ',', g, ',', b, ',', alpha, ')'].join('');
    }
}

type LightKind = 'ambient' | 'static' | 'dynamic';

interface Light {
    kind: LightKind;

    drawForPolygon(ctx: CanvasRenderingContext2D, camera: Camera, polygon: Polygon2): void;
}

class AmbientLight implements Light {
    public readonly kind = 'ambient';

    public constructor(public readonly color: RGB) {}

    public drawForPolygon(ctx: CanvasRenderingContext2D, camera: Camera, polygon: Polygon2): void {
        throw new Error('Ambient light should not be drawn per-polygon');
    }
}

class DirectionalLight implements Light {
    public readonly kind = 'static';
    private readonly direction: Vector3;

    public constructor(direction: Vector3, private readonly color: RGB) {
        this.direction = direction.unit();
    }

    public drawForPolygon(ctx: CanvasRenderingContext2D, camera: Camera, polygon: Polygon2): void {
        const intensity = -polygon.as3d.normal.dot(this.direction);
        if (intensity > 0) {
            camera.setTransform(ctx);
            polygon.drawPath(ctx);
            ctx.fillStyle = this.color.toString(intensity);
            ctx.fill();
        }
    }
}

class PointLight implements Light {
    public constructor(
        public pos: Vector3,
        private readonly color: RGB,
        private readonly intensity: number,
        public readonly kind: 'static' | 'dynamic'
    ) {}

    public drawForPolygon(ctx: CanvasRenderingContext2D, camera: Camera, polygon: Polygon2): void {
        const MAX_D = 10;
        const MAX_R = 10;
        const COLOR_STOPS = 10;

        const normal = polygon.as3d.normal;
		const uvOrigin = polygon.as3d.points[0];
		
		// add epsilon to correct for numerical error, and avoid div0
        const distance = this.pos.subtract(uvOrigin).dot(normal) + 0.1;

        if (distance >= 0 && distance < MAX_D) {
            const projected = this.pos.subtract(normal.scale(distance));
            const uvOffset = projected.subtract(uvOrigin);

            const u = polygon.as3d.u.dot(uvOffset);
            const v = polygon.as3d.v.dot(uvOffset);

            camera.setTransform(ctx);
            polygon.drawPath(ctx);

            polygon.uvTransform.apply(ctx, camera);

            let gradient = ctx.createRadialGradient(u, v, 0, u, v, MAX_R);
            let d2 = distance * distance;

            for (let i = 0; i < COLOR_STOPS; ++i) {
                let p = i * i / (COLOR_STOPS * COLOR_STOPS);
                let r = MAX_R * p;
                let denominator = Math.pow(d2 + r * r, 1.5);
                let stopIntensity = this.intensity * distance / (denominator + 1e-5);
                gradient.addColorStop(p, this.color.toString(stopIntensity));
            }
            gradient.addColorStop(1, this.color.toString(0));

            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }
}
