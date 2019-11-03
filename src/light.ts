class Color {
    public constructor(public readonly r: number, public readonly g: number, public readonly b: number) {}

    public static greyscale(n : number) {
        return new Color(n,n,n);
    }

    public static rgb(r: number, g: number, b: number) {
        return new Color(r,g,b);
    }

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

    public constructor(public readonly color: Color) {}

    public drawForPolygon(ctx: CanvasRenderingContext2D, camera: Camera, polygon: Polygon2): void {
        throw new Error('Ambient light should not be drawn per-polygon');
    }
}

class DirectionalLight implements Light {
    public readonly kind = 'static';
    private readonly direction: Vector3;

    public constructor(direction: Vector3, private readonly color: Color) {
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
        private readonly color: Color,
        private readonly intensity: number,
        public readonly kind: 'static' | 'dynamic'
    ) {}

    public drawForPolygon(ctx: CanvasRenderingContext2D, camera: Camera, polygon: Polygon2): void {
        const MAX_D = 10;
        const MAX_R = 10;
        const COLOR_STOPS = 10;

        const normal = polygon.as3d.normal;
        const uvOrigin = polygon.as3d.points[0];
        const distance = this.pos.subtract(uvOrigin).dot(normal);

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
                let stopIntensity = this.intensity * distance / (denominator + 1e-5); // add epsilon to avoid div0
                gradient.addColorStop(p, this.color.toString(stopIntensity));
            }
            gradient.addColorStop(1, this.color.toString(0));

            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }
}
