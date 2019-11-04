class Color {
    private constructor(public readonly r: number, public readonly g: number, public readonly b: number) {}

    public static greyscale(n: number) {
        return new Color(n, n, n);
    }

    public static rgb(r: number, g: number, b: number) {
        return new Color(r, g, b);
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

    drawForCamera(ctx: CanvasRenderingContext2D, camera: Camera): void;
}

class AmbientLight implements Light {
    public readonly kind = 'ambient';

    public constructor(public readonly color: Color) {}

    public drawForPolygon(ctx: CanvasRenderingContext2D, camera: Camera, polygon: Polygon2): void {
        throw new Error('Ambient light should not be drawn per-polygon');
    }

    drawForCamera(ctx: CanvasRenderingContext2D, camera: Camera): void {
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

    drawForCamera(ctx: CanvasRenderingContext2D, camera: Camera): void {}
}

class PointLight implements Light {
    private intensity: number;
    private flickerJitterMagnitude: number;

    public constructor(
        public pos: Vector3,
        public color: Color,
        public maximumIntensity: number,
        public status: 'off' | 'flickering' | 'maximum',
        public readonly kind: 'static' | 'dynamic'
    ) {
        this.intensity = maximumIntensity;
        this.flickerJitterMagnitude = 2 / 10;
    }

    public updateIntensity(dt: number) {
        if (this.status === 'off') {
            this.intensity = 0;
        } else if (this.status === 'maximum') {
            this.intensity = this.maximumIntensity;
        } else if (this.status === 'flickering') {
            const delta = (Math.random() - 0.5) * dt / 64;
            const newIntensity = this.intensity + delta;
            this.intensity = Util.jitter(newIntensity, this.maximumIntensity * this.flickerJitterMagnitude);
        }
    }

    public drawForPolygon(ctx: CanvasRenderingContext2D, camera: Camera, polygon: Polygon2): void {
        const MAX_D = 10;
        const MAX_R = 10;

        const normal = polygon.as3d.normal;
        const uvOrigin = polygon.as3d.points[0];

        // add epsilon to correct for numerical error, and avoid div0
        const distance = this.pos.subtract(uvOrigin).dot(normal) + 1 / 64;

        if (distance >= 0 && distance < MAX_D) {
            const projected = this.pos.subtract(normal.scale(distance));
            const uvOffset = projected.subtract(uvOrigin);

            const u = polygon.as3d.u.dot(uvOffset);
            const v = polygon.as3d.v.dot(uvOffset);

            camera.setTransform(ctx);
            polygon.drawPath(ctx);

            polygon.uvTransform.apply(ctx, camera);

            ctx.fillStyle = this.makeGradient(ctx, u, v, distance, MAX_R, 1);
            ctx.fill();
        }
    }

    drawForCamera(ctx: CanvasRenderingContext2D, camera: Camera): void {
        const pos2d = this.pos.project2d();
        const cx = pos2d.x, cy = pos2d.y, cs = 128 * camera.scale;
        camera.setTransform(ctx);

        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = this.makeGradient(ctx, cx, cy, 0.1, cs, cs / 1024);
        ctx.fillRect(cx - cs, cy - cs, 2 * cs, 2 * cs);
    }

    private makeGradient(ctx: CanvasRenderingContext2D, cx: number, cy: number, distance: number, radius: number, falloff: number): CanvasGradient {
        const COLOR_STOPS = 10;

        let gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        let d2 = distance * distance;
        for (let i = 0; i < COLOR_STOPS; ++i) {
            let p = i * i / (COLOR_STOPS * COLOR_STOPS);
            let r = radius * p * falloff;
            let denominator = Math.pow(d2 + r * r, 1.5);
            let stopIntensity = this.intensity * distance / (denominator + 1e-5);
            gradient.addColorStop(p, this.color.toString(stopIntensity));
        }
        gradient.addColorStop(1, this.color.toString(0));
        return gradient;
    }
}
