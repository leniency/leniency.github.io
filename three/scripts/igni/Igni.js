/// <reference path="../../../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../../scripts/typings/three.d.ts" />
var Igni;
(function (Igni) {
    var Game = (function () {
        function Game() {
            this._checkRequirements();
        }
        Game.prototype._checkRequirements = function () {
            if (!$('html').hasClass('webGl')) {
                $('#container > article').prepend($('<p>WebGL is not supported in your browser.</p>'));

                return false;
            }

            return true;
        };

        Game.prototype._renderloop = function () {
            requestAnimationFrame(this._renderloop);
            this.Update();
            this.Draw();
        };

        Game.prototype.Start = function () {
            this._clock.start();
        };

        Game.prototype.Stop = function () {
            this._clock.stop();
        };

        Game.prototype.Draw = function () {
            this._renderer.render(this._scene, this._camera);
        };

        Game.prototype.Update = function () {
        };
        return Game;
    })();
    Igni.Game = Game;
})(Igni || (Igni = {}));
//# sourceMappingURL=Igni.js.map
