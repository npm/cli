# ink-spinner [![Build Status](https://travis-ci.org/vadimdemedes/ink-spinner.svg?branch=master)](https://travis-ci.org/vadimdemedes/ink-spinner)

> Spinner component for [Ink](https://github.com/vadimdemedes/ink). Uses [cli-spinners](https://github.com/sindresorhus/cli-spinners) for the collection of spinners.


## Install

```
$ npm install ink-spinner
```


## Usage

```js
import React from 'react';
import {render, Color} from 'ink';
import Spinner from 'ink-spinner';

render((
	<Color green>
		<Spinner green/>{' '}Loading
	</Color>
));
```

<img src="media/demo.gif" width="482">


## Props

### type

Type: `string`<br>
Defaults: `dots`

Type of a spinner. See [cli-spinners](https://github.com/sindresorhus/cli-spinners) for available spinners.


## License

MIT © [Vadim Demedes](https://github.com/vadimdemedes)
