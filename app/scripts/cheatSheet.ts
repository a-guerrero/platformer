(function () {
    // Sources:
    // http://www.somethinghitme.com/2013/04/16/creating-a-canvas-platformer-tutorial-part-tw/
    // http://stackoverflow.com/a/29861691/3841699

    interface Rect {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    // CANVAS CONFIG
    ////////////////////////////////////////////////////////////////////////////////
    let canvas = <HTMLCanvasElement>document.getElementById('js-stage');
    let canvasCtx = canvas.getContext('2d');
    let canvasWidth = 512;
    let canvasHeight = 288;

    // STAGE CONFIG
    ////////////////////////////////////////////////////////////////////////////////
    let stage = <{
        x: number;
        y: number;
        width: number;
        height: number;
        xTranslateStart: number;
        xTranslateEnd: number;
    }>{};
    stage.x = 0;
    stage.y = 0;
    stage.width = canvasWidth * 3;
    stage.height = canvasHeight;
    stage.xTranslateStart = canvasWidth / 2;
    stage.xTranslateEnd = stage.width - (canvasWidth / 2);

    // PLAYER CONFIG
    ////////////////////////////////////////////////////////////////////////////////
    let player = {
        x: 20,
        y: 0,
        width: 20,
        height: 30,
        speed: 4,
        velX: 0,
        velY: 0,
        jumping: false,
        grounded: false
    };

    let boxes = [
        {
            x: -10,
            y: 0,
            width: 20,
            height: stage.height
        },
        {
            x: 0,
            y: stage.height - 10,
            width: stage.width,
            height: 20
        },
        {
            x: stage.width - 10,
            y: 0,
            width: 20,
            height: stage.height
        },
        {
            x: 100,
            y: stage.height - 60,
            width: 40,
            height: 60
        },
        {
            x: 500,
            y: stage.height - 100,
            width: 40,
            height: 40
        }
    ];

    // GAME CONFIG
    ////////////////////////////////////////////////////////////////////////////////
    let keys = [];
    let friction = 0.8;
    let gravity = 0.3;

    // CANVAS SETUP
    ////////////////////////////////////////////////////////////////////////////////
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // ANIMATION LOOP
    ////////////////////////////////////////////////////////////////////////////////
    function update() {

        // Jump
        if (keys[38] || keys[32]) {
            if (!player.jumping && player.grounded) {
                player.grounded = false;
                player.jumping = true;
                player.velY = -player.speed * 2;
            }
        }
        // Move right
        if (keys[39]) {
            if (player.velX < player.speed) {
                player.velX++;
            }
        }
        // Move left
        if (keys[37]) {
            if (player.velX > -player.speed) {
                player.velX--;
            }
        }
        // Shoot
        if (keys[90]) {
            console.log('shoot');
        }

        // Add friction to player x velocity
        player.velX *= friction;

        // Add gravity to player y velocity
        player.velY += gravity; // This updates grounded

        // Clear canvas visible area
        canvasCtx.clearRect(-stage.x, stage.y, canvasWidth, canvasHeight);

        // Update player grounded state
        player.grounded = false;

        // Draw boxes
        canvasCtx.fillStyle = 'black';
        canvasCtx.beginPath();
        boxes.forEach((box) => {

            canvasCtx.rect(box.x, box.y, box.width, box.height);
            let collision = checkForCollision(player, box, true);

            if (typeof collision === 'object') {

                let { side, depth } = collision;

                switch (side) {
                    case 'left':
                    case 'right':
                        player.velX = 0;
                        player.jumping = false;
                        player.x = side === 'left' ? player.x + depth : player.x - depth;
                        break;

                    case 'top':
                        player.y += depth;
                        player.velY *= -1;
                        break;

                    case 'bottom':
                        player.y -= depth;
                        player.grounded = true;
                        player.jumping = false;
                        break;
                }
            }
        });
        canvasCtx.fill();

        if (player.grounded) {
            player.velY = 0;
        }

        player.x += player.velX;
        player.y += player.velY;

        // Draw player
        canvasCtx.fillStyle = 'indianred';
        canvasCtx.fillRect(player.x, player.y, player.width, player.height);

        // Move stage
        let stageX: number;
        if (player.x > stage.xTranslateStart) {
            if (player.x > stage.xTranslateEnd) {
                stageX = canvasWidth - stage.width;
            }
            else {
                stageX = stage.xTranslateStart - player.x;
            }
        }
        else {
            stageX = 0;
        }

        if (stage.x !== stageX) {
            canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
            canvasCtx.translate(stageX, 0);
            stage.x = stageX;
        }

        // Animation loop
        requestAnimationFrame(update);
    }

    /**
     * @see { @link http://bit.ly/2iR5hvL|Stackoverflow }
     * @see { @link http://bit.ly/2ijiL26|Codepen }
     * @see { @link https://mzl.la/2iyMrWV|MDN }
     */
    function checkForCollision(rectA: Rect, rectB: Rect, deep = false) {

        // Distance between centers in x and y axis
        let xDist = (rectA.x + rectA.width / 2) - (rectB.x + rectB.width / 2);
        let yDist = (rectA.y + rectA.height / 2) - (rectB.y + rectB.height / 2);

        // Width and height halfs sum of each rect (is the distance between centers
        // if the rects were side by side and aligned vertically or horizontally).
        let xHalfs = (rectA.width + rectB.width) / 2;
        let yHalfs = (rectA.height + rectB.height) / 2;

        // If the distance between centers is less than the halfs in each axis then
        // rects are colliding.
        if (Math.abs(xDist) < xHalfs && Math.abs(yDist) < yHalfs) {
            if (deep) {
                const xDepth = xHalfs - Math.abs(xDist);
                const yDepth = yHalfs - Math.abs(yDist);

                if (xDepth >= yDepth) {
                    return {
                        side: yDist > 0 ? 'top' : 'bottom',
                        depth: yDepth
                    }
                }
                else {
                    return {
                        side: xDist > 0 ? 'left' : 'right',
                        depth: xDepth
                    }
                }
            }
            else {
                return true;
            }
        }

        return false;
    }

    // BINDINGS
    ////////////////////////////////////////////////////////////////////////////////
    document.body.addEventListener('keydown', e => {
        keys[e.keyCode] = true;
    });

    document.body.addEventListener('keyup', e => {
        keys[e.keyCode] = false;
    });

    // INIT ANIMATION LOOP
    ////////////////////////////////////////////////////////////////////////////////
    update();
} ());
