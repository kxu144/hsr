const fs = require('fs');
const path = require('path');

const directoryFrom = './data/characters';
const directoryTo = '../hsr-react/public/json/characters';

fs.readdir(directoryFrom, function (err, files) {
  if (err) {
    console.log('Error reading directory:', err);
    return;
  }

  files.forEach(function (file) {
    if (path.extname(file) === '.json') {
      const filePath = path.join(directoryFrom, file);
      const fileData = fs.readFileSync(filePath, 'utf-8');

      let jsonData = {};

      try {
        const jsonObject = JSON.parse(fileData);
        fs.readFile(path.join(directoryTo, file), 'utf8', (error, data) => {
            if (error) {
                console.log("ERROR", error, file);
                return;
            }
            var jsonTo = JSON.parse(data);
            jsonTo["talents"] = {};
            for (let skill of jsonObject["skills"]) {
                jsonTo["talents"][skill.typeDescHash] = {
                    "name": skill["name"],
                    "desc": skill["descHash"],
                    "levelData": skill["levelData"]
                }
            }
            fs.writeFile(path.join(directoryTo, file), JSON.stringify(jsonTo, null, 2), (err) => {
                if (err) {
                    console.error("ERROR", err, file);
                    return;
                }
            });
        });

        // const fields = ["name", "spRequirement", "rarity", "artPath", "damageType", "baseType", "levelData"]
        // for (let field of fields) {
        //   jsonData[field] = jsonObject[field];
        // }

        // fs.writeFile("lib/char/json/" + jsonObject.pageId + ".json", JSON.stringify(jsonData, null, 2), (err) => {
        //   if (err) {
        //     console.error("ERROR", err);
        //     return;
        //   }
        // })
      } catch (error) {
        console.log('Error parsing JSON file:', file, error);
      }
    }
  });
});
