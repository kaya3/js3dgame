"use strict";
var sqrt2 = Math.sqrt(2), sqrt3 = Math.sqrt(3), sqrt6 = Math.sqrt(6), CAMERA_SCALE = 32;
var Vector3 = /** @class */ (function () {
    function Vector3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vector3.prototype.add = function (other) {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    };
    Vector3.prototype.subtract = function (other) {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    };
    Vector3.prototype.lengthSquared = function () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    };
    Vector3.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
    Vector3.prototype.scale = function (factor) {
        return new Vector3(factor * this.x, factor * this.y, factor * this.z);
    };
    Vector3.prototype.unit = function () {
        return this.scale(1 / this.length());
    };
    Vector3.prototype.dot = function (other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    };
    Vector3.prototype.cross = function (other) {
        return new Vector3(this.y * other.z - this.z * other.y, this.x * other.z - this.z * other.x, this.x * other.y - this.y * other.x);
    };
    Vector3.prototype.project2d = function () {
        return new Vector2(2 * CAMERA_SCALE * (this.x + this.y), CAMERA_SCALE * (this.y - this.x - sqrt6 * this.z));
    };
    Vector3.prototype.cameraOrder = function () {
        return sqrt3 * (this.x - this.y) + sqrt2 * this.z;
    };
    Vector3.prototype.equals = function (other, eps) {
        if (eps === void 0) { eps = 1e-10; }
        return Math.abs(this.x - other.x) < eps
            && Math.abs(this.y - other.y) < eps
            && Math.abs(this.z - other.z) < eps;
    };
    return Vector3;
}());
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.add = function (other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    };
    Vector2.prototype.subtract = function (other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    };
    Vector2.prototype.scale = function (factor) {
        return new Vector2(factor * this.x, factor * this.y);
    };
    Vector2.prototype.dot = function (other) {
        return this.x * other.x + this.y * other.y;
    };
    Vector2.prototype.equals = function (other, eps) {
        if (eps === void 0) { eps = 1e-10; }
        return Math.abs(this.x - other.x) < eps
            && Math.abs(this.y - other.y) < eps;
    };
    return Vector2;
}());
var Polygon3 = /** @class */ (function () {
    function Polygon3(points) {
        this.points = points;
        this.normal = points[1].subtract(points[0]).cross(points[2].subtract(points[1])).unit();
    }
    Polygon3.prototype.cameraOrder = function () {
        var points = this.points;
        var m = points[0].cameraOrder();
        for (var i = 1; i < points.length; ++i) {
            m = Math.min(points[i].cameraOrder(), m);
        }
        return m;
    };
    Polygon3.prototype.project2d = function () {
        return new Polygon2(this.points.map(function (v) { return v.project2d(); }), this.cameraOrder());
    };
    return Polygon3;
}());
var Polygon2 = /** @class */ (function () {
    function Polygon2(points, order) {
        this.points = points;
        this.order = order;
    }
    return Polygon2;
}());
var Scene3 = /** @class */ (function () {
    function Scene3(polygons) {
        if (polygons === void 0) { polygons = []; }
        this.polygons = polygons;
    }
    Scene3.prototype.addPolygon = function (polygon) {
        this.polygons.push(polygon);
    };
    Scene3.prototype.project2d = function () {
        return new Scene2(this.polygons.map(function (p) { return p.project2d(); }));
    };
    return Scene3;
}());
var Scene2 = /** @class */ (function () {
    function Scene2(polygons) {
        this.polygons = polygons;
    }
    return Scene2;
}());
var Renderer = /** @class */ (function () {
    function Renderer(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    Renderer.prototype.draw = function (scene, cameraPos) {
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = '#0000D0';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#00D000';
        var polygons = scene.polygons;
        for (var i = 0; i < polygons.length; ++i) {
            this.drawPolygon(polygons[i], cameraPos);
        }
    };
    Renderer.prototype.drawPolygon = function (polygon, cameraPos) {
        var ctx = this.ctx;
        var points = polygon.points;
        ctx.beginPath();
        var v = points[0].subtract(cameraPos);
        ctx.moveTo(v.x, v.y);
        for (var i = 1; i < points.length; ++i) {
            v = points[i].subtract(cameraPos);
            ctx.lineTo(v.x, v.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    return Renderer;
}());
function main(canvas) {
    function vec(x, y, z) {
        return new Vector3(x, y, z);
    }
    var scene = new Scene3([
        new Polygon3([vec(0, 0, 0), vec(0, 10, 0), vec(10, 10, 0), vec(10, 0, 0)]),
        new Polygon3([vec(10, 0, 0), vec(10, 0, 2), vec(10, 10, 2), vec(10, 10, 0)]),
        new Polygon3([vec(0, 0, 0), vec(0, 0, 2), vec(10, 0, 2), vec(10, 0, 0)]),
    ]).project2d();
    var game = new Renderer(canvas);
    var cameraPos = new Vector2(-100, -400);
    function tick() {
        game.draw(scene, cameraPos);
        window.requestAnimationFrame(tick);
    }
    tick();
}
