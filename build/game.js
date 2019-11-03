"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.limitNumberRange = function (val, min, max) {
        return Math.min(max, Math.max(min, val));
    };
    Util.isNumberInRangeExclusive = function (num, lowerLimit, upperLimit) {
        return (num > lowerLimit) && (num < upperLimit);
    };
    Util.isNumberInRangeInclusive = function (num, lowerLimit, upperLimit) {
        return (num >= lowerLimit) && (num <= upperLimit);
    };
    Util.isIntersecting = function (pointX, pointY, startX, startY, endX, endY) {
        return ((startY > pointY) != (endY > pointY)) && (pointX < (endX - startX) * (pointY - startY) / (endY - startY) + startX);
    };
    Util.isPointInPolygon = function (vertices, point) {
        var isInside = false;
        // Draw a line from the given xy coordinate toward the direction of each point in the polygon
        // An odd number of intersections indicates that the given point is NOT inside the polygon
        for (var i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            if (Util.isIntersecting(point.x, point.y, vertices[i].x, vertices[i].y, vertices[j].x, vertices[j].y)) {
                isInside = !isInside;
            }
        }
        return isInside;
    };
    return Util;
}());
var Camera = /** @class */ (function () {
    function Camera() {
        this.tlX = 0;
        this.tlY = 0;
        this.halfWidth = 0;
        this.halfHeight = 0;
        this.x = 0;
        this.y = 0;
        this.scale = 1;
    }
    Camera.prototype.resizeWindow = function (width, height) {
        this.halfWidth = width / 2;
        this.halfHeight = height / 2;
        this.moveTo(0, 0);
    };
    Camera.prototype.moveTo = function (x, y) {
        this.x = x;
        this.y = y;
        this.tlX = this.halfWidth - x;
        this.tlY = this.halfHeight - y;
    };
    Camera.prototype.translate = function (dx, dy) {
        this.moveTo(this.x + dx, this.y + dy);
    };
    Camera.prototype.setTransform = function (ctx) {
        ctx.setTransform(this.scale, 0, 0, this.scale, this.tlX, this.tlY);
    };
    return Camera;
}());
var sqrt2 = Math.sqrt(2), sqrt3 = Math.sqrt(3), sqrt6 = Math.sqrt(6);
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
        if (eps === void 0) { eps = 1e-5; }
        return this.subtract(other).isZero(eps);
    };
    Vector3.prototype.isZero = function (eps) {
        if (eps === void 0) { eps = 1e-5; }
        return Math.abs(this.x) < eps && Math.abs(this.y) < eps && Math.abs(this.z) < eps;
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
    function Polygon3(points, texture, isWalkable) {
        this.points = points;
        this.texture = texture;
        this.isWalkable = isWalkable;
        var n = this.normal = points[1].subtract(points[0]).cross(points[2].subtract(points[1])).unit();
        var u = n.cross(Vector3.Z_UNIT);
        this.u = u = (u.isZero() ? Vector3.X_UNIT : u.unit());
        this.v = n.cross(u).unit();
        var m = points[0].cameraOrder();
        for (var i = 1; i < points.length; ++i) {
            m = Math.min(points[i].cameraOrder(), m);
        }
        this.cameraOrder = -m;
        this.xyBoundingBox = new BoundingBox2(points);
    }
    Polygon3.prototype.project2d = function () {
        return new Polygon2(this.points.map(function (v) { return v.project2d(); }), this);
    };
    Polygon3.prototype.projectZ = function (x, y) {
        var n = this.normal;
        return (n.dot(this.points[0]) - x * n.x - y * n.y) / n.z;
    };
    Polygon3.prototype.contains = function (point) {
        return this.xyBoundingBox.contains(point)
            && Util.isPointInPolygon(this.points, point);
    };
    return Polygon3;
}());
var Polygon2 = /** @class */ (function () {
    function Polygon2(points, as3d) {
        this.points = points;
        this.as3d = as3d;
        this.boundingBox = new BoundingBox2(points);
        var u = as3d.u.project2d();
        var v = as3d.v.project2d();
        var p = points[0];
        this.uvTransform = new UVTransform(u.x, u.y, v.x, v.y, p.x, p.y);
    }
    Polygon2.prototype.drawPath = function (ctx) {
        var points = this.points;
        ctx.beginPath();
        var v = points[0];
        ctx.moveTo(v.x, v.y);
        for (var i = 1; i < points.length; ++i) {
            v = points[i];
            ctx.lineTo(v.x, v.y);
        }
        ctx.closePath();
    };
    Polygon2.prototype.contains = function (point) {
        return this.boundingBox.contains(point)
            && Util.isPointInPolygon(this.points, point);
    };
    return Polygon2;
}());
var BoundingBox2 = /** @class */ (function () {
    function BoundingBox2(points) {
        var p = points[0];
        var left = p.x, top = p.y, right = p.x, bottom = p.y;
        for (var i = 1; i < points.length; ++i) {
            p = points[i];
            left = Math.min(left, p.x);
            top = Math.min(left, p.y);
            right = Math.max(left, p.x);
            bottom = Math.max(left, p.y);
        }
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    BoundingBox2.prototype.contains = function (point) {
        return this.left <= point.x && point.x <= this.right
            && this.top <= point.y && point.y <= this.bottom;
    };
    return BoundingBox2;
}());
var CAMERA_SCALE = 64;
var Renderer = /** @class */ (function () {
    function Renderer(images) {
        this.images = images;
        // TODO: CanvasPatterns only for textures -- sprites do not need a CanvasPattern
        this.textures = Object.create(null);
        var canvas = this.canvas = document.createElement('canvas');
        var ctx = this.ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;
        var lc = this.lightCanvas = document.createElement('canvas');
        this.lightCtx = lc.getContext('2d');
        for (var k in images) {
            var kk = k;
            this.textures[kk] = ctx.createPattern(images[kk], 'repeat');
        }
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(canvas);
        body.appendChild(lc);
        lc.style.display = 'none';
    }
    Renderer.prototype.resizeWindow = function (width, height) {
        this.canvas.width = this.lightCanvas.width = width;
        this.canvas.height = this.lightCanvas.height = height;
    };
    Renderer.prototype.draw = function (game, dynamicLights) {
        var _this = this;
        var camera = game.camera;
        var s3 = game.scene.as3d;
        var npcs = game.npcs;
        var ctx = this.ctx;
        var lightCtx = this.lightCtx;
        var width = this.canvas.width;
        var height = this.canvas.height;
        //ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = s3.data.backgroundColor.toString();
        ctx.fillRect(0, 0, width, height);
        lightCtx.globalCompositeOperation = 'source-over';
        lightCtx.setTransform(1, 0, 0, 1, 0, 0);
        lightCtx.fillStyle = s3.ambientLightColor.toString();
        lightCtx.fillRect(0, 0, width, height);
        lightCtx.globalCompositeOperation = 'lighter';
        var polygons = game.scene.polygons;
        for (var i = 0; i < polygons.length; ++i) {
            var polygon = polygons[i];
            this.drawPolygon(polygon, camera);
            this.lightPolygon(polygon, s3.staticLights, camera);
            if (dynamicLights) {
                this.lightPolygon(polygon, s3.dynamicLights, camera);
            }
        }
        // Draw player
        this.drawSprite(ctx, game.player, camera);
        this.lightSprite(game.player, camera);
        // Draw sprites
        this.drawSprite(ctx, game.npc, camera);
        this.drawSprite(ctx, game.item, camera);
        // Draw npcs
        npcs.forEach(function (npc) { return _this.drawSprite(ctx, npc, camera); });
        // apply lighting
        ctx.globalCompositeOperation = 'multiply';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(this.lightCanvas, 0, 0);
        this.drawLights(s3.staticLights, camera);
        if (dynamicLights) {
            this.drawLights(s3.dynamicLights, camera);
        }
    };
    Renderer.prototype.drawSprite = function (ctx, sprite, camera) {
        var img = this.images[sprite.sprite];
        var sw = img.width, sh = img.height;
        var dw = sw * camera.scale * SPRITE_SCALE, dh = sh * camera.scale * SPRITE_SCALE;
        var pos2d = sprite.pos.project2d();
        ctx.drawImage(img, 0, 0, sw, sh, 
        // drawImage draws an image, with the given x/y coordinates being the top-left corner
        // we want the middle of the base of the image
        pos2d.x - dw / 2, pos2d.y - dh, dw, dh);
    };
    Renderer.prototype.lightSprite = function (sprite, camera) {
        this.lightCtx.globalCompositeOperation = 'destination-out';
        this.drawSprite(this.lightCtx, sprite, camera);
        // TODO: apply light to the mask
    };
    Renderer.prototype.drawPolygon = function (polygon, camera) {
        var ctx = this.ctx;
        camera.setTransform(ctx);
        polygon.drawPath(ctx);
        polygon.uvTransform.apply(ctx, camera, TEXTURE_SCALE);
        ctx.fillStyle = this.textures[polygon.as3d.texture];
        ctx.fill();
        camera.setTransform(ctx);
        ctx.stroke();
    };
    Renderer.prototype.lightPolygon = function (polygon, lights, camera) {
        var lightCtx = this.lightCtx;
        for (var i = 0; i < lights.length; ++i) {
            lights[i].drawForPolygon(lightCtx, camera, polygon);
        }
    };
    Renderer.prototype.drawLights = function (lights, camera) {
        for (var i = 0; i < lights.length; ++i) {
            lights[i].drawForCamera(this.ctx, camera);
        }
    };
    return Renderer;
}());
// NOTE: A 404 error on any texture will cause page to fail
var TEXTURES = {
    'wall': 'textures/wall-bricks.jpg',
    'floor': 'textures/floor-tiles.jpg',
    'stick_figure': 'textures/figure.png',
    'npc': 'textures/goose_left.png',
    'item': 'textures/bed.png'
};
var TEXTURE_SCALE = 0.005;
var SPRITE_SCALE = 2;
var UVTransform = /** @class */ (function () {
    function UVTransform(a, b, c, d, x, y) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.x = x;
        this.y = y;
    }
    UVTransform.prototype.apply = function (ctx, camera, uvScale) {
        if (uvScale === void 0) { uvScale = 1; }
        // TODO: check offset when camera.scale != 1
        var scale = camera.scale * uvScale;
        ctx.setTransform(scale * this.a, scale * this.b, scale * this.c, scale * this.d, this.x + camera.tlX, this.y + camera.tlY);
    };
    return UVTransform;
}());
function loadTextures(callback) {
    var imgs = Object.create(null);
    var count = 0;
    for (var k in TEXTURES) {
        if (Object.hasOwnProperty.call(TEXTURES, k)) {
            var img = new Image();
            img.src = TEXTURES[k];
            img.style.display = 'none';
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
var Scene3 = /** @class */ (function () {
    function Scene3(data) {
        this.data = data;
        this.polygons = data.faces.map(function (face) { return new Polygon3(face.coords, face.texture, face.isWalkable); });
        var amb = data.lights.filter(function (x) { return x.kind === 'ambient'; })[0];
        this.ambientLightColor = (amb ? amb.color : Color.greyscale(0));
        this.staticLights = data.lights.filter(function (x) { return x.kind === 'static'; });
        this.dynamicLights = data.lights.filter(function (x) { return x.kind === 'dynamic'; });
    }
    Scene3.prototype.project2d = function () {
        return new Scene2(this.polygons.map(function (p) { return p.project2d(); }), this);
    };
    Scene3.prototype.addDynamicLight = function (light) {
        if (light.kind !== 'dynamic') {
            throw new Error('Cannot add ' + light.kind + ' light dynamically');
        }
        this.dynamicLights.push(light);
    };
    return Scene3;
}());
var Scene2 = /** @class */ (function () {
    function Scene2(polygons, as3d) {
        this.as3d = as3d;
        this.polygons = polygons.sort(function (p, q) { return p.as3d.cameraOrder - q.as3d.cameraOrder; });
    }
    return Scene2;
}());
var Color = /** @class */ (function () {
    function Color(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    Color.greyscale = function (n) {
        return new Color(n, n, n);
    };
    Color.rgb = function (r, g, b) {
        return new Color(r, g, b);
    };
    Color.prototype.toString = function (alpha) {
        if (alpha === void 0) { alpha = 1; }
        var r = this.r, g = this.g, b = this.b;
        alpha = Math.min(alpha, 1);
        return ['rgba(', r, ',', g, ',', b, ',', alpha, ')'].join('');
    };
    return Color;
}());
var AmbientLight = /** @class */ (function () {
    function AmbientLight(color) {
        this.color = color;
        this.kind = 'ambient';
    }
    AmbientLight.prototype.drawForPolygon = function (ctx, camera, polygon) {
        throw new Error('Ambient light should not be drawn per-polygon');
    };
    AmbientLight.prototype.drawForCamera = function (ctx, camera) {
        throw new Error('Ambient light should not be drawn per-polygon');
    };
    return AmbientLight;
}());
var DirectionalLight = /** @class */ (function () {
    function DirectionalLight(direction, color) {
        this.color = color;
        this.kind = 'static';
        this.direction = direction.unit();
    }
    DirectionalLight.prototype.drawForPolygon = function (ctx, camera, polygon) {
        var intensity = -polygon.as3d.normal.dot(this.direction);
        if (intensity > 0) {
            camera.setTransform(ctx);
            polygon.drawPath(ctx);
            ctx.fillStyle = this.color.toString(intensity);
            ctx.fill();
        }
    };
    DirectionalLight.prototype.drawForCamera = function (ctx, camera) { };
    return DirectionalLight;
}());
var PointLight = /** @class */ (function () {
    function PointLight(pos, color, intensity, kind) {
        this.pos = pos;
        this.color = color;
        this.intensity = intensity;
        this.kind = kind;
    }
    PointLight.prototype.drawForPolygon = function (ctx, camera, polygon) {
        var MAX_D = 10;
        var MAX_R = 10;
        var normal = polygon.as3d.normal;
        var uvOrigin = polygon.as3d.points[0];
        // add epsilon to correct for numerical error, and avoid div0
        var distance = this.pos.subtract(uvOrigin).dot(normal) + 1 / 64;
        if (distance >= 0 && distance < MAX_D) {
            var projected = this.pos.subtract(normal.scale(distance));
            var uvOffset = projected.subtract(uvOrigin);
            var u = polygon.as3d.u.dot(uvOffset);
            var v = polygon.as3d.v.dot(uvOffset);
            camera.setTransform(ctx);
            polygon.drawPath(ctx);
            polygon.uvTransform.apply(ctx, camera);
            ctx.fillStyle = this.makeGradient(ctx, u, v, distance, MAX_R, 1);
            ctx.fill();
        }
    };
    PointLight.prototype.drawForCamera = function (ctx, camera) {
        var pos2d = this.pos.project2d();
        var cx = pos2d.x, cy = pos2d.y, cs = 128 * camera.scale;
        camera.setTransform(ctx);
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = this.makeGradient(ctx, cx, cy, 0.1, cs, cs / 1024);
        ctx.fillRect(cx - cs, cy - cs, 2 * cs, 2 * cs);
    };
    PointLight.prototype.makeGradient = function (ctx, cx, cy, distance, radius, falloff) {
        var COLOR_STOPS = 10;
        var gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        var d2 = distance * distance;
        for (var i = 0; i < COLOR_STOPS; ++i) {
            var p = i * i / (COLOR_STOPS * COLOR_STOPS);
            var r = radius * p * falloff;
            var denominator = Math.pow(d2 + r * r, 1.5);
            var stopIntensity = this.intensity * distance / (denominator + 1e-5);
            gradient.addColorStop(p, this.color.toString(stopIntensity));
        }
        gradient.addColorStop(1, this.color.toString(0));
        return gradient;
    };
    return PointLight;
}());
var Sprite = /** @class */ (function () {
    function Sprite(pos, sprite) {
        this.pos = pos;
        this.sprite = sprite;
        this.onMoveCallbacks = [];
    }
    Sprite.prototype.setPos = function (pos) {
        this.pos = pos;
        var callbacks = this.onMoveCallbacks;
        for (var i = 0; i < callbacks.length; ++i) {
            callbacks[i](pos);
        }
    };
    Sprite.prototype.onMove = function (callback) {
        this.onMoveCallbacks.push(callback);
    };
    return Sprite;
}());
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Player;
}(Sprite));
var NPC = /** @class */ (function (_super) {
    __extends(NPC, _super);
    function NPC(pos, sprite) {
        var _this = _super.call(this, pos, sprite) || this;
        _this.pos = pos;
        _this.sprite = sprite;
        _this.dx = _this.dy = 0;
        _this.updateDirection();
        return _this;
    }
    NPC.prototype.randomSpeed = function () {
        return ((Math.random() * Game.NPC_SPEED) / 2) + Game.NPC_SPEED;
    };
    NPC.prototype.updateDirection = function () {
        this.dx = this.randomSpeed();
        this.dy = this.randomSpeed();
        var rand = Math.random();
        if (rand < 0.1) {
            this.dx = this.dx * 2;
        }
        else if (rand < 0.2) {
            this.dy = this.dy * 2;
        }
        else if (rand < 0.4) {
            this.dx = this.dx * 3;
        }
        else if (rand < 0.5) {
            this.dy = this.dy * 3;
        }
        if (rand < 0.5) {
            this.dx = this.dx * -1;
        }
        else {
            this.dy = this.dy * -1;
        }
    };
    return NPC;
}(Sprite));
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(pos, sprite) {
        var _this = _super.call(this, pos, sprite) || this;
        _this.pos = pos;
        _this.sprite = sprite;
        return _this;
    }
    return Item;
}(Sprite));
/**
 * Data to represent the map.
 */
var SCENE_DATA = (function () {
    function v(x, y, z) {
        return new Vector3(x, y, z);
    }
    var Z_GROUND = 0;
    var Z_PLAT1 = 0;
    var Z_PLAT2 = 2.5;
    var Z_PLAT3 = 1;
    return {
        faces: [
            // Room 1
            { label: "C", isWalkable: true, texture: "floor", coords: [v(0, 0, Z_PLAT1), v(6, 0, Z_PLAT1), v(6, 10, Z_PLAT1), v(0, 10, Z_PLAT1)] },
            { label: "A", isWalkable: false, texture: "wall", coords: [v(0, 0, Z_GROUND), v(0, 0, 1), v(6, 0, 1), v(6, 0, Z_GROUND)] },
            { label: "B", isWalkable: false, texture: "wall", coords: [v(6, 10, 1), v(6, 10, Z_GROUND), v(6, 0, Z_GROUND), v(6, 0, 1)] },
            { label: "D", isWalkable: false, texture: "wall", coords: [v(0, 0, Z_GROUND), v(0, 0, 1), v(0, 10, 1), v(0, 10, Z_GROUND)] },
            { label: "E", isWalkable: false, texture: "wall", coords: [v(0, 10, Z_GROUND), v(0, 10, 1), v(2, 10, 1), v(2, 10, Z_GROUND)] },
            { label: "F", isWalkable: false, texture: "wall", coords: [v(4, 10, Z_GROUND), v(4, 10, 1), v(6, 10, 1), v(6, 10, Z_GROUND)] },
            // Corridor
            { label: "O", isWalkable: true, texture: "floor", coords: [v(2, 10, Z_PLAT1), v(4, 10, Z_PLAT1), v(4, 15, Z_PLAT2), v(2, 15, Z_PLAT2)] },
            { label: "G", isWalkable: false, texture: "wall", coords: [v(4, 10, Z_GROUND), v(4, 10, 1), v(4, 15, Z_PLAT2), v(4, 15, 1)] },
            { label: "H", isWalkable: false, texture: "wall", coords: [v(2, 10, Z_GROUND), v(2, 10, 1), v(2, 15, Z_PLAT2), v(2, 15, Z_GROUND)] },
            // Room 2
            { label: "N", isWalkable: true, texture: "floor", coords: [v(-4, 15, Z_PLAT2), v(6, 15, Z_PLAT2), v(6, 23, Z_PLAT2), v(-4, 23, Z_PLAT2), v(-4, 20, Z_PLAT2), v(-1, 20, Z_PLAT2), v(-1, 18, Z_PLAT2), v(-4, 18, Z_PLAT2)] },
            { label: "I", isWalkable: false, texture: "wall", coords: [v(-4, 15, Z_GROUND), v(-4, 15, Z_PLAT2), v(2, 15, Z_PLAT2), v(2, 15, Z_GROUND)] },
            { label: "K", isWalkable: false, texture: "wall", coords: [v(-4, 23, Z_GROUND), v(-4, 23, Z_PLAT2), v(6, 23, Z_PLAT2), v(6, 23, Z_GROUND)] },
            { label: "L", isWalkable: false, texture: "wall", coords: [v(6, 15, Z_GROUND), v(6, 15, Z_PLAT2), v(6, 23, Z_PLAT2), v(6, 23, Z_GROUND)] },
            { label: "M", isWalkable: false, texture: "wall", coords: [v(4, 15, Z_GROUND), v(4, 15, Z_PLAT2), v(6, 15, Z_PLAT2), v(6, 15, Z_GROUND)] },
            { isWalkable: false, texture: "wall", coords: [v(-4, 15, Z_PLAT3), v(-4, 15, Z_PLAT2), v(-4, 18, Z_PLAT2), v(-4, 18, Z_PLAT3)] },
            { isWalkable: false, texture: "wall", coords: [v(-4, 20, Z_PLAT3), v(-4, 20, Z_PLAT2), v(-4, 23, Z_PLAT2), v(-4, 23, Z_PLAT3)] },
            // RAMP
            { isWalkable: true, texture: "floor", coords: [v(-4, 18, Z_PLAT3), v(-1, 18, Z_PLAT2), v(-1, 20, Z_PLAT2), v(-4, 20, Z_PLAT3)] },
            { isWalkable: false, texture: "wall", coords: [v(-4, 18, Z_PLAT3), v(-4, 18, Z_PLAT2), v(-1, 18, Z_PLAT2)] },
            { isWalkable: false, texture: "wall", coords: [v(-4, 20, Z_PLAT3), v(-1, 20, Z_PLAT2), v(-4, 20, Z_PLAT2)] },
            // Room 3
            { isWalkable: true, texture: "floor", coords: [v(-4, 15, Z_PLAT3), v(-4, 23, Z_PLAT3), v(-12, 23, Z_PLAT3), v(-12, 15, Z_PLAT3)] }
        ],
        lights: [
            new AmbientLight(Color.greyscale(10)),
            new DirectionalLight(new Vector3(3, -1, 5), Color.rgb(50, 60, 40))
        ],
        playerStartPos: v(5, 2, 0),
        playerSprite: 'stick_figure',
        npcStartPos: v(5, 4, 0),
        npcSprite: 'npc',
        itemStartPos: v(5, 4, 0),
        itemSprite: 'item',
        backgroundColor: Color.rgb(48, 200, 48),
        numGeese: 140
    };
})();
// Reference Values
var KEYCODE_PAGE_UP = 33;
var KEYCODE_PAGE_DOWN = 34;
var KEYCODE_Q = 81;
var KEYCODE_E = 69;
var KEYCODE_W = 87;
var KEYCODE_A = 65;
var KEYCODE_S = 83;
var KEYCODE_D = 68;
var KEYCODE_ARROW_LEFT = 37;
var KEYCODE_ARROW_RIGHT = 39;
var KEYCODE_ARROW_UP = 38;
var KEYCODE_ARROW_DOWN = 40;
// Configuration Options:
var PLAYER_UP = KEYCODE_ARROW_UP;
var PLAYER_DOWN = KEYCODE_ARROW_DOWN;
var PLAYER_RIGHT = KEYCODE_ARROW_RIGHT;
var PLAYER_LEFT = KEYCODE_ARROW_LEFT;
var CAMERA_UP = KEYCODE_W;
var CAMERA_DOWN = KEYCODE_S;
var CAMERA_RIGHT = KEYCODE_D;
var CAMERA_LEFT = KEYCODE_A;
// const ZOOM_IN = KEYCODE_Q;
// const ZOOM_DOWN = KEYCODE_E;
var ZOOM_IN = KEYCODE_PAGE_UP;
var ZOOM_DOWN = KEYCODE_PAGE_DOWN;
var Game = /** @class */ (function () {
    function Game(scene) {
        this.scene = scene;
        this.player = new Player(Vector3.ZERO, scene.as3d.data.playerSprite);
        this.npc = new NPC(new Vector3(2.5, 17, 0), scene.as3d.data.npcSprite);
        this.item = new Item(new Vector3(2.3, 4, 0), scene.as3d.data.itemSprite);
        var camera = this.camera = new Camera();
        this.player.onMove(function (p) {
            var pos2d = p.project2d();
            camera.moveTo(pos2d.x, pos2d.y);
        });
        var light = this.playerLight = new PointLight(Vector3.ZERO, Color.rgb(255, 255, 200), 1, 'dynamic');
        this.scene.as3d.addDynamicLight(light);
        var cameraOffset = new Vector3(0.105, 0.105, 0.452);
        this.player.onMove(function (p) { return light.pos = p.add(cameraOffset); });
        this.player.setPos(scene.as3d.data.playerStartPos);
        this.npcs = [];
        for (var i = 0; i < scene.as3d.data.numGeese; i++) {
            this.npcs[i] = new NPC(scene.as3d.data.playerStartPos, scene.as3d.data.npcSprite);
        }
    }
    Game.prototype.tick = function (dt, keys) {
        var dc = dt * Game.CAMERA_SPEED;
        this.camera.translate((keys[CAMERA_RIGHT] - keys[CAMERA_LEFT]) * dc, // right - left
        (keys[CAMERA_DOWN] - keys[CAMERA_UP]) * dc);
        this.handleKeyPresses(dt, keys);
        this.moveNpcs();
        var newIntensity = this.playerLight.intensity + (Math.random() - 0.5) * dt / 64;
        this.playerLight.intensity = Util.limitNumberRange(newIntensity, 0.8, 1.2);
    };
    Game.prototype.moveNpcs = function () {
        var _this = this;
        this.npcs.forEach(function (npc) {
            if (!_this.moveSpriteWithinBounds(npc, npc.dx, npc.dy)) {
                npc.updateDirection();
            }
        });
    };
    Game.prototype.handleKeyPresses = function (dt, keys) {
        var dz = Game.CAMERA_ZOOM_SPEED * (keys[ZOOM_IN] - keys[ZOOM_DOWN]) * dt;
        this.camera.scale = Util.limitNumberRange(this.camera.scale * (1 + dz), Game.MIN_ZOOM, Game.MAX_ZOOM);
        var dxy = Game.PLAYER_SPEED * dt;
        this.moveSpriteWithinBounds(this.player, (keys[PLAYER_RIGHT] - keys[PLAYER_LEFT] - keys[PLAYER_DOWN] + keys[PLAYER_UP]) * dxy, (keys[PLAYER_RIGHT] - keys[PLAYER_LEFT] + keys[PLAYER_DOWN] - keys[PLAYER_UP]) * dxy);
    };
    Game.prototype.moveSpriteWithinBounds = function (sprite, dx, dy) {
        var x = sprite.pos.x + dx;
        var y = sprite.pos.y + dy;
        var floors = this.findFloorsByXY(x, y);
        if (!floors.length) {
            return false;
        }
        var oldZ = sprite.pos.z;
        var closestZ = floors[0].projectZ(x, y);
        for (var i = 1; i < floors.length; ++i) {
            var newZ = floors[i].projectZ(x, y);
            if (Math.abs(newZ - oldZ) < Math.abs(closestZ - oldZ)) {
                closestZ = newZ;
            }
        }
        sprite.setPos(new Vector3(x, y, closestZ));
        return true;
    };
    Game.prototype.findFloorsByXY = function (x, y) {
        var xy = new Vector3(x, y, 0);
        return this.scene.as3d.polygons
            .filter(function (face) { return face.isWalkable && Util.isPointInPolygon(face.points, xy); });
    };
    Game.CAMERA_SPEED = 0.4;
    Game.CAMERA_ZOOM_SPEED = 1 / 1000;
    Game.MAX_ZOOM = 4;
    Game.MIN_ZOOM = 1 / 4;
    Game.PLAYER_SPEED = 1 / 500;
    Game.NPC_SPEED = 0.08;
    return Game;
}());
function main(sceneData) {
    // construct the scene
    var scene = new Scene3(sceneData).project2d();
    var keys = Object.create(null);
    for (var i = 0; i < 256; ++i) {
        keys[i] = 0;
    }
    window.addEventListener('keydown', function (e) {
        keys[e.keyCode] = 1;
    });
    window.addEventListener('keyup', function (e) {
        keys[e.keyCode] = 0;
    });
    loadTextures(function (imgs) {
        var game = new Game(scene);
        var renderer = new Renderer(imgs);
        // TODO: camera follows player
        game.camera.translate(500, 0);
        function resizeCanvas() {
            var w = window.innerWidth, h = window.innerHeight;
            game.camera.resizeWindow(w, h);
            if (renderer) {
                renderer.resizeWindow(w, h);
            }
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        var lastTime;
        function tick(time) {
            if (time && lastTime) {
                game.tick(time - lastTime, keys);
            }
            lastTime = time;
            renderer.draw(game, true);
            window.requestAnimationFrame(tick);
        }
        tick();
    });
}
