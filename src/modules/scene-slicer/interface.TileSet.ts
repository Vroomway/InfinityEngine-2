
export type TileSetCell={
	"index": [0, 0, 0]
	, "src": string|null
	, "pos_center": number[]//[4.0, 5.0, -4.0]
	, "pos_min": number[]//[0.0, 0.0, -8.0]
	, "pos_max": number[]//[8.0, 10.0, 0.0]
}
export type TileSetData={
	/** Name of the tileset (the collection name) */
	name: string,
	/**The total size (in tiles) of the tileset */ 
	tileset_size: number[],//[5, 1, 6]
	/** The origin position of the tileset  **/ 
	tileset_origin: number[],// [0, 0, -8.0]
	/** The size (in Blender units) of each tile */
	tile_dimensions: number[],// [8.0, 10.0, 8.0]
	/** glTF format, possible values are GLB, GLTF_SEPARATE */
	tile_format: string,//"GLTF_SEPARATE"
	/** Possible values are CENTER, TILE_MIN, TILE_MAX */
	tile_origin: string,//"CENTER"
	/** A nested array of tiles  */
	tiles:TileSetCell[][][]
}