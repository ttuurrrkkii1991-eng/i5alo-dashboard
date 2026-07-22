const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const files = walkSync('src/app');

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace arrow functions
    content = content.replace(/const (\w+) = \(\{\s*([a-zA-Z0-9_,\s]+)\s*\}\)\s*=>/g, "const $1 = ({$2}: any) =>");
    
    // Replace function declarations
    content = content.replace(/function (\w+)\(\{\s*([a-zA-Z0-9_,\s]+)\s*\}\)\s*\{/g, "function $1({$2}: any) {");

    // Replace color map inline functions
    content = content.replace(/\(color, i\) =>/g, "(color: any, i: number) =>");

    fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Fixed implicit any types');
