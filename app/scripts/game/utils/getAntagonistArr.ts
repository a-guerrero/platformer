import { Antagonist } from '../Antagonist';

export function getAntagonistArr(ctx: CanvasRenderingContext2D, width: number, height: number) {

    let antagonitsArr: Antagonist[] = [];

    let p1Antagonist = new Antagonist(ctx);
    p1Antagonist.x = 200;
    p1Antagonist.y = 224;
    p1Antagonist.lastMove = 'left';
    p1Antagonist.canMove = true;
    p1Antagonist.fillStyle = '#ff4a4a';
    antagonitsArr.push(p1Antagonist);

    let p2AntagonistA = new Antagonist(ctx);
    p2AntagonistA.x = 608;
    p2AntagonistA.y = 96;
    p2AntagonistA.lastMove = 'right';
    p2AntagonistA.canMove = true;
    p2AntagonistA.fillStyle = '#ff4a4a';
    antagonitsArr.push(p2AntagonistA);

    let p2AntagonistB = new Antagonist(ctx);
    p2AntagonistB.x = 808;
    p2AntagonistB.y = 96;
    p2AntagonistB.lastMove = 'left';
    p2AntagonistB.canMove = true;
    p2AntagonistB.fillStyle = '#e05353';
    antagonitsArr.push(p2AntagonistB);

    let p2AntagonistC = new Antagonist(ctx);
    p2AntagonistC.x = 864;
    p2AntagonistC.y = 224;
    p2AntagonistC.lastMove = 'left';
    p2AntagonistC.canMove = true;
    p2AntagonistC.canShoot = true;
    antagonitsArr.push(p2AntagonistC);

    let p4AntagonistC = new Antagonist(ctx);
    p4AntagonistC.x = 1536;
    p4AntagonistC.y = 224;
    p4AntagonistC.lastMove = 'left';
    p4AntagonistC.canMove = true;
    p4AntagonistC.canShoot = true;
    p4AntagonistC.canJump = true;
    p4AntagonistC.fillStyle = '#44c782';
    antagonitsArr.push(p4AntagonistC);

    return antagonitsArr;
}
