import * as PIXI from "./node_modules/pixi.js/dist/pixi.min.mjs";

const app = new PIXI.Application({resizeTo: window});


//random pixi.js problem? or am I missing something here? I need to await for app.init() but you can't await in the main top level function. This is the workaround I found
(async () => {
    // not best practice but should be fine for 7 images
    await PIXI.Assets.load(["./assets/bg.png", "./assets/blink.png", "./assets/door.png", "./assets/doorOpen.png",
        "./assets/doorOpenShadow.png", "./assets/handle.png", "./assets/handleShadow.png"
    ]);
    

await app.init();
document.body.appendChild(app.view)
console.log(app.renderer);
if(!app.renderer){
    return;
}
app.renderer.resize(window.innerWidth, window.innerHeight);
app.view.style.position = "absolute";

const backgroundImage = PIXI.Sprite.from("./assets/bg.png");
backgroundImage.width = app.view.width;
backgroundImage.height = app.view.height;
app.stage.addChild(backgroundImage);


const container = new PIXI.Container();
const door = PIXI.Sprite.from("./assets/door.png");
door.setSize(app.view.width / 3, app.view.height / 1.67);
container.addChild(door);


const handle = PIXI.Sprite.from("./assets/handle.png");
const handleShadow = PIXI.Sprite.from("./assets/handleShadow.png");

handle.setSize(door.width / 2.95, door.height / 2.44);
handleShadow.setSize(door.width / 2.95, door.height / 2.44);
handle.x = (door.width / 2.18) - (handle.width / 2);
handle.y = (door.height / 2) - (handle.height / 2);
handleShadow.x = (door.width / 2.14) - (handle.width / 2);
handleShadow.y = (door.height / 1.95) - (handle.height / 2);
container.addChild(handleShadow);
container.addChild(handle);

container.x = (app.view.width / 1.96) - (container.width / 2);
container.y = (app.view.height / 2.068) - (container.height / 2);

app.stage.addChild(container);
function tick(delta){ 
}

})();
