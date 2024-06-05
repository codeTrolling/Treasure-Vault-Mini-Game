import * as PIXI from "./node_modules/pixi.js/dist/pixi.min.mjs";

const app = new PIXI.Application();

//random pixi.js problem? or am I missing something here? I need to await for app.init() but you can't await in the main top level function. This is the workaround I found
(async () => {


await app.init();
document.body.appendChild(app.view)
console.log(app.renderer);
// if(!app.renderer){
//     return;
// }
app.renderer.resize(window.innerWidth, window.innerHeight);
app.view.style.position = "absolute";




})();
