#!/usr/bin/env node
var msg = process.argv.length > 2 ? process.argv[2] : 'y';

while(1){
  if(!process.stdout.write(msg + '\r\n')){
    process.exit(0);
  }
}

