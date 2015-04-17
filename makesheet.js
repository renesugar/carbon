var fs = require('fs'),
    PNG = require('node-png').PNG;

var length = process.argv[2] * 1,
    outs = process.argv[3];

var components = process.argv.slice(4);
var loadedImages = [];

components.forEach(function(image) {
  fs.createReadStream('sprites/'+image+'.png')
      .pipe(new PNG({
          filterType: 4
      }))
      .on('parsed', function() {
        loadedImages.push(this);

        if(loadedImages.length == components.length) {
          generateSheet();
        }
      });
})

function generateSheet() {
  var row = Math.ceil(Math.sqrt(components.length));
  var dimension = length * row;

  var out = new PNG({
    filterType: -1,
    width: dimension,
    height: dimension
  });

  loadedImages.forEach(function(img, index) {
    img.bitblt(out,
        0, 0, length, length,
        length * (index % row), 64 * Math.floor(index / row));
  });

  out.pack().pipe(fs.createWriteStream(outs));
}
