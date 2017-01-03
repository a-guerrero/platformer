import { Rect } from '../utils/canvas/Rect';
import { checkForCollision } from './utils/checkForCollision';
import { Stage } from './Stage';
import { Character } from './Character';
import { Antagonist } from './Antagonist';
import { Bullet } from './Bullet';
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
    private antagonistArr: Antagonist[];
    private obstacleArr: Obstacle[];

    private isJumpKeyPressed: boolean;
    private isShootKeyPressed: boolean;

    private _endLoop: boolean;
    private _endLoopCount: number;

    constructor(public canvas: Canvas) {

        canvas.elem.width = canvas.width;
        canvas.elem.height = canvas.height;

        this.stage = new Stage(canvas.ctx);
        this.stage.outerWidth = canvas.width;
        this.stage.outerHeight = canvas.height;
        this.stage.innerWidth = canvas.width * 3;
        this.stage.innerHeight = canvas.height;
        this.stage.xTranslateStart = canvas.width / 2;
        this.stage.xTranslateEnd = this.stage.innerWidth - (canvas.width / 2);

        this.protagonist = new Character(canvas.ctx);
        this.protagonist.y = (this.stage.innerHeight / 2) - this.protagonist.height;
        this.protagonist.fillStyle = 'indianred';

        this.isJumpKeyPressed = false;
        this.isShootKeyPressed = false;

        this._endLoop = false;
        this._endLoopCount = 0;

        this
            .bind()
            .setObstacleArr()
            .setAntagonistArray()
            .update();

        // setInterval(() => { this.update(); }, 250);
    }

    private setObstacleArr(): this {

        let { stage, canvas } = this;
        let obstaclesData = <Obstacle[]>[
            // Ground
            { x: 0, y: stage.innerHeight - 10, width: stage.innerWidth, height: 20 },
            // Left wall (hidden)
            { x: -20, y: 0, width: 20, height: stage.innerHeight },
            // Right wall (hidden)
            { x: stage.innerWidth + 20, y: 0, width: 20, height: stage.innerHeight },
            // Bards
            { x: 40, y: stage.innerHeight - 70, width: 40, height: 60 },
            { x: 280, y: stage.innerHeight - 70, width: 40, height: 60 },
            // Lava
            { x: 320, y: stage.innerHeight - 30, width: 100, height: 20, fillStyle: 'red', canKill: true }
        ];

        this.obstacleArr = [];
        obstaclesData.forEach(obj => {

            let obstacle = new Obstacle(canvas.ctx);
            obstacle.x = obj.x;
            obstacle.y = obj.y;
            obstacle.width = obj.width;
            obstacle.height = obj.height;

            if (obj.fillStyle) obstacle.fillStyle = obj.fillStyle;
            if (obj.canKill) obstacle.canKill = obj.canKill;

            this.obstacleArr.push(obstacle);
        });

        return this;
    }

    private setAntagonistArray(): this {

        let { stage, canvas } = this;

        const antagonistData = <Antagonist[]>[
            { y: this.stage.innerHeight - 30, x: 80, canJump: true, canShoot: true, canMove: true },
            { y: this.stage.innerHeight - 30, x: 120, canMove: true, lastMove: 'left', fillStyle: 'gray' }
        ];

        this.antagonistArr = [];
        antagonistData.forEach(obj => {

            let antagonist = new Antagonist(canvas.ctx);

            antagonist.x = obj.x;
            antagonist.y = obj.y;

            if (obj.lastMove) antagonist.lastMove = obj.lastMove;
            if (obj.canMove) antagonist.canMove = obj.canMove;
            if (obj.canJump) antagonist.canJump = obj.canJump;
            if (obj.canShoot) antagonist.canShoot = obj.canShoot;
            if (obj.fillStyle) antagonist.fillStyle = obj.fillStyle;

            this.antagonistArr.push(antagonist);
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

        let { canvas, stage, protagonist, antagonistArr, obstacleArr } = this;

        canvas.ctx.clearRect(-stage.x, stage.y, stage.outerWidth, stage.outerHeight);

        protagonist.update();
        protagonist.bulletArr.forEach(bullet => { bullet.update() });
        protagonist.bulletArr.forEach((bullet, i) => {

            this
                .cleanBulletArr(protagonist.bulletArr, i, bullet)
                .checkForShotCharacter(bullet, antagonistArr)
                .checkForBulletCollision(bullet, obstacleArr);
        });

        antagonistArr.forEach(antagonist => {
            antagonist.update();
            antagonist.bulletArr.forEach(bullet => { bullet.update() });
            antagonist.bulletArr.forEach((bullet, i) => {
                this
                    .cleanBulletArr(antagonist.bulletArr, i, bullet)
                    .checkForShotCharacter(bullet, [protagonist])
                    .checkForBulletCollision(bullet, obstacleArr);
            });
        });

        obstacleArr.forEach(obstacle => {

            let protagonistCollision = checkForCollision(protagonist, obstacle, true);
            if (typeof protagonistCollision === 'object') {
                protagonist.collisionHandler(
                    protagonistCollision.side,
                    protagonistCollision.depth);

                if (obstacle.canKill) {
                    protagonist.kill();
                }
            }

            antagonistArr.forEach(antagonist => {

                let antagonistCollison = checkForCollision(antagonist, obstacle, true);
                if (typeof antagonistCollison === 'object') {
                    antagonist.collisionHandler(
                        antagonistCollison.side,
                        antagonistCollison.depth);
                }

                if (!antagonist.isDeath) {
                    let mortalCollision = checkForCollision(protagonist, antagonist);
                    if (mortalCollision) {
                        protagonist.kill();
                        antagonist.kill();
                    }
                }
            });

            obstacle.render();
        });

        antagonistArr.forEach(antagonist => {
            antagonist.bulletArr.forEach(bullet => { bullet.render(); });
            antagonist.render();
        });

        protagonist.bulletArr.forEach(bullet => { bullet.render(); });
        protagonist.render();

        stage.x = protagonist.x;
        stage.render();

        if (this._endLoop) {
            if (this._endLoopCount === this.protagonist.clearWait - 2) {
                // Reload website
                location.reload();
                // Avoid rendering
                return this;
            }
            this._endLoopCount++;
        }

        this._endLoop = this.protagonist.isDeath;
        requestAnimationFrame(this.update.bind(this));

        return this;
    }

    /** Cleans bullets that are out of sight */
    private cleanBulletArr(bulletArr: Bullet[], index: number, bullet: Bullet): this {

        let { canvas, stage } = this;

        // Check if is out of sight
        if (bullet.remove || (bullet.x < -stage.x || bullet.x > -stage.x + stage.outerWidth)) {
            // Remove from array
            bulletArr.splice(index, 1);
        }

        return this;
    }

    /** Checks if a bullet has collided with a Character */
    private checkForShotCharacter(bullet: Bullet, characterArr: Character[]): this {

        characterArr.forEach(character => {

            if (!character.isDeath) {
                this.checkForBulletCollision(bullet, [character], (character: Character) => {
                    character.kill();
                });
            }
        })

        return this;
    }

    /** Checks if a bullet has collided with another Rect */
    private checkForBulletCollision(bullet: Bullet, targetArr: Rect[], handler?: (rect: Rect) => void): this {

        targetArr.forEach(target => {

            let collision = checkForCollision(bullet, target, true);

            if (typeof collision === 'object') {
                bullet.collisionHandler(collision.side, collision.depth);

                if (typeof handler === 'function') {
                    handler(target);
                }
            }
        });

        return this;
    }
}
