/// <reference path="../../../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../../scripts/typings/three.d.ts" />

module Igni {

    export class Game {

        private _clock: THREE.Clock;

        private _camera: THREE.Camera;
        private _scene: THREE.Scene;
        private _renderer: THREE.CanvasRenderer;

        constructor() {

            this._checkRequirements();
        }

        private _checkRequirements() {
            // Display a message if WebGl isn't supported.
            if (!$('html').hasClass('webGl')) {
                $('#container > article').prepend($('<p>WebGL is not supported in your browser.</p>'));

                return false;
            }

            return true;
        }

        private _renderloop() {

            requestAnimationFrame(this._renderloop);
            this.Update();
            this.Draw();
        }

        Start() {
            this._clock.start();
        }

        Stop() {
            this._clock.stop();
        }

        Draw() {
            this._renderer.render(this._scene, this._camera);
        }

        Update() {

        }
    }
}