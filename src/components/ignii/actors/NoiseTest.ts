
// namespace jjinn {


//     export class NoiseTest extends ex.Scene {

//         public drawer: ex.PerlinDrawer2D;
//         public noise: ex.PerlinGenerator;

//         constructor(engine: ex.Engine) {
//             super(engine);

//             let noise = new ex.PerlinGenerator({
//                 seed: 516,
//                 octaves: 5,
//                 frequency: 5,
//                 amplitude: 0.5,
//                 persistance: 0.5
//             });

//             this.drawer = new ex.PerlinDrawer2D(noise, (val: number) => {
//                 val = Math.floor(val / 16) * 16;
//                 return ex.Color.fromRGB(val, val, val);
//             });

//             this.on("initialize", this.initialize);
//         }

//         img: HTMLImageElement;

//         initialize(e: ex.InitializeEvent): void {
//             this.drawer.draw(e.engine.ctx, 0, 0, 600, 400);
//             this.img = this.drawer.image(600, 400);
//             e.engine.canvas.parentElement.appendChild(this.img);
//         }
//     }
// }