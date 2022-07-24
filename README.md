# WotlkTalentTreeCalculator

See example TalentTreeCalculator here: https://matt-hall.com/wotlk/talent-tree-calculator/

See example TalentTreeDataParser here: https://matt-hall.com/wotlk/talent-tree-calculator/TalentTreeDataParser.html

TalentData Spreadsheet here: https://docs.google.com/spreadsheets/d/1OGItB5b16FCRWYVKxPFvBu-RODsIrmC_xuZRTvjaXv4/edit?usp=sharing

## Initialising the TalentTreeCalculator

- Include the TalentTreeCalculator.js and recommended TalentTreeCalculator.css files
- Either fetch your TalentData.json or hard code it into your site
- Create an element that the TalentTreeCalculator can initialise into
- Initialise the TalentTreeCalculator using your new element, the json data of your talents, and the baseUrl of your image folder

Example:
```
var talentTreeCalculator = new TalentTreeCalculator(document.getElementById('test'), jsonData, ".//Images//");
talentTreeCalculator.buildSpec(0, "deathknight", "blood");
talentTreeCalculator.buildSpec(1, "deathknight", "frost");
talentTreeCalculator.buildSpec(2, "deathknight", "unholy");
```

## Generating new json data

- View/Edit the TalentData Spreadsheet here: https://docs.google.com/spreadsheets/d/1OGItB5b16FCRWYVKxPFvBu-RODsIrmC_xuZRTvjaXv4/edit?usp=sharing
- Download as CSV
- Open and paste contents of CSV into TalentTreeDataParser here: https://matt-hall.com/wotlk/talent-tree-calculator/TalentTreeDataParser.html
- Select CSV To JSON
- Update your JSON with the new file

## TODO

- Switch Calc by class
- Export / Import talent trees as a url parameter
- Talent Point History so you can show the order you spend talent points for tutorial
- Save / Load your custom named talent builds (localstorage at first, maybe db later)
