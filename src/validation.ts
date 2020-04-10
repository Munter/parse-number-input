export namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }

    export class SimpleValidator implements StringValidator {
        isAcceptable(s: string): boolean {
            return s.length > 0;
        }

    }
}