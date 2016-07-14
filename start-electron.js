const electron = require('electron-prebuilt');
const proc = require('child_process');
const child = proc.spawn(electron, ['.']);
	
child.stdout.on('data', (data) => {
  	console.log(`stdout: ${data}`);
});

child.stderr.on('data', (data) => {
  	console.log(`stderr: ${data}`);
});

child.on('close', (code) => {
 	// console.log(`child process exited with code ${code}`);
});
