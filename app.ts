// this is the file we need when compiling the ts file. uncomment when building the project.
import * as PIXI from "../node_modules/pixi.js/dist/pixi.min.mjs";
// this has a declaration file. use this when developing
//import * as PIXI from "./node_modules/pixi.js/dist/pixi.js";

const app = new PIXI.Application({resizeTo: window});

let handleRotation: number = 0;
let targetRotation = handleRotation;

//random pixi.js problem? or am I missing something here? I need to await for app.init() but you can't await in the main top level function. This is the workaround I found
(async () => {
    // not best practice but should be fine for 7 images
    await PIXI.Assets.load(["./assets/bg.png", "./assets/blink.png", "./assets/door.png", "./assets/doorOpen.png",
        "./assets/doorOpenShadow.png", "./assets/handle.png", "./assets/handleShadow.png"
    ]);
    

await app.init();
document.body.appendChild(app.view)
// if(!app.renderer){
//     return;
// }
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
handle.x = (door.width / 2.18);
handle.y = (door.height / 2);
handle.anchor.set(0.5, 0.5);
handle.interactive = true;

handleShadow.x = (door.width / 2.14);
handleShadow.y = (door.height / 1.95);
handleShadow.anchor.set(0.5, 0.5);

handle.on('pointerdown', (e) => {
    if(e.clientX < handle.getGlobalPosition().x ){
        rotateHandle(-(Math.PI / 3), handle, handleShadow);
    }
    else{
        rotateHandle(Math.PI / 3, handle, handleShadow);
    }
})

container.addChild(handleShadow);
container.addChild(handle);

container.x = (app.view.width / 1.96) - (container.width / 2);
container.y = (app.view.height / 2.068) - (container.height / 2);

app.stage.addChild(container);
function tick(delta: number){ 
    console.log("hi");
}

})();


function rotateHandle(rot: number, handle: PIXI.Sprite, handleShadow: PIXI.Sprite){
    targetRotation = handleRotation + rot + (targetRotation - handleRotation);
    let startRotation = handleRotation;

    //using promise instead of setInterval due to bonus points requirements
    // there's something happening here that I don't know about. I think pixi.js's update function doesn't grab these values while the promise is still pending.
    // let p = new Promise((resolve, reject) => {
    //     let timer = Date.now() - 10;
    //     while(true){
    //         if(timer <= Date.now()){
    //             handle.rotation += 0.1 * rot;
    //             handleShadow.rotation += 0.1 * rot;
    //             handleRotation += 0.1 * rot;
    //             timer = Date.now() + 20;
    //         }

    //         if((startRotation < targetRotation && handleRotation >= targetRotation) || (startRotation > targetRotation && handleRotation <= targetRotation)){
    //             handle.rotation = targetRotation;
    //             handleShadow.rotation = targetRotation;
    //             handleRotation = targetRotation;
    //             resolve(1);
    //             break;
    //         }
    //     }
    // })

    let interval = setInterval(()=>{
        handle.rotation += 0.1 * rot;
        handleShadow.rotation += 0.1 * rot;
        handleRotation += 0.1 * rot;
        console.log(handleRotation, targetRotation)
        if((startRotation < targetRotation && handleRotation >= targetRotation) || (startRotation > targetRotation && handleRotation <= targetRotation)){
            handle.rotation = targetRotation;
            handleShadow.rotation = targetRotation;
            handleRotation = targetRotation;
            clearInterval(interval);
        }
    }, 20)
}