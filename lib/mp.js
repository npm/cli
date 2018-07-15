'use strict'

const FILE_REGEX = /\.[0-9a-z]+$/i;

const mp = (args, cb) => {

	if(args.length === 0) {
		
		checkFile(displayPackages);
	
	} else if((args.includes('i') && (args.includes('c') || args.includes('check'))) || (args.includes('install') && (args.includes('c') || args.includes('check')))) {
		
		// display usage

	} else if (args.includes('i') || args.includes('install')) {

		let recursive = (args.includes('r') || args.includes('recursive')) ? true : false;
		checkDirectory(process.cwd() + "/" + file, recursive, installPackages);

	} else if (args.includes('c') || args.includes('check')) {

		let recursive = (args.includes('r') || args.includes('recursive')) ? true : false;
		checkDirectory(process.cwd() + "/" + file, recursive, displayPackages);

	} else if(args.length === 1 && args[0].match(FILE_REGEX)) {

		checkFile(displayPackages, args);

	}

	// Put callback inside th shit so it doesnt fuck me synchronously
	cb();
}





// TODO: MODIFY checkFile and add getPackageJson






module.exports = mp;