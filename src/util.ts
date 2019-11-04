class Util {
    public static jitter(val: number, d: number) {
        return Util.limitNumberRange(val, val - d, val + d);
    }

    public static limitNumberRange(val: number, min: number, max: number) {
        return Math.min(max, Math.max(min, val));
    }

    public static isNumberInRangeExclusive(num: number, lowerLimit: number, upperLimit: number) {
        return (num > lowerLimit) && (num < upperLimit)
    }

    public static isNumberInRangeInclusive(num: number, lowerLimit: number, upperLimit: number) {
        return (num >= lowerLimit) && (num <= upperLimit)
    }

    public static isIntersecting(pointX: number, pointY: number, startX: number, startY: number, endX: number, endY: number): boolean {
        return ((startY > pointY) != (endY > pointY)) && (pointX < (endX - startX) * (pointY - startY) / (endY - startY) + startX);
    }

    public static isPointInPolygon<T extends Vector2 | Vector3>(vertices: ReadonlyArray<T>, point: T) {
        let isInside = false;
        // Draw a line from the given xy coordinate toward the direction of each point in the polygon
        // An odd number of intersections indicates that the given point is NOT inside the polygon
        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            if (Util.isIntersecting(point.x, point.y, vertices[i].x, vertices[i].y, vertices[j].x, vertices[j].y)) {
                isInside = !isInside;
            }
        }
        return isInside;
    }
}
