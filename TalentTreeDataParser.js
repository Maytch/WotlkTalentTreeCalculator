class TalentTreeDataParser {
    JSONStringToCSV(text) {
        const jsonData = JSON.parse(text);
        if (jsonData == null) throw 'Invalid JSON String format';
        console.log(jsonData);

        let csvData = [];

        csvData.push([
            "class",
            "spec",
            "row",
            "column",
            "name",
            "icon",
            "headerLeft1",
            "headerRight1",
            "headerLeft2",
            "headerRight2",
            "lockedByRow",
            "lockedByCol",
            "rank1",
            "rank2",
            "rank3",
            "rank4",
            "rank5"
        ]);

        const classKeys = Object.keys(jsonData);
        classKeys.forEach((className) => {
            const specKeys = Object.keys(jsonData[className]);
            specKeys.forEach((specName) => {
                for (let row = 0; row < Object.keys(jsonData[className][specName]).length; row++) {
                    for (let column = 0; column < Object.keys(jsonData[className][specName][row]).length; column++) {
                        var talentData = jsonData[className][specName][row][column];
                        if (talentData == null) continue;

                        var csvRow = [
                            className,
                            specName,
                            row,
                            column,
                            talentData.name,
                            talentData.icon,
                            talentData.headers[0] != undefined ? talentData.headers[0].left : null,
                            talentData.headers[0] != undefined ? talentData.headers[0].right : null,
                            talentData.headers[1] != undefined ? talentData.headers[1].left : null,
                            talentData.headers[1] != undefined ? talentData.headers[1].right : null,
                            talentData.lockRules[0] != undefined ? talentData.lockRules[0].row : null,
                            talentData.lockRules[0] != undefined ? talentData.lockRules[0].column : null,
                            talentData.ranks[0] != undefined ? talentData.ranks[0].text : null,
                            talentData.ranks[1] != undefined ? talentData.ranks[1].text : null,
                            talentData.ranks[2] != undefined ? talentData.ranks[2].text : null,
                            talentData.ranks[3] != undefined ? talentData.ranks[3].text : null,
                            talentData.ranks[4] != undefined ? talentData.ranks[4].text : null
                        ];

                        csvData.push(csvRow);
                    }
                }
            });
        });
        
        var csvString = csvData.map(row => { 
            return row.map(item => { 
                return item !== null ? '"' + item + '"' : null;
            }).join(",");
        }).join("\n");

        return csvString;
    }

    CSVStringToJSON(text) {
        let isInQuote = false;
        let string = '';
        for (let character of text) {
            if (character === '"' && !isInQuote) {
                isInQuote = true;
            } else if (character === '"' && isInQuote) {
                isInQuote = false;
            } else if (character === ',' && !isInQuote) {
                character = '|';
            }

            if (character !== '"') string += character;
        }

        let lines = string.split("\n");
        const headers = lines[0];

        const classIndex = 0,
            specIndex = 1,
            rowIndex = 2,
            columnIndex = 3,
            nameIndex = 4,
            iconIndex = 5,
            headerLeft1Index = 6,
            headerRight1Index = 7,
            headerLeft2Index = 8,
            headerRight2Index = 9,
            lockedbyRowIndex = 10,
            lockedByColumnIndex = 11,
            rank1Index = 12,
            rank2Index = 13,
            rank3Index = 14,
            rank4Index = 15,
            rank5Index = 16;

        let jsonData = {};
        for (let i = 1; i < lines.length; i++) {
            var line = lines[i].split('|');

            const className = line[classIndex],
                specName = line[specIndex],
                row = line[rowIndex],
                column = line[columnIndex],
                name = line[nameIndex],
                icon = line[iconIndex],
                headerLeft1 = line[headerLeft1Index],
                headerRight1 = line[headerRight1Index],
                headerLeft2 = line[headerLeft2Index],
                headerRight2 = line[headerRight2Index],
                lockedByRow = line[lockedbyRowIndex],
                lockedByColumn = line[lockedByColumnIndex],
                rank1 = line[rank1Index],
                rank2 = line[rank2Index],
                rank3 = line[rank3Index],
                rank4 = line[rank4Index],
                rank5 = line[rank5Index];

            if (jsonData[className] == undefined) jsonData[className] = {};
            if (jsonData[className][specName] == undefined) jsonData[className][specName] = [];
            if (jsonData[className][specName][row] == undefined) jsonData[className][specName][row] = [null, null, null, null];

            let lockRules = [];
            if (lockedByRow.length > 0) {
                lockRules.push({
                    "row": parseInt(lockedByRow),
                    "column": parseInt(lockedByColumn)
                });
            }

            let headers = [];
            if (headerLeft1.length > 0 || headerRight1.length > 0) {
                headers.push({
                    "left": headerLeft1.length ? headerLeft1 : null,
                    "right": headerRight1.length ? headerRight1 : null
                });
            }
            if (headerLeft2.length > 0 || headerRight2.length > 0) {
                headers.push({
                    "left": headerLeft2.length ? headerLeft2 : null,
                    "right": headerRight2.length ? headerRight2 : null
                });
            }

            let ranks = [];
            if (rank1.length > 0) ranks.push({ "text": rank1 });
            if (rank2.length > 0) ranks.push({ "text": rank2 });
            if (rank3.length > 0) ranks.push({ "text": rank3 });
            if (rank4.length > 0) ranks.push({ "text": rank4 });
            if (rank5.length > 0) ranks.push({ "text": rank5 });

            jsonData[className][specName][row][column] = {
                "name": name,
                "icon": icon,
                "lockRules": lockRules,
                "headers": headers,
                "ranks": ranks
            };
        }

        var jsonString = JSON.stringify(jsonData);
        return jsonString;
    }
}