import { UntypedWhether } from './whether.js';

type Whether = (<T = any>(o: unknown) => o is T) & UntypedWhether;

/**
 * Expect the target to be truthy.
 * @param target
 */
export const whether: Whether = new UntypedWhether() as Whether;
