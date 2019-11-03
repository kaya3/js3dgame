"use strict";
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.limitNumberRange = function (val, min, max) {
        if (val < min) {
            return min;
        }
        if (val > max) {
            return max;
        }
        return val;
    };
    Util.convertInputSceneJsonToPolygonArray = function (sceneData) {
        return sceneData.faces.map(function (faceJson) {
            var vecArray = faceJson.coords.map(function (coord) {
                return new Vector3(coord.x, coord.y, coord.z);
            });
            var texture = faceJson.texture;
            return new Polygon3(vecArray, texture);
        });
    };
    Util.convertInputFigureJsonToPolygonArray = function (figureData) {
        return figureData.faces.map(function (faceJson) {
            //console.info('faceJson', faceJson);
            var coord = faceJson.coords;
            return new Figure(coord.x, coord.y, coord.z, coord.scale);
        });
    };
    return Util;
}());
var CAMERA_SPEED = 0.4;
var CAMERA_ZOOM_SPEED = 0.001;
var MAX_ZOOM = 10;
var MIN_ZOOM = 0.5;
var Game = /** @class */ (function () {
    function Game(scene) {
        this.scene = scene;
        this.camera = new Camera();
    }
    Game.prototype.tick = function (dt, keys) {
        var dc = dt * CAMERA_SPEED;
        this.camera.translate((keys[39] - keys[37]) * dc, // right - left
        (keys[40] - keys[38]) * dc);
        var dz = dt * CAMERA_ZOOM_SPEED;
        if (keys[33]) {
            this.camera.scale = Util.limitNumberRange(this.camera.scale + dz, MIN_ZOOM, MAX_ZOOM);
        } // page up/zoom in
        if (keys[34]) {
            this.camera.scale = Util.limitNumberRange(this.camera.scale - dz, MIN_ZOOM, MAX_ZOOM);
        } // page down/zoom out
    };
    return Game;
}());
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
    function Polygon3(points, texture) {
        this.points = points;
        this.texture = texture;
        var n = this.normal = points[1].subtract(points[0]).cross(points[2].subtract(points[1])).unit();
        var u = n.cross(Vector3.Z_UNIT);
        this.u = u = (u.isZero() ? Vector3.X_UNIT : u.unit());
        this.v = n.cross(u).unit();
        var m = points[0].cameraOrder();
        for (var i = 1; i < points.length; ++i) {
            m = Math.min(points[i].cameraOrder(), m);
        }
        this.cameraOrder = -m;
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
    return Polygon2;
}());
var Scene3 = /** @class */ (function () {
    function Scene3(polygons, lights) {
        if (polygons === void 0) { polygons = []; }
        this.polygons = polygons;
        var amb = lights.filter(function (x) { return x.kind === 'ambient'; })[0];
        this.ambientLightColor = (amb ? amb.color : new RGB(0, 0, 0));
        this.staticLights = lights.filter(function (x) { return x.kind === 'static'; });
        this.dynamicLights = lights.filter(function (x) { return x.kind === 'dynamic'; });
    }
    Scene3.prototype.project2d = function () {
        return new Scene2(this.polygons.map(function (p) { return p.project2d(); }), this);
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
var Camera = /** @class */ (function () {
    function Camera() {
        this.tlX = 0;
        this.tlY = 0;
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
        this.scale = 1;
    }
    Camera.prototype.resizeWindow = function (width, height) {
        this.width = width;
        this.height = height;
        this.tlX = width / 2 - this.x;
        this.tlY = height / 2 - this.y;
    };
    Camera.prototype.translate = function (dx, dy) {
        this.x += dx;
        this.y += dy;
        this.tlX -= dx;
        this.tlY -= dy;
    };
    Camera.prototype.setTransform = function (ctx) {
        ctx.setTransform(this.scale, 0, 0, this.scale, this.tlX, this.tlY);
    };
    return Camera;
}());
var Renderer = /** @class */ (function () {
    function Renderer(textureImgs) {
        this.textures = Object.create(null);
        var canvas = this.canvas = document.createElement('canvas');
        var ctx = this.ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;
        var lc = this.lightCanvas = document.createElement('canvas');
        this.lightCtx = lc.getContext('2d');
        for (var k in textureImgs) {
            var kk = k;
            this.textures[kk] = ctx.createPattern(textureImgs[kk], 'repeat');
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
    Renderer.prototype.draw = function (scene, camera, dynamicLights) {
        var ctx = this.ctx;
        var lightCtx = this.lightCtx;
        var width = this.canvas.width;
        var height = this.canvas.height;
        //ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#303030';
        ctx.fillRect(0, 0, width, height);
        lightCtx.globalCompositeOperation = 'source-over';
        lightCtx.setTransform(1, 0, 0, 1, 0, 0);
        lightCtx.fillStyle = scene.as3d.ambientLightColor.toString();
        lightCtx.fillRect(0, 0, width, height);
        lightCtx.globalCompositeOperation = 'lighter';
        var polygons = scene.polygons;
        for (var i = 0; i < polygons.length; ++i) {
            var polygon = polygons[i];
            this.drawPolygon(polygon, camera);
            this.lightPolygon(polygon, scene.as3d.staticLights, camera);
            if (dynamicLights) {
                this.lightPolygon(polygon, scene.as3d.dynamicLights, camera);
            }
        }
        ctx.globalCompositeOperation = 'multiply';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(this.lightCanvas, 0, 0);
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
    return Renderer;
}());
// NOTE: A 404 error on any texture will cause page to fail
var TEXTURES = {
    'wall': 'textures/wall-bricks.jpg',
    'floor': 'textures/floor-tiles.jpg',
    'stick-figure': 'textures/figure.png'
};
var TEXTURE_SCALE = 0.005;
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
;
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
var RGB = /** @class */ (function () {
    function RGB(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    RGB.prototype.toString = function (alpha) {
        if (alpha === void 0) { alpha = 1; }
        var r = this.r, g = this.g, b = this.b;
        if (alpha > 1) {
            /*let factor = 1/alpha;
            r = 255 - (255 - r)*factor;
            g = 255 - (255 - g)*factor;
            b = 255 - (255 - b)*factor;*/
            alpha = 1;
        }
        return ['rgba(', r, ',', g, ',', b, ',', alpha, ')'].join('');
    };
    return RGB;
}());
var AmbientLight = /** @class */ (function () {
    function AmbientLight(color) {
        this.color = color;
        this.kind = 'ambient';
    }
    AmbientLight.prototype.drawForPolygon = function (ctx, camera, polygon) {
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
        var COLOR_STOPS = 10;
        var normal = polygon.as3d.normal;
        var uvOrigin = polygon.as3d.points[0];
        var distance = this.pos.subtract(uvOrigin).dot(normal);
        if (distance >= 0 && distance < MAX_D) {
            var projected = this.pos.subtract(normal.scale(distance));
            var uvOffset = projected.subtract(uvOrigin);
            var u = polygon.as3d.u.dot(uvOffset);
            var v = polygon.as3d.v.dot(uvOffset);
            camera.setTransform(ctx);
            polygon.drawPath(ctx);
            polygon.uvTransform.apply(ctx, camera);
            var gradient = ctx.createRadialGradient(u, v, 0, u, v, MAX_R);
            var d2 = distance * distance;
            for (var i = 0; i < COLOR_STOPS; ++i) {
                var p = i * i / (COLOR_STOPS * COLOR_STOPS);
                var r = MAX_R * p;
                var stopIntensity = this.intensity * distance / Math.pow(d2 + r * r, 1.5);
                gradient.addColorStop(p, this.color.toString(stopIntensity));
            }
            gradient.addColorStop(1, this.color.toString(0));
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    };
    return PointLight;
}());
var Figure = /** @class */ (function () {
    function Figure(x, y, z, width) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.texture = "stick-figure";
    }
    Figure.prototype.getPolygon = function () {
        var halfWidth = this.width / 2;
        var vecArray = [
            new Vector3(this.x - halfWidth, this.y, this.z),
            new Vector3(this.x - halfWidth, this.y, this.z + this.width),
            new Vector3(this.x + halfWidth, this.y, this.z + this.width),
            new Vector3(this.x + halfWidth, this.y, this.z),
        ];
        return new Polygon3(vecArray, this.texture);
    };
    return Figure;
}());
/**
 * Data to represent the map
 *
 * Note the polygons are drawn in the order shown --
 * thus, if you include the floor after the wall, the floor will draw on top of the walls
 */
var SCENE_DATA = {
    "faces": [
        // Room 1
        { label: "C", texture: "floor", coords: [{ x: 0, y: 0, z: 0 }, { x: 6, y: 0, z: 0 }, { x: 6, y: 10, z: 0 }, { x: 0, y: 10, z: 0 }] },
        { label: "A", texture: "wall", coords: [{ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }, { x: 6, y: 0, z: 1 }, { x: 6, y: 0, z: 0 }] },
        { label: "B", texture: "wall", coords: [{ x: 6, y: 10, z: 1 }, { x: 6, y: 10, z: 0 }, { x: 6, y: 0, z: 0 }, { x: 6, y: 0, z: 1 },] },
        { label: "D", texture: "wall", coords: [{ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }, { x: 0, y: 10, z: 1 }, { x: 0, y: 10, z: 0 }] },
        { label: "E", texture: "wall", coords: [{ x: 0, y: 10, z: 0 }, { x: 0, y: 10, z: 1 }, { x: 2, y: 10, z: 1 }, { x: 2, y: 10, z: 0 }] },
        { label: "F", texture: "wall", coords: [{ x: 4, y: 10, z: 0 }, { x: 4, y: 10, z: 1 }, { x: 6, y: 10, z: 1 }, { x: 6, y: 10, z: 0 }] },
        // Corridor
        { label: "O", texture: "floor", coords: [{ x: 2, y: 10, z: 0 }, { x: 4, y: 10, z: 0 }, { x: 4, y: 15, z: 1 }, { x: 2, y: 15, z: 1 }] },
        { label: "G", texture: "wall", coords: [{ x: 4, y: 10, z: 0 }, { x: 4, y: 10, z: 1 }, { x: 4, y: 15, z: 2 }, { x: 4, y: 15, z: 1 }] },
        { label: "H", texture: "wall", coords: [{ x: 2, y: 10, z: 0 }, { x: 2, y: 10, z: 1 }, { x: 2, y: 15, z: 2 }, { x: 2, y: 15, z: 0 }] },
        // Room 2
        { label: "N", texture: "floor", coords: [{ x: -4, y: 15, z: 1 }, { x: 6, y: 15, z: 1 }, { x: 6, y: 23, z: 1 }, { x: -4, y: 23, z: 1 }] },
        // { label: "N", texture: "floor", coords: [{x:-4, y:15, z:1}, {x:2, y:15, z:1}, {x:2, y:15, z:1}, {x:6, y:15, z:1}, {x:6, y:23, z:1}, {x:-4, y:23, z:1}]},
        // { label: "P", texture: "wall", coords: [{x:4, y:15, z:1}, {x:4, y:10, z:1}, {x:4, y:10, z:2}, {x:4, y:15, z:2}]},
        // { label: "Q", texture: "wall", coords: [{x:2, y:17, z:1}, {x:2, y:10, z:1}, {x:4, y:10, z:1}, {x:4, y:15, z:1}]},
        { label: "I", texture: "wall", coords: [{ x: -4, y: 15, z: 1 }, { x: -4, y: 15, z: 2 }, { x: 2, y: 15, z: 2 }, { x: 2, y: 15, z: 1 }] },
        { label: "J", texture: "wall", coords: [{ x: -4, y: 23, z: 1 }, { x: -4, y: 23, z: 2 }, { x: -4, y: 15, z: 2 }, { x: -4, y: 15, z: 1 }] },
        { label: "K", texture: "wall", coords: [{ x: -4, y: 23, z: 1 }, { x: -4, y: 23, z: 2 }, { x: 6, y: 23, z: 2 }, { x: 6, y: 23, z: 1 }] },
        { label: "L", texture: "wall", coords: [{ x: 6, y: 15, z: 1 }, { x: 6, y: 15, z: 2 }, { x: 6, y: 23, z: 2 }, { x: 6, y: 23, z: 1 }] },
        { label: "M", texture: "wall", coords: [{ x: 4, y: 15, z: 1 }, { x: 4, y: 15, z: 2 }, { x: 6, y: 15, z: 2 }, { x: 6, y: 15, z: 1 }] },
    ],
    lights: [
        new AmbientLight(new RGB(50, 50, 50)),
        new DirectionalLight(new Vector3(3, -1, 5), new RGB(50, 60, 40)),
        new PointLight(new Vector3(5, 2, 0.5), new RGB(255, 255, 200), 1, 'static'),
    ]
};
var FIGURES_DATA = {
    "faces": [
        { label: "Player 1", texture: "stick-figure", coords: { x: 4, y: 5, z: 0.1, scale: 1 } }
    ]
};
function main() {
    /*
    function vec(x: number, y: number, z: number): Vector3 {
        return new Vector3(x, y, z);
    }
    
    const polys = [
        new Polygon3([ vec(0, 0, 0), vec(5, 0, 0), vec(5, 3, 0), vec(0, 3, 0) ], 'floor'),
        new Polygon3([ vec(0, 3, 0), vec(5, 3, 0), vec(5, 5, 0.5), vec(0, 5, 0.5) ], 'floor'),
        new Polygon3([ vec(5, 0, 0), vec(5, 0, 1), vec(5, 5, 1), vec(5, 5, 0.5), vec(5, 3, 0) ], 'wall'),
        new Polygon3([ vec(5, 0, 0), vec(0, 0, 0), vec(0, 0, 1), vec(5, 0, 1) ], 'wall'),
        new Polygon3([ vec(0, 5, 0), vec(0, 5, 0.5), vec(5, 5, 0.5), vec(5, 5, 0) ], 'wall'),
        new Polygon3([ vec(0, 3, 0), vec(0, 5, 0.5), vec(0, 5, 0) ], 'wall'),
    ];
    const lights = [
        new AmbientLight(new RGB(50, 50, 50)),
        new DirectionalLight(vec(3, -1, 5), new RGB(50, 60, 40)),
        new PointLight(vec(4, 2, 0.5), new RGB(0, 255, 0), 1, 'static'),
    ];
    const scene: Scene2 = new Scene3(polys, lights).project2d();
    const game = new Game(scene);
    
    */
    // Map the given input data into polygons and vectors
    var environment = Util.convertInputSceneJsonToPolygonArray(SCENE_DATA);
    var figures = Util.convertInputFigureJsonToPolygonArray(FIGURES_DATA);
    var figuresPolygons = figures.map(function (figure) { return figure.getPolygon(); });
    // Combine all the polygons into a single collection
    var scenePolygons = [];
    scenePolygons.push.apply(scenePolygons, environment);
    scenePolygons.push.apply(scenePolygons, figuresPolygons);
    // Insert all polygons into the scene and project to 2d
    var scene = new Scene3(scenePolygons, SCENE_DATA.lights).project2d();
    var keys = Object.create(null);
    keys[37] = keys[38] = keys[39] = keys[40] = 0;
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
        game.camera.translate(500, -200);
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
            renderer.draw(game.scene, game.camera, true);
            window.requestAnimationFrame(tick);
        }
        tick();
    });
}
