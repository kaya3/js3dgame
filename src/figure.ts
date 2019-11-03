class Figure {
	constructor(public position: Vector3, public readonly sprite: ImageName) {}
	
	public walk(dx: number, dy: number): void {
		let x = this.position.x + dx;
		let y = this.position.y + dy;
		let z = this.position.z;
		
		// TODO: clip z to floor, don't let player walk through wall
		
		this.position = new Vector3(x, y, z);
	}
}
