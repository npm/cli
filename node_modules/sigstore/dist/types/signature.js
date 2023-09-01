"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallbackSigner = void 0;
const error_1 = require("../error");
// Adapter to allow the legacy SignerFunc callback to be used as a new Signer
// interface.
class CallbackSigner {
    constructor(options) {
        this.signer = options.signer;
    }
    async sign(data) {
        const sigMaterial = await this.signer(data);
        // Since we're getting data from an external source, we need to validate
        // that it's well-formed and complete.
        if (!sigMaterial.signature) {
            throw new error_1.SignatureError({
                code: 'MISSING_SIGNATURE_ERROR',
                message: 'no signature returned from signer',
            });
        }
        if (!sigMaterial.key?.value) {
            throw new error_1.SignatureError({
                code: 'MISSING_PUBLIC_KEY_ERROR',
                message: 'no key returned from signer',
            });
        }
        return {
            signature: sigMaterial.signature,
            key: {
                $case: 'publicKey',
                hint: sigMaterial.key.id,
                publicKey: sigMaterial.key.value,
            },
        };
    }
}
exports.CallbackSigner = CallbackSigner;
