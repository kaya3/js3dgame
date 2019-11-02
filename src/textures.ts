const TEXTURES = {
	'wall': 'textures/wall-bricks.jpg',
	'floor': 'textures/floor-tiles.jpg',
};
const TEXTURE_SCALE = 0.005;
type TextureName = keyof typeof TEXTURES;
type Textures = { [k in TextureName]: HTMLImageElement };
type TextureTransform = {
	a: number, b: number, c: number, d: number,
	x: number, y: number
};

function loadTextures(callback: (textureImgs: Textures) => void): void {
	const imgs = {} as { [k in TextureName]: HTMLImageElement };
	
	var count = 0;
	for(let k in TEXTURES) {
		if(Object.hasOwnProperty.call(TEXTURES, k)) {
			var img = new Image();
			img.src = TEXTURES[k as TextureName];
			img.style.display = 'hidden';
			
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
