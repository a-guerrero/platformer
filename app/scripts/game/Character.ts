import { Rect } from '../utils/canvas/Rect';
import { GRAVITY } from './utils/constants';
import { Bullet } from './Bullet';

export class Character extends Rect {

    friction = 0.75;
    xSpeed = 4;
    ySpeed = 8;
    clearWait = 10;
    lastMove: xDirections = 'right';
    fillStyle: CanvasFillStyle = 'black';

    protected _xVel = 0;
    protected _yVel = 0;
    protected _isDeath = false;
    protected _isJumping = false;
    protected _isMovingLeft = false;
    protected _isMovingRight = false;
    protected _clearWaitCount = 0;
    protected _bulletArr: Bullet[] = [];

    constructor(public context: CanvasRenderingContext2D) {

        super(context);

        this.width = 20;
        this.height = 30;
    }

    get xVel() { return this._xVel; }
    get yVel() { return this._yVel; }
    get isDeath() { return this._isDeath; }
    get isJumping() { return this._isJumping; }
    get isMovingLeft() { return this._isMovingLeft; }
    get isMovingRight() { return this._isMovingRight; }
    get bulletArr() { return this._bulletArr; }
    get clearWaitCount() { return this._clearWaitCount; }

    kill(): this {

        // Ends horizontal moving completly
        this.stopMove();
        this._xVel = 0;

        // Ends vertical moving completly
        this._isJumping = false;
        this._yVel = 0;

        this._isDeath = true;

        return this;
    }

    move(action: xDirections): this {

        if (!this._isDeath) {
            this._isMovingLeft = action === 'left';
            this._isMovingRight = action === 'right';
            this.lastMove = action;
        }

        return this;
    }

    stopMove(action?: xDirections, sharp = false): this {

        // End horizontal moving smoothly
        this._isMovingRight = !action || action === 'right' ? false : this._isMovingRight;
        this._isMovingLeft = !action || action === 'left' ? false : this._isMovingLeft;

        return this;
    }

    jump(): this {

        // Abort if already jumping or not grounded (falling down from a cliff)
        if (!this._isJumping && this._yVel === 0) {
            this._isJumping = true;
            this._yVel -= this.ySpeed;
        }

        return this;
    }

    shoot() {

        let { context, x, y, width, height } = this;

        let bullet = new Bullet(context);
        bullet.x = (x + width / 2) - (bullet.width / 2);
        bullet.y = (y + height / 2) - (bullet.height / 2);

        bullet.move(this.lastMove);
        this._bulletArr.push(bullet);
    }

    update(): this {

        if (!this._isDeath) {

            // Move right
            if (this._isMovingRight) {
                if (this._xVel < this.xSpeed) {
                    this._xVel++;
                }
            }
            // Move left
            else if (this._isMovingLeft) {
                if (this._xVel > -this.xSpeed) {
                    this._xVel--;
                }
            }
            // Slow down and stop it
            else if (this._xVel !== 0) {
                if (Math.abs(this._xVel) < 0.05) {
                    this._xVel = 0;
                }
                else {
                    this._xVel *= this.friction;
                }
            }

            // Gravity must always push down
            this._yVel += GRAVITY;

            // Make speed || friction affect x
            this.x += this._xVel;

            // Make gravity affect y
            this.y += this._yVel;

            // Update bullets
            this._bulletArr.forEach(bullet => {
                bullet.update();
            });
        }

        return this;
    }

    collisionHandler(side: xyDirections, depth: number): this {

        if (!this._isDeath) {
            switch (side) {
                case 'left':
                    this.x += depth;
                    break;
                case 'right':
                    this.x -= depth;
                    break;
                case 'top':
                    this.y += depth;
                    // Update vertical movement
                    this._yVel = 0;
                    break;
                case 'bottom':
                    this.y -= depth;
                    break;
            }

            // Stop character horizontal movement
            if (side === 'left' || side === 'right') {
                this._xVel = 0;
            }

            // Stop vertical movement if character is moving down
            if (side === 'bottom' && this._yVel > 0) {
                this._yVel = 0;

                if (this._isJumping) {
                    this._isJumping = false;
                }
            }
        }

        return this;
    }

    render(): this {

        let { context, _bulletArr } = this;

        if (this._isDeath) {
            if (this._clearWaitCount === this.clearWait) {
                // Avoid rendering
                return this;
            }
            this._clearWaitCount++;
        }

        _bulletArr.forEach(bullet => {
            bullet.render();
        });

        context.fillStyle = this.fillStyle;
        super.render();
        context.fill();

        return this;
    }
}
