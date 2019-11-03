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

}
