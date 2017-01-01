import { Stage } from './Stage';
import { Character } from './Character';

interface Canvas {
    elem: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
}

export class Platformer {

    private stage: Stage;
    private protagonist: Character;

    constructor(public canvas: Canvas) {

        canvas.elem.width = canvas.width;
        canvas.elem.height = canvas.height;

        this.stage = new Stage(canvas.ctx);
        this.stage.width = canvas.width * 2;
        this.stage.height = canvas.height;
        this.stage.xTranslateStart = canvas.width / 2;
        this.stage.xTranslateEnd = this.stage.width - (canvas.width / 2);

        this.protagonist = new Character(canvas.ctx);
        this.protagonist.y = canvas.height - this.protagonist.height;
        this.protagonist.fillStyle = 'indianred';

        this.bind();
        this.update();
        // setInterval(() => { this.update(); }, 150);
    }

    private bind(): this {

        document.addEventListener('keydown', e => {
            this.onkeydown(e);
        }, false);

        document.addEventListener('keyup', e => {
            this.onkeyup(e);
        }, false);

        return this;
    }

    private onkeydown(e: KeyboardEvent) {

        let { protagonist } = this;
        let keyCode = e.keyCode

        if (keyCode === 39) {
            protagonist.isMovingRight = true;
        }
        if (keyCode === 37) {
            protagonist.isMovingLeft = true;
        }
        if (keyCode === 38 || keyCode === 32) {
            if (!protagonist.isJumpDisabled) {
                protagonist.jump();
            }
        }
    }

    private onkeyup(e: KeyboardEvent) {

        let { protagonist } = this;
        let keyCode = e.keyCode

        if (keyCode === 39) {
            protagonist.isMovingRight = false;
        }
        if (keyCode === 37) {
            protagonist.isMovingLeft = false;
        }
        if (keyCode === 38 || keyCode === 32) {
            protagonist.isJumpDisabled = false;
        }
    }

    private update(): this {

        let { canvas, stage, protagonist } = this;

        canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

        protagonist.update();
        protagonist.render();

        requestAnimationFrame(this.update.bind(this));

        return this;
    }
}
