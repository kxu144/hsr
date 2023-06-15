const fs = require('fs');
const path = require('path');

const directoryPath = 'data/characters'; // Replace with your directory path

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    console.log('Error reading directory:', err);
    return;
  }

  files.forEach(function (file) {
    if (path.extname(file) === '.json') {
      const filePath = path.join(directoryPath, file);
      const fileData = fs.readFileSync(filePath, 'utf-8');

      let jsonData = {};

      try {
        const jsonObject = JSON.parse(fileData);

        const fields = ["name", "spRequirement", "rarity", "artPath", "damageType", "baseType", "levelData"]
        for (let field of fields) {
          jsonData[field] = jsonObject[field];
        }

        fs.writeFile("lib/char/json/" + jsonObject.pageId + ".json", JSON.stringify(jsonData, null, 2), (err) => {
          if (err) {
            console.error("ERROR", err);
            return;
          }
        })
      } catch (error) {
        console.log('Error parsing JSON file:', file, error);
      }
    }
  });
});
