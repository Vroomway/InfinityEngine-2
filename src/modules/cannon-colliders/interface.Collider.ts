export interface Collider {
	obj_name   : string,
	position   : number[],
	type       : string,
	shape      : string,
	friction   : number,
	restitution: number,
	mass       : number,
	radius?    : number,   // Only present for SPHERE colliders
	dimensions?: number[], // Only present for BOX colliders
	rotation?  : number[], // Only present for BOX colliders - is quaternion
	vertices?  : number[], // Only present for MESH colliders
	indices?   : number[], // Only present for MESH colliders
}

export type ColliderInst = {
	conf: Collider
	body: CANNON.Body
}