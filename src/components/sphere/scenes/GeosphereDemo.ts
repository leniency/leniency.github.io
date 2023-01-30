import { TargetCamera, ArcRotateCamera, PointLight, HemisphericLight, Vector3 } from "@babylonjs/core";
import BaseScene from "./BaseScene";
import Main from "../Main";
import { Geosphere } from "../components/Geosphere";

export interface GeosphereOptions {
    subdivisions?: number
}

export default class GeosphereDemo extends BaseScene {

    _camera: TargetCamera;

    constructor(main: Main, options?: GeosphereOptions) {
        super(main);

        this._camera = new ArcRotateCamera("camera1", -0.8, 1, 3, Vector3.Zero(), this.scene);

        // Target the camera to scene origin.
        this._camera.speed = 1.5;
        this._camera.inertia = 0.5;

        // Attach the camera to the canvas.
        this._camera.attachControl(this.main.canvas, false);

        let l = new PointLight("Sun", new Vector3(10, 10, 10), this.scene);

        // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        var light = new HemisphericLight('light1', new Vector3(0, 0.6, 0), this.scene);

        new Geosphere("world", {
            subdivisions: options?.subdivisions ?? 5
        }, this.scene);
    }
}