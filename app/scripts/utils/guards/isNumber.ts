/**
 * Checks is the given value is number type
 * @param {any} x - Value to check
 */
export function isNumber(x: any): x is number {
    return typeof x === 'number';
}
