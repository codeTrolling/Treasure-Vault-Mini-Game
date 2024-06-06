var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// this is the file we need when compiling the ts file. uncomment when building the project.
import * as PIXI from "../node_modules/pixi.js/dist/pixi.min.mjs";
// this has a declaration file. use this when developing
//import * as PIXI from "./node_modules/pixi.js/dist/pixi.js";
const app = new PIXI.Application({ resizeTo: window });
let handleRotation = 0;
let targetRotation = handleRotation;
let code;
let currentPair;
let pairIndex;
let currentRotationNumber;
let timer = [0, 0];
let timerInterval;
const timerText = new PIXI.Text("0:00");
(() => __awaiter(void 0, void 0, void 0, function* () {
    // not best practice but should be fine for 7 images
    yield PIXI.Assets.load(["./assets/bg.png", "./assets/blink.png", "./assets/door.png", "./assets/doorOpen.png",
        "./assets/doorOpenShadow.png", "./assets/handle.png", "./assets/handleShadow.png"
    ]);
    yield app.init();
    handleRotation = 0;
    targetRotation = 0;
    document.body.appendChild(app.view);
    code = generateCode();
    pairIndex = 0;
    currentPair = code[pairIndex];
    currentRotationNumber = 0;
    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.view.style.position = "absolute";
    const backgroundImage = PIXI.Sprite.from("./assets/bg.png");
    backgroundImage.width = app.view.width;
    backgroundImage.height = app.view.height;
    app.stage.addChild(backgroundImage);
    const glow1 = PIXI.Sprite.from("./assets/blink.png");
    const glow2 = PIXI.Sprite.from("./assets/blink.png");
    const glow3 = PIXI.Sprite.from("./assets/blink.png");
    glow1.setSize(backgroundImage.width / 11.257, backgroundImage.height / 5.63);
    glow2.setSize(backgroundImage.width / 11.257, backgroundImage.height / 5.63);
    glow3.setSize(backgroundImage.width / 11.257, backgroundImage.height / 5.63);
    glow1.x = backgroundImage.width / 2.7;
    glow1.y = backgroundImage.height / 2.5;
    glow2.x = backgroundImage.width / 2.27;
    glow2.y = backgroundImage.height / 2.48;
    glow3.x = backgroundImage.width / 2.07;
    glow3.y = backgroundImage.height / 1.9;
    app.stage.addChild(glow1);
    app.stage.addChild(glow2);
    app.stage.addChild(glow3);
    timerText.x = backgroundImage.width / 3.46;
    timerText.y = backgroundImage.height / 2.275;
    timerText.style.fill = "white";
    timerText.style.fontSize = (backgroundImage.width * 0.013) + "px";
    app.stage.addChild(timerText);
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
        if (e.clientX < handle.getGlobalPosition().x) {
            if (currentRotationNumber < currentPair[0] && currentPair[1] === "counterclockwise") {
                rotateHandle(-(Math.PI / 3), handle, handleShadow);
                currentRotationNumber++;
                checkGameState();
            }
            else {
                restartGame(-1);
            }
        }
        else {
            if (currentRotationNumber < currentPair[0] && currentPair[1] === "clockwise") {
                rotateHandle(Math.PI / 3, handle, handleShadow);
                currentRotationNumber++;
                checkGameState();
            }
            else {
                restartGame(1);
            }
        }
    });
    container.addChild(handleShadow);
    container.addChild(handle);
    container.x = (app.view.width / 1.96) - (container.width / 2);
    container.y = (app.view.height / 2.068) - (container.height / 2);
    const doorOpen = PIXI.Sprite.from('./assets/doorOpen.png');
    const doorOpenShadow = PIXI.Sprite.from('./assets/doorOpenShadow.png');
    doorOpen.setSize(backgroundImage.width / 4.82, backgroundImage.height / 1.67);
    doorOpen.x = (door.getGlobalPosition().x + door.width) - doorOpen.width * 0.2;
    doorOpen.y = door.getGlobalPosition().y;
    doorOpenShadow.setSize(backgroundImage.width / 4.82, backgroundImage.height / 1.67);
    doorOpenShadow.x = door.getGlobalPosition().x + door.width - doorOpen.width * 0.13;
    doorOpenShadow.y = door.getGlobalPosition().y * 1.05;
    doorOpen.visible = false;
    doorOpenShadow.visible = false;
    app.stage.addChild(doorOpenShadow);
    app.stage.addChild(doorOpen);
    app.stage.addChild(container);
    function restartGame(rotDir) {
        rotateHandle(Math.PI * 2 * rotDir, handle, handleShadow, true);
        code = generateCode();
        currentPair = code[0];
        pairIndex = 0;
        currentRotationNumber = 0;
    }
    function checkGameState() {
        if (currentRotationNumber == currentPair[0]) {
            if (pairIndex == 2) {
                door.visible = false;
                handle.visible = false;
                handleShadow.visible = false;
                doorOpen.visible = true;
                doorOpenShadow.visible = true;
                clearInterval(timerInterval);
                setTimeout(() => {
                    door.visible = true;
                    handle.visible = true;
                    handleShadow.visible = true;
                    doorOpen.visible = false;
                    doorOpenShadow.visible = false;
                    restartGame(1);
                }, 5000);
            }
            else {
                pairIndex++;
                currentPair = code[pairIndex];
                currentRotationNumber = 0;
            }
        }
    }
}))();
function rotateHandle(rot, handle, handleShadow, rs = false) {
    targetRotation = handleRotation + rot + (targetRotation - handleRotation);
    let startRotation = handleRotation;
    //using promise instead of setInterval due to bonus points requirements
    // there's something happening here that I don't know about.
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
    let interval = setInterval(() => {
        handle.rotation += 0.1 * rot;
        handleShadow.rotation += 0.1 * rot;
        handleRotation += 0.1 * rot;
        if ((startRotation <= targetRotation && handleRotation >= targetRotation) || (startRotation >= targetRotation && handleRotation <= targetRotation)) {
            if (rs) {
                targetRotation = 0;
            }
            handle.rotation = targetRotation;
            handleShadow.rotation = targetRotation;
            handleRotation = targetRotation;
            clearInterval(interval);
        }
    }, 20);
}
function generateCode() {
    let generatedCode = new Array();
    for (let i = 0; i < 3; i++) {
        let dir = Math.random() > 0.5 ? "clockwise" : "counterclockwise";
        let num = Math.floor(Math.random() * 9 + 1);
        generatedCode.push([num, dir]);
    }
    console.log(generatedCode);
    startTimer();
    return generatedCode;
}
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timer[0] = 0;
    timer[1] = 0;
    timerText.text = "0:00";
    timerInterval = setInterval(() => {
        timer[1]++;
        if (timer[1] > 59) {
            timer[0]++;
            timer[1] = 0;
        }
        timerText.text = `${timer[0]}:${timer[1] > 9 ? timer[1] : '0' + timer[1]}`;
    }, 1000);
}
