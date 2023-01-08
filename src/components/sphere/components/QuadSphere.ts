import { Mesh, Scene, VertexData } from "@babylonjs/core";

namespace akkadia.components {
    export class QuadSphere extends Mesh {
        constructor(name: string, options: {
            radius?: number;

            subdivisions?: number;
        }, scene: Scene) {
            super(name, scene);

            let positions = [];
            let indices = [];
            this.face(1, options.subdivisions, positions, indices);
            this.face(2, options.subdivisions, positions, indices);
            this.face(3, options.subdivisions, positions, indices);
            this.face(4, options.subdivisions, positions, indices);
            this.face(5, options.subdivisions, positions, indices);
            this.face(6, options.subdivisions, positions, indices);

            let normals = [];
            VertexData.ComputeNormals(positions, indices, normals);
            let vertexData = new VertexData();
            vertexData.positions = positions;
            vertexData.indices = indices;
            vertexData.normals = normals;
            vertexData.applyToMesh(this, true);
        }

        private face(face: number, segments: number, positions: number[], indices: number[]) {
            let step = 2 / segments;
            let vi = positions.length / 3;
            let row = 0;
            let col = 0;
            let f = face > 3 ? 1 : -1;

            for (var i = -1; i <= 1; i += step) {
                for (var j = -1; j <= 1; j += step) {

                    // Cube Positions
                    if (face == 1 || face == 4) { positions.push(1 * f); }
                    positions.push(i);
                    if (face == 2 || face == 5) { positions.push(1 * f); }
                    positions.push(j);
                    if (face == 3 || face == 6) { positions.push(1 * f); }

                    // Expand to unit circle
                    // http://mathproofs.blogspot.com/2005/07/mapping-cube-to-sphere.html

                    let x = positions[positions.length - 3];
                    let y = positions[positions.length - 2];
                    let z = positions[positions.length - 1];

                    let x1 = x * Math.sqrt(1
                        - ((y * y) / 2)
                        - ((z * z) / 2)
                        + (((y * y) * (z * z)) / 3)
                    );

                    let y1 = y * Math.sqrt(1
                        - ((z * z) / 2)
                        - ((x * x) / 2)
                        + (((z * z) * (x * x)) / 3)
                    );

                    let z1 = z * Math.sqrt(1
                        - ((x * x) / 2)
                        - ((y * y) / 2)
                        + (((x * x) * (y * y)) / 3)
                    );

                    positions[positions.length - 3] = x1;
                    positions[positions.length - 2] = y1;
                    positions[positions.length - 1] = z1;

                    // Indices
                    if (row < segments && col < segments) {

                        if (face == 1 || face == 3 || face == 5) {
                            indices.push(vi);
                            indices.push(vi + 1 + segments);
                            indices.push(vi + 1);

                            indices.push(vi + 1);
                            indices.push(vi + 1 + segments);
                            indices.push(vi + 2 + segments);
                        } else {
                            indices.push(vi + 1 + segments);
                            indices.push(vi);
                            indices.push(vi + 1);

                            indices.push(vi + 1 + segments);
                            indices.push(vi + 1);
                            indices.push(vi + 2 + segments);
                        }
                    }

                    vi++;
                    col++;
                }
                row++;
                col = 0;
            }
        }
    }
}