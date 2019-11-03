class Scene3 {
    public readonly polygons: ReadonlyArray<Polygon3>;
    public readonly ambientLightColor: Color;
    public readonly staticLights: ReadonlyArray<Light>;
    public dynamicLights: Array<Light>;

    public constructor(public readonly data: SceneData) {
        this.polygons = data.faces.map(face => new Polygon3(face.coords, face.texture, face.isWalkable));
        let amb = data.lights.filter(x => x.kind === 'ambient')[0] as AmbientLight | undefined;
        this.ambientLightColor = (amb ? amb.color : Color.greyscale(0));
        this.staticLights = data.lights.filter(x => x.kind === 'static');
        this.dynamicLights = data.lights.filter(x => x.kind === 'dynamic');
    }

    public project2d(): Scene2 {
        return new Scene2(
            this.polygons.map(p => p.project2d()),
            this
        );
    }

    public addDynamicLight(light: Light): void {
        if(light.kind !== 'dynamic') {
            throw new Error('Cannot add ' + light.kind + ' light dynamically');
        }
        this.dynamicLights.push(light);
    }
}

class Scene2 {
    public readonly polygons: ReadonlyArray<Polygon2>;

    public constructor(polygons: Array<Polygon2>, public readonly as3d: Scene3) {
        this.polygons = polygons.sort((p, q) => p.as3d.cameraOrder - q.as3d.cameraOrder);
    }
}
