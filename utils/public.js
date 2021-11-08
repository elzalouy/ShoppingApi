const _ = require("lodash");
const fs = require("fs");
const Path = require("path");

function deletePublic() {
  let dir = __dirname.split("utils");
  const directory = Path.join(dir[0], "public");
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(Path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

module.exports = {
  deletePublic,
};
