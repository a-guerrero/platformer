import { Platformer } from './game/Platformer';

let canvas = <HTMLCanvasElement>document.getElementById('js-stage');

// Init game
new Platformer({
    elem: canvas,
    ctx: canvas.getContext('2d'),
    width: 512,
    height: 288
});
