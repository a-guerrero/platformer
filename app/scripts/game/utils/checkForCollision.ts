import { Rect } from '../../utils/canvas/Rect';

export interface Collision {
    side: 'top' | 'right' | 'bottom' | 'left';
    depth: number;
}

/**
 * Checks for collision between rects
 * @see { @link http://bit.ly/2iR5hvL }
 * @see { @link http://bit.ly/2ijiL26 }
 * @see { @link https://mzl.la/2iyMrWV }
 */
export function checkForCollision(rectA: Rect, rectB: Rect, deep = false): boolean | Collision {

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