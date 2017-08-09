#!/usr/bin/env node

const subtitleParse = require('subtitles-parser');
const fs = require('fs');

const srcFileName = process.argv[2];
const destFileName = process.argv[3];

function removeBetweenTwoChars(str, char1, char2) {
    var cpos = str.indexOf(char1),
        spos = str.indexOf(char2);
    if (cpos > -1 && spos > cpos) {
      var strippedString = str.substr(0, cpos-1)+str.substr(spos+1);
        return removeBetweenTwoChars(
          strippedString,
          char1,
          char2
        );
    }
    return str;
}

if (process.argv.length === 4 && srcFileName && destFileName) {
  try {
    let contents = fs.readFileSync(srcFileName).toString();
    if (contents) {
      let data = subtitleParse.fromSrt(contents);
      let newData = [];
      data.forEach((title, index) => {
        if (title.text.indexOf('♪') === -1) {
          if (title.text.indexOf('[') === -1) {
              newData.push(title);
            } else {
              title.text = removeBetweenTwoChars(title.text, '[', ']');
              if (title.text) {
                newData.push(title);
              }
            }
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
      console.error('Something happened.', error);
    }
  }
} else {
    console.error('Use: `npm run remove source.srt destination.srt `')
}
