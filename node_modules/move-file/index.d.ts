declare namespace moveFile {
	interface Options {
		/**
		Overwrite existing destination file.

		@default true
		*/
		readonly overwrite?: boolean;
	}
}

declare const moveFile: {
	/**
	Move a file.

	@param source - File you want to move.
	@param destination - Where you want the file moved.
	@returns A `Promise` that resolves when the file has been moved.

	@example
	```
	import moveFile = require('move-file');

	(async () => {
		await moveFile('source/unicorn.png', 'destination/unicorn.png');
		console.log('The file has been moved');
	})();
	```
	*/
	(source: string, destination: string, options?: moveFile.Options): Promise<void>;

	/**
	Move a file synchronously.

	@param source - File you want to move.
	@param destination - Where you want the file moved.
	*/
	sync(source: string, destination: string, options?: moveFile.Options): void;
};

export = moveFile;
