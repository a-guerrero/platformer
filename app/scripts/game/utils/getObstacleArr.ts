import { Obstacle } from '../Obstacle';

function getBlock(ctx: CanvasRenderingContext2D, width = 1, height = 1): Obstacle {

    let block = new Obstacle(ctx);
    block.width = 32 * width;
    block.height = 32 * height;
    return block;
}

function getInvisibleBlock(ctx: CanvasRenderingContext2D, width = 1, height = 1): Obstacle {

    let block = getBlock(ctx, width, height);
    block.isInvisible = true;

    return block;
}

function getLava(ctx: CanvasRenderingContext2D, width = 1, height = 1): Obstacle {

    let block = new Obstacle(ctx);
    block.canKill = true;
    block.width = 32 * width;
    block.height = 16 * height;
    block.fillStyle = '#ff4a4a';
    return block;
}

export function getObstacleArr(ctx: CanvasRenderingContext2D, width, height): Obstacle[] {

    let obstacleArr: Obstacle[] = [];
    let lavaFillStyle = '#ff4a4a';

    // LIMITS
    ////////////////////////////////////////////////////////////////////////////
    let rightLimit = new Obstacle(ctx);
    rightLimit.width = 20;
    rightLimit.height = height;
    rightLimit.x = width;
    rightLimit.y = 0;
    obstacleArr.push(rightLimit);

    let leftLimit = new Obstacle(ctx);
    leftLimit.width = 20;
    leftLimit.height = height;
    leftLimit.x = 0 - 20;
    leftLimit.y = 0;
    obstacleArr.push(leftLimit);

    // PART 1
    ////////////////////////////////////////////////////////////////////////////
    let p1Floor = getBlock(ctx, 7);
    p1Floor.x = 0;
    p1Floor.y = height - p1Floor.height;
    obstacleArr.push(p1Floor);

    let p1FloorRightLimit = getInvisibleBlock(ctx, 1, 1);
    p1FloorRightLimit.x = p1Floor.x + p1Floor.width;
    p1FloorRightLimit.y = p1Floor.y - p1FloorRightLimit.height;
    obstacleArr.push(p1FloorRightLimit);

    let p1Lava = getLava(ctx, 11, 1);
    p1Lava.x = p1Floor.x + p1Floor.width;
    p1Lava.y = height - p1Lava.height;
    obstacleArr.push(p1Lava);

    let p1StepsCount = 0;
    while (p1StepsCount < 5) {
        let p1Step = getBlock(ctx);
        p1Step.y = height;
        p1Step.y -= p1StepsCount % 2 ? p1Step.height * 2 : p1Step.height * 3;
        p1Step.x = (p1Floor.x + p1Floor.width) + p1Step.width;
        p1Step.x += (p1Step.width * 2) * p1StepsCount;
        obstacleArr.push(p1Step);
        ++p1StepsCount;
    }

    // PART 2
    ////////////////////////////////////////////////////////////////////////////
    let p2LeftLimit = getBlock(ctx, 1, 2);
    p2LeftLimit.x = p1Lava.x + p1Lava.width;
    p2LeftLimit.y = height - p2LeftLimit.height;
    obstacleArr.push(p2LeftLimit);

    let p2Floor = getBlock(ctx, 9);
    p2Floor.x = p2LeftLimit.x + p2LeftLimit.width;
    p2Floor.y = height - p2Floor.height;
    obstacleArr.push(p2Floor);

    let p2RightLimit = getBlock(ctx, 1, 3);
    p2RightLimit.x = p2Floor.x + p2Floor.width;
    p2RightLimit.y = height - p2RightLimit.height;
    obstacleArr.push(p2RightLimit);

    let p2FloatBlock = getBlock(ctx, 7);
    p2FloatBlock.x = p2LeftLimit.x + p2LeftLimit.width;
    p2FloatBlock.y = height - (p2FloatBlock.height * 5);
    obstacleArr.push(p2FloatBlock);

    let p2FloatBlockLeftLimit = getInvisibleBlock(ctx, 1);
    p2FloatBlockLeftLimit.x = p2FloatBlock.x - p2FloatBlockLeftLimit.height;
    p2FloatBlockLeftLimit.y = p2FloatBlock.y - p2FloatBlockLeftLimit.width;
    obstacleArr.push(p2FloatBlockLeftLimit);

    let p2FloatBlockRightLimit = getInvisibleBlock(ctx, 1);
    p2FloatBlockRightLimit.x = p2FloatBlock.x + p2FloatBlock.width;
    p2FloatBlockRightLimit.y = p2FloatBlock.y - p2FloatBlockRightLimit.width;
    obstacleArr.push(p2FloatBlockRightLimit);

    // PART 3
    ////////////////////////////////////////////////////////////////////////////
    let p3Floor = getLava(ctx, 8);
    p3Floor.x = p2RightLimit.x + p2RightLimit.width;
    p3Floor.y = height + (p3Floor.height * 2);
    obstacleArr.push(p3Floor);

    let p3StepLeft = getBlock(ctx);
    p3StepLeft.x = p3Floor.x + (p3StepLeft.width * 2);
    p3StepLeft.y = height - (p3StepLeft.height * 2);
    obstacleArr.push(p3StepLeft);

    let p3StepRight = getBlock(ctx);
    p3StepRight.x = p3Floor.x + (p3StepLeft.width * 5);
    p3StepRight.y = p3StepLeft.y;
    obstacleArr.push(p3StepRight);

    // PART 4
    ////////////////////////////////////////////////////////////////////////////
    let p4LeftLimit = getBlock(ctx, 1, 3);
    p4LeftLimit.x = p3Floor.x + p3Floor.width;
    p4LeftLimit.y = height - p4LeftLimit.height;
    obstacleArr.push(p4LeftLimit);

    let p4Floor = getBlock(ctx, 10);
    p4Floor.x = p4LeftLimit.x + p4LeftLimit.width;
    p4Floor.y = height - p4Floor.height;
    obstacleArr.push(p4Floor);

    let p4FloorRightLimit = getInvisibleBlock(ctx);
    p4FloorRightLimit.x = p4Floor.x + p4Floor.width;
    p4FloorRightLimit.y = height - (p4FloorRightLimit.height * 2);
    obstacleArr.push(p4FloorRightLimit);

    let p4Lava = getLava(ctx, 9);
    p4Lava.x = p4FloorRightLimit.x;
    p4Lava.y = height - p4Lava.height;
    obstacleArr.push(p4Lava);

    let p4Step = getBlock(ctx);
    p4Step.x = p4FloorRightLimit.x + (p4Step.width * 4);
    p4Step.y = height - p4Step.height;
    obstacleArr.push(p4Step);

    // PART 5
    ////////////////////////////////////////////////////////////////////////////
    let p5StepCount = 0;
    while (p5StepCount < 7) { 
        let p5StepHeight = p5StepCount < 5 ? p5StepCount + 1 : 5;
        let p5Step = getBlock(ctx, 1, p5StepHeight);
        p5Step.x = (p4Lava.x + p4Lava.width) + (p5Step.width * p5StepCount);
        p5Step.y = height - p5Step.height;
        obstacleArr.push(p5Step);
        ++p5StepCount;
    }

    return obstacleArr;
}