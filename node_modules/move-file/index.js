'use strict';
const path = require('path');
const fs = require('fs');
const pathExists = require('path-exists');

const fsP = fs.promises;

module.exports = async (source, destination, options) => {
	if (!source || !destination) {
		throw new TypeError('`source` and `destination` file required');
	}

	options = {
		overwrite: true,
		...options
	};

	if (!options.overwrite && await pathExists(destination)) {
		throw new Error(`The destination file exists: ${destination}`);
	}

	await fsP.mkdir(path.dirname(destination), {recursive: true});

	try {
		await fsP.rename(source, destination);
	} catch (error) {
		if (error.code === 'EXDEV') {
			await fsP.copyFile(source, destination);
			await fsP.unlink(source);
		} else {
			throw error;
		}
	}
};

module.exports.sync = (source, destination, options) => {
	if (!source || !destination) {
		throw new TypeError('`source` and `destination` file required');
	}

	options = {
		overwrite: true,
		...options
	};

	if (!options.overwrite && fs.existsSync(destination)) {
		throw new Error(`The destination file exists: ${destination}`);
	}

	fs.mkdirSync(path.dirname(destination), {recursive: true});

	try {
		fs.renameSync(source, destination);
	} catch (error) {
		if (error.code === 'EXDEV') {
			fs.copyFileSync(source, destination);
			fs.unlinkSync(source);
		} else {
			throw error;
		}
	}
};
