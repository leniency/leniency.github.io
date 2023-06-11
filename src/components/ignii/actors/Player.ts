import * as ex from "excalibur";
import { config } from "../config";

export class Player extends ex.Actor {

    public health: number;
    public label: ex.Label;

    constructor(x: number, y: number) {
        super({
            pos: new ex.Vector(x, y),
            width: config.cellSize,

            height: config.cellSize,
            color: ex.Color.Red,

            //body: new ex.Body({
            //    collider: new ex.Collider({
            //        type: ex.CollisionType.Active, // active collision type
            //        shape: ex.Shape.Circle(config.cellSize),
            //
            //    })
            //})
        });

        this.health = 100;
        this.on('postcollision', this.onPostCollision);

        //this.label = new ex.Label("Player!", 0, -10, "40px Arial");
        //
        //this.label.textAlign = ex.TextAlign.Center;
        //this.label.color = ex.Color.White;
        //this.add(this.label);
    }

    private onPostCollision(e: ex.PostCollisionEvent) {
        console.log(e.intersection);
        e.actor.vel.x *= e.intersection.x;
        e.actor.vel.y *= e.intersection.y;
    }

    public onPostUpdate(engine: ex.Engine, delta: number): void {

        // Reset velocity.
        let v = new ex.Vector(0, 0);

        if (engine.input.keyboard.isHeld(ex.Input.Keys.W)
            || engine.input.keyboard.isHeld(ex.Input.Keys.Up)
            || engine.input.gamepads.at(0).getAxes(ex.Input.Axes.LeftStickY) > 0.5) {
            v.y -= 1;
        }

        if (engine.input.keyboard.isHeld(ex.Input.Keys.S)
            || engine.input.keyboard.isHeld(ex.Input.Keys.Down)
            || engine.input.gamepads.at(0).getAxes(ex.Input.Axes.LeftStickY) < -0.5) {
            v.y += 1;
        }

        if (engine.input.keyboard.isHeld(ex.Input.Keys.D)
            || engine.input.keyboard.isHeld(ex.Input.Keys.Right)
            || engine.input.gamepads.at(0).getAxes(ex.Input.Axes.LeftStickX) > 0.5) {
            v.x += 1;
        }

        if (engine.input.keyboard.isHeld(ex.Input.Keys.A)
            || engine.input.keyboard.isHeld(ex.Input.Keys.Left)
            || engine.input.gamepads.at(0).getAxes(ex.Input.Axes.LeftStickX) > 0.5) {
            v.x -= 1;
        }

        let speed = config.player.speed;

        if (engine.input.keyboard.isHeld(ex.Input.Keys.ShiftLeft)) {
            speed = speed * config.player.speed;
        }

        if (!ex.Vector.Zero.equals(v)) {
            v = v.normalize();
            v = v.scale(speed);
        }

        this.vel = v;
    }
}
