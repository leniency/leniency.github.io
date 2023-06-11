import * as ex from 'excalibur';
import { config } from "../config";

export class MapHighlight extends ex.Actor {
    highlight: ex.Polygon;
    constructor() {
        super({
            x: 0,
            y: 0,
            width: config.cellSize,
            height: config.cellSize,

            //body: new ex.Body({
            //    collider: new ex.Collider({
            //        type: ex.CollisionType.Passive,
            //        shape: ex.Shape.Circle(config.cellSize),
            //    })
            //})
        });
    }
    public onInitialize(engine: ex.Engine) {
        this.highlight =new ex.Polygon({
            points: [
                new ex.Vector(0, 0),
                new ex.Vector(0, config.cellSize),
                new ex.Vector(config.cellSize, config.cellSize),
                new ex.Vector(config.cellSize, 0),
            ],
            strokeColor: ex.Color.Red
        });

       // this.highlight.lineColor = ex.Color.Red;
        this.highlight.lineWidth = 2;
    }
    public onPostDraw(ctx: CanvasRenderingContext2D, delta: number): void {
        //if (this.index == null) {
        //    return;
        //}
        //this.highlight.lineColor = ex.Color.Red;
        //this.highlight.draw(ctx, this.pos.x, this.pos.y);
    }
}
