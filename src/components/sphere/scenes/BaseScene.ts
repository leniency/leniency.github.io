import { Scene } from "@babylonjs/core";
import Main from "../Main";

export default abstract class BaseScene {
    private readonly _main: Main;
    private readonly _scene: Scene;

    public get main(): Main {
        return this._main;
    }

    public get scene(): Scene {
        return this._scene;
    }

    constructor(main: Main) {
        this._main = main;
        this._scene = new Scene(main.engine);
    }

    public render() {
        this._scene.render();
    }

    public dispose() {
        this._scene.dispose();
    }
}