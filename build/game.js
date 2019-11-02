"use strict";
var sqrt2 = Math.sqrt(2), sqrt3 = Math.sqrt(3), sqrt6 = Math.sqrt(6), CAMERA_SCALE = 50;
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
        return new Vector3(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
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
    Vector3.ZERO = new Vector3(0, 0, 0);
    Vector3.X_UNIT = new Vector3(1, 0, 0);
    Vector3.Y_UNIT = new Vector3(0, 1, 0);
    Vector3.Z_UNIT = new Vector3(0, 0, 1);
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
    function Polygon3(points, texture) {
        this.points = points;
        this.texture = texture;
        this.normal = points[1].subtract(points[0]).cross(points[2].subtract(points[1])).unit();
        var points = this.points;
        var m = points[0].cameraOrder();
        for (var i = 1; i < points.length; ++i) {
            m = Math.min(points[i].cameraOrder(), m);
        }
        this.cameraOrder = m;
    }
    Polygon3.prototype.project2d = function () {
        return new Polygon2(this.points.map(function (v) { return v.project2d(); }), this);
    };
    return Polygon3;
}());
var Polygon2 = /** @class */ (function () {
    function Polygon2(points, as3d) {
        this.points = points;
        this.as3d = as3d;
        var u3 = as3d.normal.cross(Vector3.Z_UNIT);
        if (u3.equals(Vector3.ZERO)) {
            u3 = Vector3.X_UNIT;
        }
        else {
            u3 = u3.unit();
        }
        var u = u3.project2d();
        var v = as3d.normal.cross(u3).unit().project2d();
        var p = points[0];
        this.textureTransform = {
            a: u.x * TEXTURE_SCALE,
            b: u.y * TEXTURE_SCALE,
            c: v.x * TEXTURE_SCALE,
            d: v.y * TEXTURE_SCALE,
            x: p.x,
            y: p.y
        };
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
        polygons.sort(function (p, q) { return p.as3d.cameraOrder - q.as3d.cameraOrder; });
    }
    return Scene2;
}());
var Renderer = /** @class */ (function () {
    function Renderer(canvas, textureImgs) {
        this.canvas = canvas;
        this.textures = Object.create(null);
        var ctx = this.ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        for (var k in textureImgs) {
            if (Object.prototype.hasOwnProperty.call(textureImgs, k)) {
                this.textures[k] = ctx.createPattern(textureImgs[k], 'repeat');
            }
        }
    }
    Renderer.prototype.draw = function (scene, camera) {
        var ctx = this.ctx;
        var tx = this.textures;
        var width = this.canvas.width;
        var height = this.canvas.height;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#0000D0';
        ctx.fillRect(0, 0, width, height);
        var cx = (width / 2) - camera.x;
        var cy = (height / 2) - camera.y;
        var cs = camera.scale;
        var polygons = scene.polygons;
        for (var i = 0; i < polygons.length; ++i) {
            var polygon = polygons[i];
            this.drawPolygon(polygons[i], cx, cy, cs);
        }
    };
    Renderer.prototype.drawPolygon = function (polygon, cx, cy, cs) {
        var ctx = this.ctx;
        var points = polygon.points;
        ctx.setTransform(cs, 0, 0, cs, cx, cy);
        ctx.beginPath();
        var v = points[0];
        ctx.moveTo(v.x, v.y);
        for (var i = 1; i < points.length; ++i) {
            v = points[i];
            ctx.lineTo(v.x, v.y);
        }
        ctx.closePath();
        var tf = polygon.textureTransform;
        ctx.setTransform(cs * tf.a, cs * tf.b, cs * tf.c, cs * tf.d, tf.x + cx, tf.y + cy);
        ctx.fillStyle = this.textures[polygon.as3d.texture];
        ctx.fill();
        ctx.setTransform(cs, 0, 0, cs, cx, cy);
        ctx.stroke();
    };
    return Renderer;
}());
var TEXTURES = {
    'wall': 'textures/wall-bricks.jpg',
    'floor': 'textures/floor-tiles.jpg'
};
var TEXTURE_SCALE = 0.005;
function loadTextures(callback) {
    var imgs = {};
    var count = 0;
    for (var k in TEXTURES) {
        if (Object.hasOwnProperty.call(TEXTURES, k)) {
            var img = new Image();
            img.src = TEXTURES[k];
            img.style.display = 'hidden';
            ++count;
            img.onload = function () {
                if (--count == 0) {
                    callback(imgs);
                }
            };
            imgs[k] = img;
        }
    }
    for (var k in imgs) {
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(imgs[k]);
    }
}
var CAMERA_SPEED = 0.25;
var Game = /** @class */ (function () {
    function Game(scene) {
        this.scene = scene;
        this.camera = { x: 0, y: 0, scale: 1 };
    }
    Game.prototype.tick = function (dt, keys) {
        var dc = dt * CAMERA_SPEED;
        if (keys[37]) {
            this.camera.x -= dc;
        } // left
        if (keys[38]) {
            this.camera.y -= dc;
        } // up
        if (keys[39]) {
            this.camera.x += dc;
        } // right
        if (keys[40]) {
            this.camera.y += dc;
        } // down
    };
    return Game;
}());
function main() {
    function vec(x, y, z) {
        return new Vector3(x, y, z);
    }
    var scene = new Scene3([
        new Polygon3([vec(0, 0, 0), vec(0, 3, 0), vec(5, 3, 0), vec(5, 0, 0)], 'floor'),
        new Polygon3([vec(0, 3, 0), vec(0, 5, 0.5), vec(5, 5, 0.5), vec(5, 3, 0)], 'floor'),
        new Polygon3([vec(5, 0, 0), vec(5, 0, 1), vec(5, 5, 1), vec(5, 5, 0.5), vec(5, 3, 0)], 'wall'),
        new Polygon3([vec(5, 0, 0), vec(0, 0, 0), vec(0, 0, 1), vec(5, 0, 1)], 'wall'),
        new Polygon3([vec(0, 5, 0), vec(0, 5, 0.5), vec(5, 5, 0.5), vec(5, 5, 0)], 'wall'),
        new Polygon3([vec(0, 3, 0), vec(0, 5, 0.5), vec(0, 5, 0)], 'wall'),
    ]).project2d();
    var canvas = document.getElementById('canvas');
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    var keys = Object.create(null);
    window.addEventListener('keydown', function (e) {
        keys[e.keyCode] = true;
    });
    window.addEventListener('keyup', function (e) {
        keys[e.keyCode] = false;
    });
    loadTextures(function (imgs) {
        var game = new Game(scene);
        var renderer = new Renderer(canvas, imgs);
        var lastTime;
        function tick(time) {
            if (time && lastTime) {
                game.tick(time - lastTime, keys);
            }
            lastTime = time;
            renderer.draw(game.scene, game.camera);
            window.requestAnimationFrame(tick);
        }
        tick();
    });
}
var SCENE_DATA = {
    "faces": [
        { "label": "A", "texture": "wall", "coords": [{ "x": 0, "y": 0, "z": 0 }, { "x": 0, "y": 0, "z": 7 }, { "x": 6, "y": 0, "z": 7 }, { "x": 6, "y": 0, "z": 0 }] },
        { "label": "B", "coords": [{ "x": 6, "y": 0, "z": 0 }, { "x": 6, "y": 0, "z": 7 }, { "x": 6, "y": 10, "z": 7 }, { "x": 6, "y": 10, "z": 0 }] },
        { "label": "C", "coords": [{ "x": 0, "y": 10, "z": 0 }, { "x": 0, "y": 0, "z": 0 }, { "x": 6, "y": 0, "z": 0 }, { "x": 6, "y": 10, "z": 0 }] },
        { "label": "D", "coords": [{ "x": 0, "y": 10, "z": 0 }, { "x": 0, "y": 0, "z": 0 }, { "x": 0, "y": 0, "z": 7 }, { "x": 0, "y": 10, "z": 7 }] },
        { "label": "E", "coords": [{ "x": 0, "y": 10, "z": 7 }, { "x": 0, "y": 0, "z": 7 }, { "x": 6, "y": 0, "z": 7 }, { "x": 6, "y": 10, "z": 7 }] },
        { "label": "F", "coords": [{ "x": 0, "y": 10, "z": 0 }, { "x": 0, "y": 10, "z": 7 }, { "x": 6, "y": 10, "z": 7 }, { "x": 6, "y": 10, "z": 0 }] },
        { "label": "G", "coords": [{ "x": 2, "y": 17, "z": 0 }, { "x": 2, "y": 10, "z": 0 }, { "x": 2, "y": 10, "z": 7 }, { "x": 4, "y": 15, "z": 7 }] },
        { "label": "H", "coords": [{ "x": 2, "y": 17, "z": 7 }, { "x": 2, "y": 10, "z": 7 }, { "x": 4, "y": 10, "z": 7 }, { "x": 4, "y": 15, "z": 7 }] },
        { "label": "P", "coords": [{ "x": 4, "y": 15, "z": 0 }, { "x": 4, "y": 10, "z": 0 }, { "x": 4, "y": 10, "z": 7 }, { "x": 4, "y": 15, "z": 7 }] },
        { "label": "Q", "coords": [{ "x": 2, "y": 17, "z": 0 }, { "x": 2, "y": 10, "z": 0 }, { "x": 4, "y": 10, "z": 0 }, { "x": 4, "y": 15, "z": 0 }] },
        { "label": "I", "coords": [{ "x": -4, "y": 17, "z": 0 }, { "x": -4, "y": 17, "z": 7 }, { "x": 2, "y": 17, "z": 7 }, { "x": 2, "y": 17, "z": 0 }] },
        { "label": "J", "coords": [{ "x": -4, "y": 23, "z": 0 }, { "x": -4, "y": 23, "z": 7 }, { "x": -4, "y": 17, "z": 7 }, { "x": -4, "y": 17, "z": 0 }] },
        { "label": "K", "coords": [{ "x": -4, "y": 23, "z": 0 }, { "x": -4, "y": 23, "z": 7 }, { "x": 6, "y": 23, "z": 7 }, { "x": 6, "y": 23, "z": 0 }] },
        { "label": "L", "coords": [{ "x": 6, "y": 15, "z": 0 }, { "x": 6, "y": 15, "z": 7 }, { "x": 6, "y": 23, "z": 7 }, { "x": 6, "y": 23, "z": 0 }] },
        { "label": "M", "coords": [{ "x": 4, "y": 15, "z": 0 }, { "x": 4, "y": 15, "z": 7 }, { "x": 6, "y": 15, "z": 7 }, { "x": 6, "y": 15, "z": 0 }] },
        { "label": "N", "coords": [{ "x": -4, "y": 17, "z": 0 }, { "x": 2, "y": 17, "z": 0 }, { "x": 2, "y": 15, "z": 0 }, { "x": 6, "y": 15, "z": 0 }, { "x": 6, "y": 23, "z": 0 }, { "x": -4, "y": 23, "z": 0 }] },
        { "label": "O", "coords": [{ "x": 2, "y": 10, "z": 0 }, { "x": 4, "y": 10, "z": 0 }, { "x": 4, "y": 15, "z": 0 }, { "x": 2, "y": 15, "z": 0 }] }
    ]
};
