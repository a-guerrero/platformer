import { checkForCollision } from './utils/checkForCollision';
import { Stage } from './Stage';
import { Character } from './Character';
import { Antagonist } from './Antagonist';
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
    private antagonist: Antagonist;
    private obstacleArr: Obstacle[];

    private isJumpKeyPressed: boolean;
    private isShootKeyPressed: boolean;

    constructor(public canvas: Canvas) {

        canvas.elem.width = canvas.width;
        canvas.elem.height = canvas.height;

        this.stage = new Stage(canvas.ctx);
        this.stage.width = canvas.width * 2;
        this.stage.height = canvas.height;
        this.stage.xTranslateStart = canvas.width / 2;
        this.stage.xTranslateEnd = this.stage.width - (canvas.width / 2);

        this.protagonist = new Character(canvas.ctx);
        this.protagonist.y = this.stage.height - this.protagonist.height;
        this.protagonist.fillStyle = 'indianred';

        this.antagonist = new Antagonist(canvas.ctx);
        this.antagonist.y = this.stage.height - this.antagonist.height;
        this.antagonist.x = 80;
        this.antagonist.canJump = true;
        this.antagonist.move('right');

        this.isJumpKeyPressed = false;
        this.isShootKeyPressed = false;

        this
            .bind()
            .setObstacleArr()
            .update();

        // setInterval(() => { this.update(); }, 250 );
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
            { x: 40, y: stage.height - 70, width: 40, height: 60 },
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
            protagonist.move('right');
        }
        if (keyCode === 37) {
            protagonist.move('left');
        }
        if (keyCode === 38 || keyCode === 32) {
            // Prevent continuous jumping
            if (!this.isJumpKeyPressed) {
                protagonist.jump();
                this.isJumpKeyPressed = true;
            }
        }
        if (keyCode === 90) {
            // Prevent continuous shooting
            if (!this.isShootKeyPressed) {
                protagonist.shoot();
                this.isShootKeyPressed = true;
            }
        }
    }

    private onkeyup(e: KeyboardEvent) {

        let { protagonist } = this;
        let keyCode = e.keyCode

        if (keyCode === 39) {
            protagonist.stopMove('right');
        }
        if (keyCode === 37) {
            protagonist.stopMove('left');
        }
        if (keyCode === 38 || keyCode === 32) {
            this.isJumpKeyPressed = false;
        }
        if (keyCode === 90) {
            this.isShootKeyPressed = false;
        }
    }

    private update(): this {

        let { canvas, stage, protagonist, antagonist, obstacleArr } = this;

        canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

        protagonist.update();
        antagonist.update();

        obstacleArr.forEach(obstacle => {

            let protagonistCollision = checkForCollision(protagonist, obstacle, true);
            if (typeof protagonistCollision === 'object') {
                protagonist.collisionHandler(
                    protagonistCollision.side,
                    protagonistCollision.depth);
            }

            let antagonistCollison = checkForCollision(antagonist, obstacle, true);
            if (typeof antagonistCollison === 'object') {
                antagonist.collisionHandler(
                    antagonistCollison.side,
                    antagonistCollison.depth);
            }

            let mortalCollision = checkForCollision(protagonist, antagonist);
            if (mortalCollision) {
                protagonist.kill();
                antagonist.kill();
            }

            obstacle.render();
        });

        antagonist.render();
        protagonist.render();

        requestAnimationFrame(this.update.bind(this));

        return this;
    }
}
