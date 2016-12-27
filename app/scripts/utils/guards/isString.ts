/**
 * Checks is the given value is string type
 * @param {any} x - Value to check
 */
export function isString(x: any): x is string {
    return typeof x === 'string';
}
