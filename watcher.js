#!/usr/bin/env node

const options = {

}


{
	locations: [

	  './node_modules/'

	],

	ignore: [ // regexp
		/_unused/,
		/\.git/
	],

	delay: 400, // Delay the execution of the commands on change in ms
	verbosity: 'normal', // Possible values are: minimal, normal, verbose
	onStart: onStart,
	onChange: onChange,
	onEnd: onEnd
}
