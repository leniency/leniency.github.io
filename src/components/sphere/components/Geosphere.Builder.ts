import { Vector3, MeshBuilder, Mesh, VertexData } from "@babylonjs/core";
import * as G from "./Geosphere";

export class GeosphereBuilder {

    /**
     * Generate the cells for a geosphere.
     * @param sphere 
     * @param subdivisions 
     * @returns 
     */
    public static Generate(sphere: G.Geosphere, subdivisions: number): { cells: G.Cell[], faces: G.Face[] } {

        // Initialize with a level 0 sphere.
        let icoVertices = GeosphereBuilder._tesselate(subdivisions);
        let icoIndices = GeosphereBuilder._getIndices(subdivisions);
        let cells: CellBuilder[] = new Array(icoVertices.length);

        let addCell = (vertices: VertexFace[], i: number, i1: number, i2: number) => {
            if (cells[i] == null) {
                cells[i] = new CellBuilder(i, vertices[i].vertex, vertices[i].faceId);
            }

            cells[i].neighborIdPairs.push([i1, i2]);
        }

        for (let i = 0; i < icoIndices.length; i += 3) {
            let index1 = icoIndices[i];
            let index2 = icoIndices[i + 1];
            let index3 = icoIndices[i + 2];

            addCell(icoVertices, index1, index2, index3);
            addCell(icoVertices, index2, index3, index1);
            addCell(icoVertices, index3, index1, index2);
        }

        let builtCells: G.Cell[] = [];
        let faces: G.Face[] = [];

        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i].build(sphere);
            builtCells.push(cell);

            if (faces[cell.faceId] == undefined) {
                faces[cell.faceId] = new G.Face(cell.faceId);
            }

            faces[cell.faceId].cells.push(cell);
        }

        GeosphereBuilder._buildCellMeshes(sphere, builtCells);

        let cellMeshes = builtCells.map(c => c.point);
        Mesh.MergeMeshes(cellMeshes, false, false, sphere, false, false);
        return { cells: builtCells, faces: faces };
    }

    private static _buildCellMeshes(sphere: G.Geosphere, cells: G.Cell[]) {

        for (let i = 0; i < cells.length; i++) {
            let positions = [];
            let normals = [];
            let indices = [];
            let cell = cells[i];
            let vd = new VertexData();

            positions.push(cell.center.x);
            positions.push(cell.center.y);
            positions.push(cell.center.z);

            normals.push(cell.center.x);
            normals.push(cell.center.y);
            normals.push(cell.center.z);

            let iStart = 0;
            let center = Vector3.Zero();

            for (let n = 0; n < cell.neighborIds.length; n++) {
                let neighbor1 = cells[cell.neighborIds[n]];

                let neighbor2 = n == cell.neighborIds.length - 1
                    ? cells[cell.neighborIds[0]]
                    : cells[cell.neighborIds[n + 1]];

                positions.push((cell.center.x + neighbor1.center.x + neighbor2.center.x) / 3);
                positions.push((cell.center.y + neighbor1.center.y + neighbor2.center.y) / 3);
                positions.push((cell.center.z + neighbor1.center.z + neighbor2.center.z) / 3);
                center.x += positions[positions.length - 3];
                center.y += positions[positions.length - 2];
                center.z += positions[positions.length - 1];

                normals.push(cell.center.x);
                normals.push(cell.center.y);
                normals.push(cell.center.z);

                if (n == cell.neighborIds.length - 1) {
                    indices.push(iStart);
                    indices.push(iStart + n + 1);
                    indices.push(iStart + 1);

                } else {
                    indices.push(iStart);
                    indices.push(iStart + n + 1);
                    indices.push(iStart + n + 2);
                }
            }

            positions[0] = center.x / cell.neighborIds.length;
            positions[1] = center.y / cell.neighborIds.length;
            positions[2] = center.z / cell.neighborIds.length;

            vd.positions = positions;
            vd.indices = indices;
            vd.normals = normals;

            cell.point = new Mesh(`Geosphere.Cell.${cell.id}`, sphere._scene);
            cell.point.metadata = {
                cell: cells[i]
            };
            vd.applyToMesh(cell.point);
            cell.point.isPickable = true;
        }
    }

    private static _level0Vertices(): VertexFace[] {
        var vertices: VertexFace[] = [];
        let subrad: number, subz: number, theta: number, sn: number, cs: number;

        // North Pole
        vertices.push({ vertex: new Vector3(0, 1, 0), faceId: vertices.length });

        subz = Math.sqrt(0.2) * 1;
        subrad = 2 * subz;

        // Northern ring
        for (let i = 0; i < 5; i++) {
            theta = 2 * Math.PI * i / 5;

            sn = Math.sin(theta);
            cs = Math.cos(theta);

            vertices.push({ vertex: new Vector3(subrad * sn, subz, subrad * cs), faceId: vertices.length - 1 });
        }

        // Southern ring
        for (let i = 0; i < 5; i++) {
            theta = Math.PI * (2 * i + 1) / 5;

            sn = Math.sin(theta);
            cs = Math.cos(theta);

            vertices.push({ vertex: new Vector3(subrad * sn, -subz, subrad * cs), faceId: vertices.length - 1 });
        }

        // South Pole
        vertices.push({ vertex: new Vector3(0, -1, 0), faceId: vertices.length - 1 });
        return vertices;
    }

    private static _tesselate(level: number): VertexFace[] {
        let vertices = GeosphereBuilder._level0Vertices();

        // Tessilate primary edges
        for (var i = 0; i < 5; i++) GeosphereBuilder._slerp(vertices, 0, i + 1, level, i);                      // North faces
        for (var i = 0; i < 5; i++) GeosphereBuilder._slerp(vertices, i + 1, (i + 1) % 5 + 1, level, i);        // North lattitudes
        for (var i = 0; i < 5; i++) GeosphereBuilder._slerp(vertices, i + 1, i + 6, level, i + 5);              // Middle Longitudes
        for (var i = 0; i < 5; i++) GeosphereBuilder._slerp(vertices, i + 1, (i + 4) % 5 + 6, level, i + 10);   // Middle Longitudes
        for (var i = 0; i < 5; i++) GeosphereBuilder._slerp(vertices, i + 6, (i + 1) % 5 + 6, level, i + 14)    // South Latitudes
        for (var i = 0; i < 5; i++) GeosphereBuilder._slerp(vertices, 11, i + 6, level, i + 15);                 // South faces

        // Tessilate inner edges
        for (let f = 0; f < 5; f++) {
            for (let i = 1; i <= level - 2; i++) {
                GeosphereBuilder._slerp(vertices, 12 + f * (level - 1) + i, 12 + ((f + 1) % 5) * (level - 1) + i, i + 1, f);
            }
        }

        for (let f = 0; f < 5; f++) {
            for (let i = 1; i <= level - 2; i++) {
                GeosphereBuilder._slerp(vertices, 12 + (f + 15) * (level - 1) + i, 12 + (f + 10) * (level - 1) + i, i + 1, f + 5);
            }
        }

        for (let f = 0; f < 5; f++) {
            for (let i = 1; i <= level - 2; i++) {
                GeosphereBuilder._slerp(vertices, 12 + (((f + 1) % 5) + 15) * (level - 1) + level - 2 - i, 12 + (f + 10) * (level - 1) + level - 2 - i, i + 1, f + 10);
            }
        }

        for (let f = 0; f < 5; f++) {
            for (let i = 1; i <= level - 2; i++) {
                GeosphereBuilder._slerp(vertices, 12 + (((f + 1) % 5) + 25) * (level - 1) + i, 12 + (f + 25) * (level - 1) + i, i + 1, f + 15);
            }
        }
        return vertices;
    }

    private static _slerp(vertices: VertexFace[], v1: number, v2: number, level: number, face: number) {
        if (level < 2) return;

        let a = vertices[v1];
        let b = vertices[v2];

        let rad = Vector3.Dot(a.vertex, a.vertex);
        let cs = Vector3.Dot(a.vertex, b.vertex) / rad;

        cs = (cs < -1) ? -1 : (cs > 1) ? 1 : cs;

        let theta = Math.acos(cs);
        let sn = Math.sin(theta);

        for (var e = 1; e <= level - 1; e++) {
            let np = new Vector3();
            let theta1 = (theta * e) / level;
            let theta2 = (theta * (level - e)) / level;

            let st1 = Math.sin(theta1);
            let st2 = Math.sin(theta2);

            np.x = (a.vertex.x * st2 + b.vertex.x * st1) / sn;
            np.y = (a.vertex.y * st2 + b.vertex.y * st1) / sn;
            np.z = (a.vertex.z * st2 + b.vertex.z * st1) / sn;

            vertices.push({ vertex: np, faceId: face });
        }
    }

    private static _getIndices(level: number): number[] {
        var indices = [];

        for (let f = 0; f <= 20 - 1; f++) {
            for (let row = 0; row <= level - 1; row++) {
                for (let column = 0; column <= row; column++) {
                    let a = GeosphereBuilder._findIndex(level, f, row, column);
                    let b = GeosphereBuilder._findIndex(level, f, row + 1, column);
                    let c = GeosphereBuilder._findIndex(level, f, row + 1, column + 1);

                    indices.push(a);
                    indices.push(c);
                    indices.push(b);

                    if (column < row) {
                        let d = GeosphereBuilder._findIndex(level, f, row, column + 1);

                        indices.push(a);
                        indices.push(d);
                        indices.push(c);
                    }
                }
            }
        }

        return indices;
    }

    private static _findIndex(level: number, face: number, row: number, column: number): number {
        if (row == 0) {
            if (face < 5) return 0;
            if (face > 14) return 11;
            return face - 4;
        }

        if (row == level && column == 0) {
            if (face < 5) return face + 1;
            if (face < 10) return ((face + 4) % 5) + 6;
            if (face < 15) return ((face + 1) % 5) + 1;
            return ((face + 1) % 5) + 6;
        }

        if (row == level && column == level) {
            if (face < 5) return ((face + 1) % 5) + 1;
            if (face < 10) return face + 1;
            if (face < 15) return face - 9;
            return face - 9;
        }

        if (row == level) {
            if (face < 5) return 12 + (5 + face) * (level - 1) + column - 1;
            if (face < 10) return 12 + (20 + ((face + 4) % 5)) * (level - 1) + column - 1;
            if (face < 15) return 12 + (face - 5) * (level - 1) + level - 1 - column;
            return 12 + (5 + face) * (level - 1) + level - 1 - column;
        }

        if (column == 0) {
            if (face < 5) return 12 + face * (level - 1) + row - 1;
            if (face < 10) return 12 + ((face % 5) + 15) * (level - 1) + row - 1;
            if (face < 15) return 12 + (((face + 1) % 5) + 15) * (level - 1) + level - 1 - row;
            return 12 + (((face + 1) % 5) + 25) * (level - 1) + row - 1;
        }

        if (column == row) {
            if (face < 5) return 12 + ((face + 1) % 5) * (level - 1) + row - 1;
            if (face < 10) return 12 + ((face % 5) + 10) * (level - 1) + row - 1;
            if (face < 15) return 12 + ((face % 5) + 10) * (level - 1) + level - 1 - row;
            return 12 + ((face % 5) + 25) * (level - 1) + row - 1;
        }

        return 12 + 30 * (level - 1) + face * (level - 1) * (level - 2) / 2 + (row - 1) * (row - 2) / 2 + column - 1;
    }
}

interface VertexFace {
    faceId: number;
    vertex: Vector3;
}


class CellBuilder {

    public id: number;

    public faceId: number;

    public neighborIdPairs: number[][];

    public center: Vector3;

    constructor(id: number, center: Vector3, faceId: number) {
        this.id = id;
        this.faceId = faceId;
        this.center = center;
        this.neighborIdPairs = [];
    }

    public build(sphere: G.Geosphere): G.Cell {
        return new G.Cell(sphere, this.id, this.faceId, this.center, this._compileNeighbors());
    }

    _compileNeighbors(): number[] {
        let neighborIds = this.neighborIdPairs.splice(0, 1)[0];

        while (this.neighborIdPairs.length > 0) {
            for (let i = 0; i < this.neighborIdPairs.length; i++) {
                let pair = this.neighborIdPairs[i];

                if (pair[1] == neighborIds[0]) {    // prepend to start
                    neighborIds.concat(pair[0], neighborIds);
                    this.neighborIdPairs.splice(i, 1);
                } else if (pair[0] == neighborIds[neighborIds.length - 1]) {
                    neighborIds.push(pair[1])
                    this.neighborIdPairs.splice(i, 1);
                }
            }
        }

        return neighborIds;
    }
}
