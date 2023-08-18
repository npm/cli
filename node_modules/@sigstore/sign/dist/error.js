"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = void 0;
class InternalError extends Error {
    constructor({ code, message, cause, }) {
        super(message);
        this.name = this.constructor.name;
        this.cause = cause;
        this.code = code;
    }
}
exports.InternalError = InternalError;
