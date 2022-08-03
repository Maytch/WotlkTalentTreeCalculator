# WotlkTalentTreeCalculator

See example TalentTreeCalculator here: https://matt-hall.com/wotlk/talent-tree-calculator/


## Initialising the TalentTreeCalculator

- Include the TalentTreeCalculator.js and recommended TalentTreeCalculator.css files
- Create an element that the TalentTreeCalculator can initialise into
- Include your classData, talentData, and glyphsData variables
- Define your imageParams to points to your image folders
- Initialise the TalentTreeCalculator using the above parameters

Example:
```
var imageParams = {
    icon: "./Images/icons/",
    iconFormat: "jpg",
    background: "./Images/backgrounds/",
    backgroundFormat: "jpg"
};

var talentTreeCalculator = new TalentTreeCalculator(
    document.getElementById('talent-tree-calculator'),
    classData,
    talentData,
    glyphsData,
    imageParams
);

talentTreeCalculator.buildClass("deathknight");
```


### Import Talent Build

Using either a url or just the parameters themselves, run the import after initialisation like this:

```
talentTreeCalculator.importFromUrl(window.location.href);
```


### Lock Talent Build

If you want to use the talent tree in a guide, you can lock the talent calculator after setting it up like this:

```
talentTreeCalculator.setLock(true);
```

You can also toggle it on and off using this method.


## Initialising the TalentTreeHeader

- Include the TalentTreeHeader.js and recommended TalentTreeHeader.css files
- Create an element that the TalentTreeHeader can initialise into
- Initialise the TalentTreeHistory using your new element and the talentTreeCalculator
- Subscribe to the user point history and user class update events in the talentTreeCalculator so that it updates when the talent tree does

Example:
```
var talentTreeHeader = new TalentTreeHeader(document.getElementById('header'), talentTreeCalculator);
talentTreeCalculator.subscribeToUserPointHistoryUpdateEvent(talentTreeHeader, talentTreeHeader.updateUserPoints);
talentTreeCalculator.subscribeToUserClassUpdateEvent(talentTreeHeader, talentTreeHeader.updateUserClass);
```


## Initialising the TalentTreeClassSelector

- Include the TalentTreeClassSelector.js and recommended TalentTreeClassSelector.css files
- Create an element that the TalentTreeClassSelector can initialise into
- Initialise the TalentTreeClassSelector using your new element and the talentTreeCalculator

Example:
```
var talentTreeClassSelector = new TalentTreeClassSelector(document.getElementById('selector'), talentTreeCalculator);
```


## Initialising the TalentTreeHistory

- Include the TalentTreeHistory.js and recommended TalentTreeHistory.css files
- Create an element that the TalentTreeHistory can initialise into
- Initialise the TalentTreeHistory using your new element, the talentTreeCalculator
- Subscribe to the user point history event in the talentTreeCalculator so that it updates when the talent tree does

Example:
```
var talentTreeHistory = new TalentTreeHistory(document.getElementById('history'), talentTreeCalculator);
talentTreeCalculator.subscribeToUserPointHistoryUpdateEvent(talentTreeHistory, talentTreeHistory.updateUserPointHistory);
```


## Generating new talent json data

- View/Edit the TalentData Spreadsheet here: https://docs.google.com/spreadsheets/d/1OGItB5b16FCRWYVKxPFvBu-RODsIrmC_xuZRTvjaXv4/edit?usp=sharing
- Download as CSV
- Open and paste contents of CSV into TalentTreeDataParser here: https://matt-hall.com/wotlk/talent-tree-calculator/TalentTreeDataParser.html
- Select CSV To JSON
- Update your JSON with the new file


## TODO

- Save / Load your custom named talent builds (localstorage at first, maybe db later)
