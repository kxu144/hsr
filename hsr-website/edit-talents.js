const fs = require('fs');
const path = require('path');

const TALENTS = ["Basic ATK", "Skill", "Ultimate", "Talent", "Technique"]

const directoryTo = '../hsr-react/public/json/characters';
const name = "yanqing.json";
const talent = TALENTS[2];
const scaling = "atk";
const whichParam = 2;
// common misc fields: stat (which stat are you buffing?), condition (what needed to activate buff), followUp (set to true, for follow-up attacks)
// effects (list of possible effects like frozen so it has a "duration" field and "condition")

fs.readFile(path.join(directoryTo, name), "utf8", function (err, fileData) {
  if (err) {
    console.log('Error reading directory:', err);
    return;
  }

  var jsonObject = JSON.parse(fileData);
  if (!jsonObject["dmg"]) {
    jsonObject["dmg"] = {};
  }
  if (!jsonObject["dmg"][talent]) {
    jsonObject["dmg"][talent] = [];
  }
  const temp = jsonObject["dmg"][talent];

  var obj = {stat: scaling, multipliers: ["LEVELDATA"]};
  for (let level of jsonObject["talents"][talent]["levelData"]) {
    obj.multipliers.push(level["params"][whichParam]);
  }
  
  temp.push(obj);
  fs.writeFile(path.join(directoryTo, name), JSON.stringify(jsonObject, null, 2), (err) => {
    if (err) {
        console.error("ERROR", err, file);
        return;
    }
  });
});
