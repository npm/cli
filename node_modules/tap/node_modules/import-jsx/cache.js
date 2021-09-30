'use strict';
// Based on https://github.com/babel/babel-loader/blob/15df92fafd58ec53ba88efa22de7b2cee5e65fcc/src/cache.js
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const makeDir = require('make-dir');
const findCacheDir = require('find-cache-dir');
const transform = require('./transform');

let directory;

/**
 * Build the filename for the cached file
 *
 * @param  {String} source  Original contents of the file to be cached
 * @param  {Object} options Options passed to importJsx
 * @param  {String} version Version of import-jsx
 *
 * @return {String}
 */
const filename = (source, options, version) => {
	const hash = crypto.createHash('md4');
	const contents = JSON.stringify({source, options, version});
	hash.update(contents);

	return hash.digest('hex') + '.js';
};

/**
 * Handle the cache
 *
 * @params {String} directory
 * @params {Object} parameters
 */
const handleCache = (directory, parameters) => {
	const {modulePath, options, source, version} = parameters;

	if (!options.cache) {
		return transform(source, options, modulePath);
	}

	const file = path.join(directory, filename(source, options, version));

	try {
		// No errors mean that the file was previously cached
		// we just need to return it
		return fs.readFileSync(file).toString();
		// eslint-disable-next-line no-unused-vars
	} catch (error) {}

	const fallback = directory !== os.tmpdir();

	// Make sure the directory exists.
	try {
		makeDir.sync(directory);
	} catch (error) {
		if (fallback) {
			return handleCache(os.tmpdir(), parameters);
		}

		throw error;
	}

	// Otherwise just transform the file
	// return it to the user asap and write it in cache
	const result = transform(source, options, modulePath);

	try {
		fs.writeFileSync(file, result);
	} catch (error) {
		if (fallback) {
			// Fallback to tmpdir if node_modules folder not writable
			return handleCache(os.tmpdir(), parameters);
		}

		throw error;
	}

	return result;
};

/**
 * Retrieve file from cache, or create a new one for future reads
 *
 * @param  {Object}   parameters
 * @param  {String}   parameters.modulePath
 * @param  {String}   parameters.source     Original contents of the file to be cached
 * @param  {Object}   parameters.options    Options passed to importJsx
 * @param  {String}   parameters.version    Version of import-jsx
 */
module.exports = parameters => {
	if (!directory) {
		directory = findCacheDir({name: 'import-jsx'}) || os.tmpdir();
	}

	return handleCache(directory, parameters);
};
