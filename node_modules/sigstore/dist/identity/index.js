"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const issuer_1 = require("./issuer");
const oauth_1 = require("./oauth");
/**
 * oauthProvider returns a new Provider instance which attempts to retrieve
 * an identity token from the configured OAuth2 issuer.
 *
 * @param issuer Base URL of the issuer
 * @param clientID Client ID for the issuer
 * @param clientSecret Client secret for the issuer (optional)
 * @returns {IdentityProvider}
 */
function oauthProvider(options) {
    return new oauth_1.OAuthProvider({
        issuer: new issuer_1.Issuer(options.issuer),
        clientID: options.clientID,
        clientSecret: options.clientSecret,
        redirectURL: options.redirectURL,
    });
}
exports.default = {
    oauthProvider,
};
