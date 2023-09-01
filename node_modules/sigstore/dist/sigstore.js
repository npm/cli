"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_REKOR_URL = exports.DEFAULT_FULCIO_URL = exports.tuf = exports.utils = exports.VerificationError = exports.PolicyError = exports.InternalError = exports.ValidationError = exports.createVerifier = exports.verify = exports.attest = exports.sign = void 0;
/*
Copyright 2023 The Sigstore Authors.

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
const tuf = __importStar(require("@sigstore/tuf"));
const config = __importStar(require("./config"));
const verify_1 = require("./verify");
async function sign(payload, options = {}) {
    const bundler = config.createBundleBuilder('messageSignature', options);
    const bundle = await bundler.create({ data: payload });
    return (0, bundle_1.bundleToJSON)(bundle);
}
exports.sign = sign;
async function attest(payload, payloadType, options = {}) {
    const bundler = config.createBundleBuilder('dsseEnvelope', options);
    const bundle = await bundler.create({ data: payload, type: payloadType });
    return (0, bundle_1.bundleToJSON)(bundle);
}
exports.attest = attest;
async function verify(bundle, payload, options = {}) {
    const trustedRoot = await tuf.getTrustedRoot({
        mirrorURL: options.tufMirrorURL,
        rootPath: options.tufRootPath,
        cachePath: options.tufCachePath,
        retry: options.retry ?? config.DEFAULT_RETRY,
        timeout: options.timeout ?? config.DEFAULT_TIMEOUT,
    });
    const verifier = new verify_1.Verifier(trustedRoot, options.keySelector);
    const deserializedBundle = (0, bundle_1.bundleFromJSON)(bundle);
    const opts = config.artifactVerificationOptions(options);
    return verifier.verify(deserializedBundle, opts, payload);
}
exports.verify = verify;
async function createVerifier(options) {
    const trustedRoot = await tuf.getTrustedRoot({
        mirrorURL: options.tufMirrorURL,
        rootPath: options.tufRootPath,
        cachePath: options.tufCachePath,
        retry: options.retry ?? config.DEFAULT_RETRY,
        timeout: options.timeout ?? config.DEFAULT_TIMEOUT,
    });
    const verifier = new verify_1.Verifier(trustedRoot, options.keySelector);
    const verifyOpts = config.artifactVerificationOptions(options);
    return {
        verify: (bundle) => {
            const deserializedBundle = (0, bundle_1.bundleFromJSON)(bundle);
            return verifier.verify(deserializedBundle, verifyOpts);
        },
    };
}
exports.createVerifier = createVerifier;
const tufUtils = {
    client: (options = {}) => {
        return tuf.initTUF({
            mirrorURL: options.tufMirrorURL,
            rootPath: options.tufRootPath,
            cachePath: options.tufCachePath,
            retry: options.retry,
            timeout: options.timeout,
        });
    },
    /*
     * @deprecated Use tufUtils.client instead.
     */
    getTarget: (path, options = {}) => {
        return tuf
            .initTUF({
            mirrorURL: options.tufMirrorURL,
            rootPath: options.tufRootPath,
            cachePath: options.tufCachePath,
            retry: options.retry,
            timeout: options.timeout,
        })
            .then((t) => t.getTarget(path));
    },
};
exports.tuf = tufUtils;
var bundle_2 = require("@sigstore/bundle");
Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function () { return bundle_2.ValidationError; } });
var error_1 = require("./error");
Object.defineProperty(exports, "InternalError", { enumerable: true, get: function () { return error_1.InternalError; } });
Object.defineProperty(exports, "PolicyError", { enumerable: true, get: function () { return error_1.PolicyError; } });
Object.defineProperty(exports, "VerificationError", { enumerable: true, get: function () { return error_1.VerificationError; } });
exports.utils = __importStar(require("./sigstore-utils"));
exports.DEFAULT_FULCIO_URL = config.DEFAULT_FULCIO_URL;
exports.DEFAULT_REKOR_URL = config.DEFAULT_REKOR_URL;
