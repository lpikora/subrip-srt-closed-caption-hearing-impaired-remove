#!/usr/bin/env node

const subtitleParse = require('subtitles-parser');
const fs = require('fs');

const srcFileName = process.argv[2];
const destFileName = process.argv[3];
if (process.argv.length === 4 && srcFileName && destFileName) {
  try {
    let contents = fs.readFileSync(srcFileName).toString();
    if (contents) {
      let data = subtitleParse.fromSrt(contents);
      let newData = [];
      data.forEach((title, index) => {
        if (title.text.indexOf('♪') === -1) {
          newData.push(title);
        }
      });
      let output = subtitleParse.toSrt(newData);
      fs.writeFileSync(destFileName, output);
    } else {
      console.error('Empty source file `'+ srcFileName +'`.');
    }
  } catch (error) {
    if (error.code == 'ENOENT') {
      console.error('Subtitle file: `' + srcFileName + '` not found.');
    } else {
      console.error('Something happened.');
    }
  }
} else {
    console.error('Use: `npm run remove source.srt destination.srt `')
}
