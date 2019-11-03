class Util {
    public static limitNumberRange(val: number, min: number, max: number) {
        if (val < min) {
            return min;
        }
        if (val > max) {
            return max;
        }
        return val;
    }

    public static convertInputSceneJsonToPolygonArray(sceneData: SceneData): Polygon3[] {
        return sceneData.faces.map(faceJson => {
            const vecArray: Vector3[] = faceJson.coords.map(coord => {
                return new Vector3(coord.x, coord.y, coord.z);
            });
            const texture = faceJson.texture;
            return new Polygon3(vecArray, texture);
        });
    }
}
