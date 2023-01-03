import { Scene, Mesh, Vector3, Matrix, Color4 } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock, Rectangle } from "@babylonjs/gui";
import { GeosphereBuilder } from "./Geosphere.Builder";

export class Geosphere extends Mesh {

    public cells: Cell[];

    public faces: Face[];

    constructor(name: string, options: {
        subdivisions?: number;
    }, scene: Scene) {
        super(name, scene);
        this.isPickable = false;

        scene.onPointerDown = () => {
            var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, Matrix.Identity(), scene.activeCamera);
            //var hit = scene.pickWithRay(ray);

            let hit = scene.pick(scene.pointerX, scene.pointerY, null, false, null, (p0, p1, p2, ray) => {
                var p0p1 = p0.subtract(p1);
                var p2p1 = p2.subtract(p1);
                var normal = Vector3.Cross(p0p1, p2p1);
                return Vector3.Dot(ray.direction, normal) < 0;
            });

            if (hit.pickedMesh) {
                if (hit.pickedMesh.metadata?.cell == null) {
                    console.log("No hit");
                    return;
                }

                // clear
                for (let i = 0; i < this.cells.length; i++) {
                    this.cells[i].disableDebug();
                }

                let cell = hit.pickedMesh.metadata.cell as Cell;
                console.log(`CELL: ${cell.id} | FACE: ${cell.faceId}`);
                cell.enableDebug(this);
            }
        }

        var buildResult = GeosphereBuilder.Generate(this, options?.subdivisions ?? 2);
        this.cells = buildResult.cells;
        this.faces = buildResult.faces;

        //this.createOrUpdateSubmeshesOctree();
        //this.useOctreeForPicking = true;
    }
}

export class Face {
    public id: number;

    public center: Vector3;

    public cells: Cell[];

    constructor(id: number) {
        this.id = id;
        this.cells = [];
    }
}

export class Cell {

    public sphere: Geosphere;

    public id: number;

    public faceId: number;

    public neighborIds: number[];

    public center: Vector3;

    point: Mesh;

    private _red = new Color4(1, 0, 0, 0.5);
    private _green = new Color4(0, 1, 0, 0.5);
    private _white = new Color4(1, 1, 1, 0.0);

    private _ui: AdvancedDynamicTexture;

    constructor(sphere: Geosphere, id: number, faceId: number, center: Vector3, neighborIds: number[]) {
        this.id = id;
        this.faceId = faceId;
        this.sphere = sphere;
        this.center = center;
        this.neighborIds = neighborIds;
    }

    public enableDebug(sphere: Geosphere) {
        this.point.edgesWidth = 3;
        this.point.enableEdgesRendering();
        this.point.edgesColor = this._green;

        for (let i = 0; i < this.neighborIds.length; i++) {
            let n = this.sphere.cells[this.neighborIds[i]];
            //  n.point.edgesColor = new Color4(1, 0, (1 / this.neighborIds.length) * i, 0.5);
        }

        for (let i = 0; i < sphere.faces[this.faceId].cells.length; i++) {
            sphere.faces[this.faceId].cells[i].point.edgesColor = this._red;
        }

        this.UI();
    }

    public disableDebug() {
        this.point.edgesColor = this._white;
        this.point.edgesWidth = 3;
        this.point.enableEdgesRendering();

        this._ui?.dispose();
        this._ui = null;
    }

    private UI() {
        this._ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        // this.label(`CELL ${this.id} | FACE ${this.faceId}`, this.point, this._ui);
        // for (let i = 0; i < this.neighborIds.length; i++) {
        // let n = this.sphere.cells[this.neighborIds[i]];
        // this.label(`N${i} : CELL${n.id}`, n.point, this._ui);
        // }
    }

    private label(text: string, point: Mesh, ui: AdvancedDynamicTexture) {
        var rect1 = new Rectangle();
        rect1.width = 0.2;
        rect1.height = "30px";
        rect1.cornerRadius = 5;
        rect1.color = "Orange";
        rect1.thickness = 1;
        rect1.background = "green";
        ui.addControl(rect1);
        rect1.linkWithMesh(point);
        rect1.linkOffsetY = -50;

        var label = new TextBlock();
        label.text = text;
        label.fontSize = 14;
        rect1.addControl(label);

        // var line = new BABYLON.GUI.Line();
        // line.lineWidth = 2;
        // line.color = "Orange";
        // line.y2 = 20;
        // line.linkOffsetY = -20;
        // ui.addControl(line);
        // line.linkWithMesh(point);
        // line.connectedControl = rect1;
    }
}