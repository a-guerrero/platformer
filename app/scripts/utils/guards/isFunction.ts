/**
 * Checks is the given value is function type
 * @param {any} x - Value to check
 */
export function isFunction(x: any): x is (...args: any) => void {
    return typeof x === 'function';
}
