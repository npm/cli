"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRekorEntry = exports.createDSSEEnvelope = void 0;
/*
Copyright 2022 The Sigstore Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const bundle_1 = require("@sigstore/bundle");
const sign_1 = require("@sigstore/sign");
const config_1 = require("./config");
async function createDSSEEnvelope(payload, payloadType, options) {
    const bundler = (0, config_1.createBundleBuilder)('dsseEnvelope', {
        signer: options.signer,
        tlogUpload: false,
    });
    const bundle = await bundler.create({ data: payload, type: payloadType });
    return (0, bundle_1.envelopeToJSON)(bundle.content.dsseEnvelope);
}
exports.createDSSEEnvelope = createDSSEEnvelope;
// Accepts a signed DSSE envelope and a PEM-encoded public key to be added to the
// transparency log. Returns a Sigstore bundle suitable for offline verification.
async function createRekorEntry(dsseEnvelope, publicKey, 
/* istanbul ignore next */
options = {}) {
    const envelope = (0, bundle_1.envelopeFromJSON)(dsseEnvelope);
    const bundle = (0, bundle_1.toDSSEBundle)({
        artifact: envelope.payload,
        artifactType: envelope.payloadType,
        signature: envelope.signatures[0].sig,
        keyHint: envelope.signatures[0].keyid,
    });
    const tlog = new sign_1.RekorWitness({
        rekorBaseURL: options.rekorURL || /* istanbul ignore next */ config_1.DEFAULT_REKOR_URL,
        fetchOnConflict: true,
        retry: options.retry ?? config_1.DEFAULT_RETRY,
        timeout: options.timeout ?? config_1.DEFAULT_TIMEOUT,
    });
    // Add entry to transparency log
    const vm = await tlog.testify(bundle.content, publicKey);
    // Add transparency log entries to bundle
    bundle.verificationMaterial.tlogEntries = [...vm.tlogEntries];
    return (0, bundle_1.bundleToJSON)(bundle);
}
exports.createRekorEntry = createRekorEntry;
