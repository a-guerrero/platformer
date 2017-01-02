import { checkForCollision } from './checkForCollision';
import { Stage } from './Stage';
import { Character } from './Character';
import { Obstacle } from './Obstacle';

interface Canvas {
    elem: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
}

export class Platformer {

    private stage: Stage;
    private protagonist: Character;
    private obstacleArr: Obstacle[];

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

        this
            .bind()
            .setObstacleArr()
            //.update();

        setInterval(() => { this.update(); }, 250 );
    }

    private setObstacleArr(): this {

        let { stage, canvas } = this;
        let obstaclesData = [
            // Ground
            { x: 0, y: stage.height - 10, width: stage.width, height: 20 },
            // Left wall
            { x: -10, y: 0, width: 20, height: stage.height },
            // Right wall
            { x: stage.width - 10, y: 0, width: 20, height: stage.height },
            // Bards
            { x: 40,  y: stage.height - 70, width: 40, height: 60 },
            { x: 120, y: stage.height - 70, width: 40, height: 60 },
            { x: 200, y: stage.height - 70, width: 40, height: 60 },
            { x: 280, y: stage.height - 70, width: 40, height: 60 }
        ];

        this.obstacleArr = [];
        obstaclesData.forEach(obj => {

            let obstacle = new Obstacle(canvas.ctx);
            obstacle.x = obj.x;
            obstacle.y = obj.y;
            obstacle.width = obj.width;
            obstacle.height = obj.height;

            this.obstacleArr.push(obstacle);
        });

        return this;
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

        let { canvas, stage, protagonist, obstacleArr } = this;

        canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

        protagonist.update();

        obstacleArr.forEach(obstacle => {

            let collision = checkForCollision(protagonist, obstacle, true);

            if (typeof collision === 'object') {
                protagonist.collisionHandler(collision.side, collision.depth);
            }

            obstacle.render();
        });

        protagonist.render();
        // requestAnimationFrame(this.update.bind(this));

        return this;
    }
}
