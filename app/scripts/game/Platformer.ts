import { Rect } from '../utils/canvas/Rect';
import { checkForCollision } from './utils/checkForCollision';
import { getObstacleArr } from './utils/getObstacleArr';
import { getAntagonistArr } from './utils/getAntagonistArr';
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
        this.stage.innerWidth = canvas.width * 4;
        this.stage.innerHeight = canvas.height;
        this.stage.xTranslateStart = canvas.width / 2;
        this.stage.xTranslateEnd = this.stage.innerWidth - (canvas.width / 2);

        this.protagonist = new Character(canvas.ctx);
        this.protagonist.x = 16;
        this.protagonist.y = (this.stage.innerHeight / 2) - this.protagonist.height;

        this.isJumpKeyPressed = false;
        this.isShootKeyPressed = false;

        this._endLoop = false;
        this._endLoopCount = 0;

        this.obstacleArr = getObstacleArr(canvas.ctx, this.stage.innerWidth, this.stage.innerHeight);
        this.antagonistArr = getAntagonistArr(canvas.ctx, this.stage.innerWidth, this.stage.innerHeight);

        this
            .bind()
            .update();
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

    /** Draws protagonist, antagonists and obstacles */
    private update(): this {

        let { canvas, stage, protagonist, antagonistArr, obstacleArr } = this;

        // Clear stage visible area
        canvas.ctx.clearRect(-stage.x, stage.y, stage.outerWidth, stage.outerHeight);

        // Update protagonist and its bullets
        protagonist.update();
        protagonist.bulletArr.forEach(bullet => { bullet.update() });
        protagonist.bulletArr.forEach((bullet, i) => {

            this
                .cleanBulletArr(protagonist.bulletArr, i, bullet)
                .checkForShotCharacter(bullet, antagonistArr)
                .checkForBulletCollision(bullet, obstacleArr);
        });

        // Update antagonist and its bullets
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

        // Check if characters has collide with obstacles or if character had
        // collide with each other
        obstacleArr.forEach(obstacle => {

            // Invisible obstacles don't affect protagonist
            if (!obstacle.isInvisible) {
                let protagonistCollision = checkForCollision(protagonist, obstacle, true);
                if (typeof protagonistCollision === 'object') {
                    protagonist.collisionHandler(
                        protagonistCollision.side,
                        protagonistCollision.depth);

                    if (obstacle.canKill) {
                        protagonist.kill();
                    }
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

        // Render antagonist and its bullets
        antagonistArr.forEach(antagonist => {
            antagonist.bulletArr.forEach(bullet => { bullet.render(); });
            antagonist.render();
        });

        // Render protagonist and its bullets
        protagonist.bulletArr.forEach(bullet => { bullet.render(); });
        protagonist.render();

        // Move stage along with protagonist
        stage.x = protagonist.x;
        stage.render();

        // End game validation
        if (this._endLoop) {
            if (this._endLoopCount === protagonist.clearWait - 2) {
                // Reload website
                location.reload();
                // Avoid rendering
                return this;
            }
            this._endLoopCount++;
        }

        // Restart game if protagonist is death or very close to the end
        if (protagonist.isDeath || this.protagonist.x > (stage.innerWidth - protagonist.width - 10)) {
            this._endLoop = true;
        }

        // Keep updating if everything is ok
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

            // Invisible obstacles don't affect bullets
            if (target['isInvisible']) return;

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
