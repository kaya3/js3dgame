const TEXTURES = {
	'wall': 'textures/wall-bricks.jpg',
	'floor': 'textures/floor-tiles.jpg',
};
const TEXTURE_SCALE = 0.005;

type TextureName = keyof typeof TEXTURES;
type Textures = { [k in TextureName]: HTMLImageElement };

class UVTransform {
	public constructor(
		public readonly a: number, public readonly b: number, public readonly c: number, public readonly d: number,
		public readonly x: number, public readonly y: number
	) {}
	
	public apply(ctx: CanvasRenderingContext2D, camera: Camera, uvScale: number = 1): void {
		// TODO: check offset when camera.scale != 1
		const scale = camera.scale * uvScale;
		ctx.setTransform(
			scale*this.a, scale*this.b,
			scale*this.c, scale*this.d,
			this.x + camera.tlX, this.y + camera.tlY
		);
	}
};

function loadTextures(callback: (textureImgs: Textures) => void): void {
	const imgs = Object.create(null) as { [k in TextureName]: HTMLImageElement };
	
	var count = 0;
	for(let k in TEXTURES) {
		if(Object.hasOwnProperty.call(TEXTURES, k)) {
			var img = new Image();
			img.src = TEXTURES[k as TextureName];
			img.style.display = 'none';
			
			++count;
			img.onload = function() {
				if(--count == 0) { callback(imgs); }
			};
			imgs[k as TextureName] = img;
		}
	}
	
	for(let k in imgs) {
		var body = document.getElementsByTagName('body')[0];
		body.appendChild(imgs[k as TextureName]);
	}
}
