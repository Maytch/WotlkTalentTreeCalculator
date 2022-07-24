class TalentTreeCalculator {
    id;
    element;
    tooltipId;
    tooltip;
    baseUrl = './/Images//';
    userSpentPoints = {};
    userPointHistory = [];
    maxUserSpentPoints = 71;
    classTypes;

    userPointHistoryUpdateEventSubscribers = [];

    constructor(target, classTypes, baseUrl) {
        if (!target) throw 'Could not construct TalentTreeCalculator: Element not found';
        this.classTypes = classTypes;
        this.initTalentTree(target);
        this.initTooltip();
        if (baseUrl != undefined) this.baseUrl = baseUrl;
    }

    initTalentTree(target) {
        var otherCount = document.getElementsByClassName("talentTreeCalculator").length;
        this.id = "talentTreeCalculator" + otherCount;

        var talentCalculator = target.appendChild(document.createElement('div'));
        talentCalculator.id = this.id;
        talentCalculator.classList.add('talentTreeCalculator');
        this.element = document.getElementById(this.id);
    }
    
    initTooltip() {
        var tooltip = this.element.appendChild(document.createElement('div'));
        tooltip.classList.add('talentTreeTooltip');
        tooltip.classList.add('hidden');

        var talentSection = tooltip.appendChild(document.createElement('div'));
        talentSection.classList.add('talentSection');

        var talentName = talentSection.appendChild(document.createElement('div'));
        talentName.classList.add('talentName');

        var talentRank = talentSection.appendChild(document.createElement('div'));
        talentRank.classList.add('talentRank');

        talentSection = tooltip.appendChild(document.createElement('div'));
        talentSection.classList.add('talentSection');

        var talentHeader = talentSection.appendChild(document.createElement('div'));
        talentHeader.classList.add('talentHeader');
        talentHeader.classList.add('talentHeaderLeft1');

        talentHeader = talentSection.appendChild(document.createElement('div'));
        talentHeader.classList.add('talentHeader');
        talentHeader.classList.add('talentHeaderRight1');

        talentSection = tooltip.appendChild(document.createElement('div'));
        talentSection.classList.add('talentSection');

        talentHeader = talentSection.appendChild(document.createElement('div'));
        talentHeader.classList.add('talentHeader');
        talentHeader.classList.add('talentHeaderLeft2');

        talentHeader = talentSection.appendChild(document.createElement('div'));
        talentHeader.classList.add('talentHeader');
        talentHeader.classList.add('talentHeaderRight2');
        
        var talentText = tooltip.appendChild(document.createElement('div'));
        talentText.classList.add('talentText');

        var talentStatus = tooltip.appendChild(document.createElement('div'));
        talentStatus.classList.add('talentStatus');

        var otherCount = document.getElementsByClassName("talentTreeTooltip").length;
        this.tooltipId = "talentTreeTooltip" + otherCount;
        tooltip.id = this.tooltipId;
        this.tooltip = document.getElementById(this.tooltipId);
    }

    buildSpec(number, className, specName) {
        var self = this;
        var specData = this.classTypes[className][specName];

        var talentTable = this.initTalentTable(number, className, specName);

        var talentTableHeader = talentTable.appendChild(document.createElement('div'));
        talentTableHeader.classList.add('talentTableHeader');
        
        var talentTableName = talentTableHeader.appendChild(document.createElement('div'));
        talentTableName.classList.add('talentTableName');
        talentTableName.innerText = specName[0].toUpperCase() + specName.slice(1);
        
        var talentTablePoints = talentTableHeader.appendChild(document.createElement('div'));
        talentTablePoints.classList.add('talentTablePoints');
        talentTablePoints.innerText = '[0]';

        var talentTableClear = talentTableHeader.appendChild(document.createElement('div'));
        talentTableClear.classList.add('talentTableClear');
        talentTableClear.innerHTML = '<svg viewBox="45.62 12.774 333.334 332.725" xmlns="http://www.w3.org/2000/svg"><rect x="193.431" y="77.859" width="38.321" height="194.039" rx="9" ry="9" style="fill: currentColor; stroke: none;" transform="matrix(0.707108, 0.707106, -0.707106, 0.707108, 185.924316, -99.10424)"/><rect x="193.431" y="77.859" width="38.321" height="194.039" rx="9" ry="9" style="fill: currentColor; stroke: none;" transform="matrix(0.707106, -0.707108, 0.707108, 0.707106, -60.479069, 202.458252)"/><ellipse style="stroke: currentColor; fill: none; stroke-width: 27px;" cx="212.287" cy="178.629" rx="149.635" ry="149.635"/></svg>';
        
        talentTableClear.addEventListener("click", function(event) {
            event.preventDefault();
            self.clearTalentTable(className, specName);
        });

        talentTable.addEventListener("contextmenu", function(event) {
            event.preventDefault();
            return false;
        });

        if (specData == null) return;

        for (var i = 0; i < specData.length; i++) {
            var row = talentTable.appendChild(document.createElement('div'));
            row.classList.add("talentRow");

            for (var j = 0; j < 4; j++) {
                var talentData = specData[i][j];

                var talentContainer = row.appendChild(document.createElement('div'));
                talentContainer.classList.add("talentContainer");

                if (talentData == null) continue;

                var talentAnchor = talentContainer.appendChild(document.createElement('div'));
                talentAnchor.classList.add("talentAnchor");
                talentAnchor.dataset.class = className;
                talentAnchor.dataset.spec = specName;
                talentAnchor.dataset.specNumber = number;
                talentAnchor.dataset.row = i;
                talentAnchor.dataset.column = j;
                talentAnchor.dataset.rank = 0;

                talentAnchor.addEventListener("mouseenter", function(event) {
                    var params = {
                        class: event.target.dataset.class,
                        spec: event.target.dataset.spec,
                        row: parseInt(event.target.dataset.row),
                        column: parseInt(event.target.dataset.column),
                        rank: parseInt(event.target.dataset.rank),
                        detailed: true
                    };
                    self.showTooltip(params);
                    self.positionTooltipToTalent(params.spec, params.row, params.column);
                });

                talentAnchor.addEventListener("mouseleave", function(event) {
                    self.hideTooltip();
                });

                talentAnchor.addEventListener("contextmenu", function(event) {
                    event.preventDefault();
                    var element = event.target.classList.contains('talentAnchor') ? event.target : event.target.closest('.talentAnchor');
                    self.subtractTalentRank(element);
                    return false;
                });

                talentAnchor.addEventListener("click", function(event) {
                    event.preventDefault();
                    var element = event.target.classList.contains('talentAnchor') ? event.target : event.target.closest('.talentAnchor');
                    self.addTalentRank(element);
                });


                var talentImg = talentAnchor.appendChild(document.createElement('div'));
                talentImg.classList.add("talentImg");
                if (talentData.lockRules.length > 0 || i > 0) talentImg.classList.add("locked");

                var imageName = talentData.icon;
                talentImg.style.backgroundImage = "url('" + this.baseUrl + "//" + imageName;

                var talentRanks = talentAnchor.appendChild(document.createElement('div'));
                talentRanks.classList.add("talentRanks");
                talentRanks.innerText = "0/" + talentData.ranks.length;

                if (talentData.lockRules.length > 0) {
                    var params = {
                        class: className,
                        spec: specName,
                        specNumber: number,
                        "row": i,
                        "column": j,
                    };
                    talentData.lockRules.forEach(function(lockRule) {
                        self.buildArrow(params, lockRule);
                    });
                }
            }
        }
    }

    buildArrow(params, lockRule) {
        var talentTable = this.element.querySelector('#' + this.id + ' .talentTable[data-spec-number="' + params.specNumber + '"]');
        if (!talentTable) return;

        var arrowContainer = talentTable.appendChild(document.createElement('div'));
        arrowContainer.classList.add('talentArrow');
        arrowContainer.classList.add('locked');
        arrowContainer.dataset.class = params.class;
        arrowContainer.dataset.spec = params.spec;
        arrowContainer.dataset.specNumber = params.specNumber;
        arrowContainer.dataset.row = params.row;
        arrowContainer.dataset.column = params.column;

        var fromTalentAnchor = this.element.querySelector('.talentAnchor[data-spec-number="' + params.specNumber + '"][data-row="' + lockRule.row + '"][data-column="' + lockRule.column + '"]');
        var toTalentAnchor = this.element.querySelector('.talentAnchor[data-spec-number="' + params.specNumber + '"][data-row="' + params.row + '"][data-column="' + params.column + '"]');
        var elementRect = this.element.getBoundingClientRect();
        var fromRect = fromTalentAnchor.getBoundingClientRect();
        var toRect = toTalentAnchor.getBoundingClientRect();

        var arrowSegment;
        var arrowEnd;
        var left;
        var top;
        var height;
        var width;

        // Has a corner
        if (params.column != lockRule.column &&
            params.row != lockRule.row) {
            arrowSegment = arrowContainer.appendChild(document.createElement('div'));
            arrowSegment.classList.add('arrowSegment');
            left = fromRect.right - elementRect.left;
            width = toRect.left - fromRect.right + (fromRect.right - fromRect.left) / 2 + 5;
            height = fromRect.bottom - fromRect.top;
            top = fromRect.top - elementRect.top + (height / 2) - 5;

            if (lockRule.column > params.column) {
                left = toRect.right - element.left;
                width = fromRect.left - toRect.right;
            }

            arrowSegment.style.left = left + 'px';
            arrowSegment.style.width = width + 'px';
            arrowSegment.style.height = '10px';
            arrowSegment.style.top = top + 'px';

            arrowSegment = arrowContainer.appendChild(document.createElement('div'));
            arrowSegment.classList.add('arrowSegment');
            width = toRect.right - toRect.left;
            left = toRect.left - elementRect.left + (width / 2) - 5;
            height = toRect.top - fromRect.bottom + (fromRect.bottom - fromRect.top) / 2;
            top = fromRect.bottom - elementRect.top - 15;

            arrowSegment.style.left = left + 'px';
            arrowSegment.style.width = '10px';
            arrowSegment.style.height = height + 'px';
            arrowSegment.style.top = top + 'px';

            arrowEnd = arrowContainer.appendChild(document.createElement('div'));
            arrowEnd.classList.add('arrowEnd');
            arrowEnd.classList.add('pointDown');
            arrowEnd.innerHTML = '<svg viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M 345.44 248.29 L 151.15 442.57 C 138.791 454.935 118.753 454.935 106.4 442.57 C 94.046 430.216 155.683 223.842 155.683 223.842 C 155.683 223.842 94.046 21.622 106.4 9.268 C 118.754 -3.091 138.791 -3.091 151.15 9.268 L 345.44 203.548 C 351.617 209.728 354.702 217.819 354.702 225.914 C 354.702 234.013 351.611 242.11 345.435 248.287" fill="currentColor" transform="matrix(0.03541, -0.00013, 0.00013, 0.03541, 2.98, 3.02)"/></svg>';

            top = toRect.top - elementRect.top - 15;
            left = left - 12;

            arrowEnd.style.top = top + 'px';
            arrowEnd.style.left = left + 'px';
            return;
        }

        if (params.column != lockRule.column) {
            arrowSegment = arrowContainer.appendChild(document.createElement('div'));
            arrowSegment.classList.add('arrowSegment');
            left = fromRect.right - elementRect.left;
            width = toRect.left - fromRect.right;
            height = fromRect.bottom - fromRect.top;
            top = fromRect.top - elementRect.top + (height / 2) - 5;
            var pointLeft = false;

            if (lockRule.column > params.column) {
                left = toRect.right - element.left;
                width = fromRect.left - toRect.right;
                pointLeft = true;
            }

            arrowSegment.style.left = left + 'px';
            arrowSegment.style.width = width + 'px';
            arrowSegment.style.height = '10px';
            arrowSegment.style.top = top + 'px';

            arrowEnd = arrowContainer.appendChild(document.createElement('div'));
            arrowEnd.classList.add('arrowEnd');
            arrowEnd.innerHTML = '<svg viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M 345.44 248.29 L 151.15 442.57 C 138.791 454.935 118.753 454.935 106.4 442.57 C 94.046 430.216 155.683 223.842 155.683 223.842 C 155.683 223.842 94.046 21.622 106.4 9.268 C 118.754 -3.091 138.791 -3.091 151.15 9.268 L 345.44 203.548 C 351.617 209.728 354.702 217.819 354.702 225.914 C 354.702 234.013 351.611 242.11 345.435 248.287" fill="currentColor" transform="matrix(0.03541, -0.00013, 0.00013, 0.03541, 2.98, 3.02)"/></svg>';

            top = top - 10;
            left = toRect.left - elementRect.left - 15;

            if (pointLeft) {
                arrowEnd.classList.add('pointLeft');
            }

            arrowEnd.style.top = top + 'px';
            arrowEnd.style.left = left + 'px';
            return;
        }

        if (params.row != lockRule.row) {
            arrowSegment = arrowContainer.appendChild(document.createElement('div'));
            arrowSegment.classList.add('arrowSegment');
            width = fromRect.right - fromRect.left;
            left = fromRect.left - elementRect.left + (width / 2) - 5;
            height = toRect.top - fromRect.bottom;
            top = fromRect.bottom - elementRect.top;

            arrowSegment.style.left = left + 'px';
            arrowSegment.style.width = '10px';
            arrowSegment.style.height = height + 'px';
            arrowSegment.style.top = top + 'px';
            
            arrowEnd = arrowContainer.appendChild(document.createElement('div'));
            arrowEnd.classList.add('arrowEnd');
            arrowEnd.classList.add('pointDown');
            arrowEnd.innerHTML = '<svg viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M 345.44 248.29 L 151.15 442.57 C 138.791 454.935 118.753 454.935 106.4 442.57 C 94.046 430.216 155.683 223.842 155.683 223.842 C 155.683 223.842 94.046 21.622 106.4 9.268 C 118.754 -3.091 138.791 -3.091 151.15 9.268 L 345.44 203.548 C 351.617 209.728 354.702 217.819 354.702 225.914 C 354.702 234.013 351.611 242.11 345.435 248.287" fill="currentColor" transform="matrix(0.03541, -0.00013, 0.00013, 0.03541, 2.98, 3.02)"/></svg>';

            top = toRect.top - elementRect.top - 15;
            left = left - 12;

            arrowEnd.style.top = top + 'px';
            arrowEnd.style.left = left + 'px';
            return;
        }
    }

    initTalentTable(number, className, specName) {
        var existingTalentTables = this.element.getElementsByClassName("talentTable");
        var talentTable;
        if (existingTalentTables.length > number) {
            talentTable = existingTalentTables[number];
            talentTable.innerHTML = null;
            return talentTable;
        }

        var imageName = className + "_" + specName + "_background.jpg";
        talentTable = this.element.appendChild(document.createElement('div'));
        talentTable.style.backgroundImage = "url('" + this.baseUrl + imageName + "')";
        talentTable.classList.add("talentTable");
        talentTable.dataset.specNumber = number;
        talentTable.dataset.spec = specName;
        return talentTable;
    }

    addTalentRank(talentAnchor) {
        var self = this;
        if (this.getUserSpentPoints() + 1 > this.maxUserSpentPoints) return;
        
        var talentData = this.classTypes[talentAnchor.dataset.class][talentAnchor.dataset.spec][talentAnchor.dataset.row][talentAnchor.dataset.column];
        if (parseInt(talentAnchor.dataset.rank) + 1 > talentData.ranks.length) return;

        if (this.getUserSpentPointsInSpec(talentAnchor.dataset.spec) < talentAnchor.dataset.row * 5) {
            return;
        }

        var isLocked = false;
        if (talentData.lockRules.length > 0) {
            talentData.lockRules.forEach(function(lockRule) {
                var otherTalentData = self.classTypes[talentAnchor.dataset.class][talentAnchor.dataset.spec][lockRule.row][lockRule.column];

                if (self.getUserSpentPointsInTalent(talentAnchor.dataset.spec, lockRule.row, lockRule.column) < otherTalentData.ranks.length) {
                    isLocked = true;
                    return;
                }
            });
        }

        if (isLocked) return;

        var userPointKey = talentAnchor.dataset.class + ':' + 
            talentAnchor.dataset.spec + ':' + 
            talentAnchor.dataset.row + ':' + 
            talentAnchor.dataset.column + ':' + 
            (parseInt(talentAnchor.dataset.rank) + 1);
        this.userPointHistory.push(userPointKey);
        this.userPointHistoryUpdateEvent();
        this.updateTalentAnchor(talentAnchor, parseInt(talentAnchor.dataset.rank) + 1);
        this.updateTalentTableHeader(talentAnchor.dataset.spec);
    }

    subtractTalentRank(talentAnchor) {
        var self = this;
        if (talentAnchor.dataset.rank <= 0) return;

        var params = {
            class: talentAnchor.dataset.class,
            spec: talentAnchor.dataset.spec,
            specNumber: parseInt(talentAnchor.dataset.number),
            "row": parseInt(talentAnchor.dataset.row),
            "column": parseInt(talentAnchor.dataset.column),
            rank: parseInt(talentAnchor.dataset.rank)
        };

        var i;
        var j;
        var pointsUpToRow = 0;
        var pointsAfterRow = 0;
        var minPoints = 0;
        for (i = 0; i < this.classTypes[params.class][params.spec].length; i++) {
            var points = 0;
            for (j = 0; j < this.classTypes[params.class][params.spec][i].length; j++) {
                if (this.userSpentPoints[params.spec][i] != undefined &&
                    this.userSpentPoints[params.spec][i][j] != undefined) {
                    points += this.userSpentPoints[params.spec][i][j];
                    minPoints = i * 5;
                }
            }
            if (i <= params.row) {
                pointsUpToRow += points;
            } else {
                pointsAfterRow += points;
            }
        }
        if (pointsAfterRow > 0 && pointsUpToRow - 1 < minPoints) return;

        var canSubtract = true;
        for (i = 0; i < this.classTypes[params.class][params.spec].length; i++) {
            for (j = 0; j < this.classTypes[params.class][params.spec][i].length; j++) {
                if (!canSubtract) break;

                var spentPointsInTalent = this.getUserSpentPointsInTalent(params.spec, i, j);

                var talentData = this.classTypes[params.class][params.spec][i][j];
                if (talentData == null || spentPointsInTalent <= 0) continue;

                if (talentData.lockRules.length) {
                    talentData.lockRules.forEach(function (lockRule) {
                        if (lockRule.row == params.row &&
                            lockRule.column == params.column) {
                            canSubtract = false;
                            return;
                        }
                    });
                }
            }
        }

        if (!canSubtract) return;
        
        var userPointKey = params.class + ':' +
            params.spec + ':' +
            params.row + ':' +
            params.column + ':' +
            params.rank;
        var userPointIndex = this.userPointHistory.indexOf(userPointKey);
        if (userPointIndex >= 0) this.userPointHistory.splice(userPointIndex, 1);
        this.userPointHistoryUpdateEvent();
        this.updateTalentAnchor(talentAnchor, params.rank - 1);
        this.updateTalentTableHeader(params.spec);
    }

    clearTalentTable(className, specName) {
        var self = this;

        var talentAnchors = this.element.querySelectorAll('.talentAnchor[data-spec="' + specName + '"]');
        Array.prototype.forEach.call(talentAnchors, function(talentAnchor) {
            talentAnchor.dataset.rank = 0;
            var params = {
                class: className,
                spec: specName,
                row: talentAnchor.dataset.row,
                column: talentAnchor.dataset.column
            };
            var talentRanks = talentAnchor.getElementsByClassName('talentRanks')[0];
            var talentData = self.getTalentData(params);
            talentRanks.innerText = "0/" + talentData.ranks.length;
            
            var isLocked = false;
            if (talentAnchor.dataset.row > 0) {
                isLocked = true;
            }
            
            if (talentData.lockRules.length > 0 && !isLocked) {
                talentData.lockRules.forEach(function(lockRule) {
                    var otherTalentData = self.classTypes[className][specName][lockRule.row][lockRule.column];

                    if (self.getUserSpentPointsInTalent(specName, lockRule.row, lockRule.column) < otherTalentData.ranks.length) {
                        isLocked = true;
                        return;
                    }
                });
            }

            var talentImg = talentAnchor.getElementsByClassName('talentImg')[0];
            if (isLocked) {
                talentImg.classList.add('locked');
            } else {
                talentImg.classList.remove('locked');
            }
        });

        this.userSpentPoints[specName] = [];
        
        var newUserPointHistory = [];
        this.userPointHistory.forEach(function(userPoint) {
            if (!userPoint.includes(specName)) {
                newUserPointHistory.push(userPoint);
            }
        });
        this.userPointHistory = newUserPointHistory;
        this.updateTalentTableHeader(specName);
        this.userPointHistoryUpdateEvent();
    }

    updateTalentAnchor(talentAnchor, rank) {
        var params = {
            class: talentAnchor.dataset.class,
            spec: talentAnchor.dataset.spec,
            specNumber: parseInt(talentAnchor.dataset.number),
            "row": parseInt(talentAnchor.dataset.row),
            "column": parseInt(talentAnchor.dataset.column),
            rank: parseInt(rank)
        };

        talentAnchor.dataset.rank = rank;
        var talentRanks = talentAnchor.getElementsByClassName('talentRanks')[0];
        var talentData = this.getTalentData(params);
        talentRanks.innerText = rank + "/" + talentData.ranks.length;

        if (this.userSpentPoints[params.spec] == undefined) {
            this.userSpentPoints[params.spec] = [];
        }

        if (this.userSpentPoints[params.spec][params.row] == undefined) {
            this.userSpentPoints[params.spec][params.row] = [];
        }

        this.userSpentPoints[params.spec][params.row][params.column] = rank;
        this.updateLocks(params);
        this.showTooltip(params);
    }

    updateTalentTableHeader(specName) {
        var talentTablePoints = this.element.querySelector('.talentTable[data-spec="' + specName + '"] .talentTablePoints');
        talentTablePoints.innerText = '[' + this.getUserSpentPointsInSpec(specName) + ']';
    }

    updateLocks(params) {
        var self = this;
        var talentAnchors = this.element.querySelectorAll('.talentAnchor[data-spec="' + params.spec + '"]');
        var spentPoints = this.getUserSpentPointsInSpec(params.spec);

        Array.prototype.forEach.call(talentAnchors, function(talentAnchor) {
            var isLocked = false;

            var talentParams = {
                class: talentAnchor.dataset.class,
                spec: talentAnchor.dataset.spec,
                specNumber: parseInt(talentAnchor.dataset.number),
                "row": parseInt(talentAnchor.dataset.row),
                "column": parseInt(talentAnchor.dataset.column),
                rank: parseInt(talentAnchor.dataset.rank)
            }
            
            if (spentPoints < talentParams.row * 5) {
                isLocked = true;
            }

            var talentData = self.getTalentData(talentParams);
            if (talentData.lockRules.length > 0 && !isLocked) {
                talentData.lockRules.forEach(function(lockRule) {
                    var otherTalentData = self.classTypes[talentParams.class][talentParams.spec][lockRule.row][lockRule.column];

                    if (self.getUserSpentPointsInTalent(talentParams.spec, lockRule.row, lockRule.column) < otherTalentData.ranks.length) {
                        isLocked = true;
                        return;
                    }
                });
            }

            var talentImg = talentAnchor.getElementsByClassName('talentImg')[0];
            if (isLocked) {
                talentImg.classList.add('locked');
            } else {
                talentImg.classList.remove('locked');
            }
            
            var talentArrows = self.element.querySelectorAll('.talentArrow[data-spec="' + talentParams.spec + '"][data-row="' + talentParams.row + '"][data-column="' + talentParams.column + '"]');
            if (talentArrows.length > 0) {
                Array.prototype.forEach.call(talentArrows, function(talentArrow) {
                    if (isLocked) {
                        talentArrow.classList.add('locked');
                    } else {
                        talentArrow.classList.remove('locked');
                    }
                });
            }
        });
    }

    getUserSpentPoints() {
        return this.userPointHistory.length;
    }

    getUserSpentPointsInSpec(specName) {
        if (this.userSpentPoints[specName] == undefined) return 0;

        var points = 0;
        this.userSpentPoints[specName].forEach(function(row) {
            row.forEach(function(column) {
                points += column;
            })
        });

        return points;
    }

    getUserSpentPointsInTalent(specName, row, column) {
        if (this.userSpentPoints[specName] == undefined) return 0;
        if (this.userSpentPoints[specName][row] == undefined) return 0;
        if (this.userSpentPoints[specName][row][column] == undefined) return 0;

        return this.userSpentPoints[specName][row][column];
    }

    getTalentData(params) {
        if (this.classTypes[params.class] == undefined) throw 'Undefined classType specified';
        if (this.classTypes[params.class][params.spec] == undefined) throw 'Undefined specName specified';
        if (this.classTypes[params.class][params.spec][params.row] == undefined) throw 'Undefined row specified';
        if (this.classTypes[params.class][params.spec][params.row][params.column] == undefined) throw 'Undefined column specified';
        var talentData = this.classTypes[params.class][params.spec][params.row][params.column];
        return talentData;
    }

    showTooltip(params) {
        var self = this;

        var talentData = this.getTalentData(params);

        this.tooltip.getElementsByClassName('talentName')[0].innerText = talentData.name;
        this.tooltip.getElementsByClassName('talentRank')[0].innerText = 'Rank ' + (params.rank == 0 ? 1 : params.rank);

        Array.prototype.forEach.call(this.tooltip.getElementsByClassName('talentHeader'), function(element) {
            element.classList.add('hidden');
        });

        if (talentData.headers.length > 0) {
            if (talentData.headers[0].left.length) {
                this.tooltip.getElementsByClassName('talentHeaderLeft1')[0].classList.remove('hidden');
                this.tooltip.getElementsByClassName('talentHeaderLeft1')[0].innerText = talentData.headers[0].left;
                
            }
            if (talentData.headers[0].right.length) {
                this.tooltip.getElementsByClassName('talentHeaderRight1')[0].classList.remove('hidden');
                this.tooltip.getElementsByClassName('talentHeaderRight1')[0].innerText = talentData.headers[0].right;
            }

            if (talentData.headers.length > 1) {
                if (talentData.headers[0].left.length) {
                this.tooltip.getElementsByClassName('talentHeaderLeft2')[0].classList.remove('hidden');
                    this.tooltip.getElementsByClassName('talentHeaderLeft2')[0].innerText = talentData.headers[1].left;
                }
                if (talentData.headers[0].right.length) {
                this.tooltip.getElementsByClassName('talentHeaderRight2')[0].classList.remove('hidden');
                    this.tooltip.getElementsByClassName('talentHeaderRight2')[0].innerText = talentData.headers[1].right;
                }
            }
        }

        var rankTexts = [talentData.ranks[(params.rank <= 0 ? 0 : params.rank - 1)].text];
        if (params.rank > 0 && params.rank < talentData.ranks.length && params.detailed) {
            rankTexts.push("Next Rank");
            rankTexts.push(talentData.ranks[params.rank].text);
        }
        this.tooltip.getElementsByClassName('talentText')[0].innerHTML = rankTexts.join('</br></br>');

        var tooltipStatus = this.tooltip.getElementsByClassName('talentStatus')[0];
        if (params.detailed) {
            var isLocked = false;
            var statuses = [];

            if (this.getUserSpentPointsInSpec(params.spec) < params.row * 5) {
                statuses.push("Requires " + (params.row * 5) + " points in " + (params.spec[0] + params.spec.substring(1)));
                isLocked = true;
            }

            if (talentData.lockRules.length > 0) {
                talentData.lockRules.forEach(function(lockRule) {
                    var otherTalentData = self.classTypes[params.class][params.spec][lockRule.row][lockRule.column];

                    if (self.getUserSpentPointsInTalent(params.spec, lockRule.row, lockRule.column) < otherTalentData.ranks.length) {
                        isLocked = true;
                        statuses.push("Requires " + otherTalentData.ranks.length + " points in " + otherTalentData.name);
                    }
                });
            }

            tooltipStatus.innerHTML = statuses.join('</br>');

            if (isLocked) {
                tooltipStatus.classList.add('locked');
            } else {
                tooltipStatus.innerText = "Click to learn";
                tooltipStatus.classList.remove('locked');
            }
            tooltipStatus.classList.remove('hidden');
        } else {
            tooltipStatus.classList.add('hidden');
        }

        this.tooltip.classList.remove('hidden');
    }

    positionTooltipToTalent(spec, row, column) {
        var talentElement = this.element.querySelector('.talentAnchor[data-spec="' + spec + '"][data-row="' + row + '"][data-column="' + column + '"]');
        if (!talentElement) return;
        this.positionTooltip(this.element, talentElement);
    }

    positionTooltip(targetParent, target) {
        targetParent.appendChild(this.tooltip);
        var elementRect = targetParent.getBoundingClientRect();
        var tooltipRect = this.tooltip.getBoundingClientRect();
        var talentRect = target.getBoundingClientRect();

        var top = 0;
        var left = 0;
        var tooltipHeight = talentRect.bottom - talentRect.top;

        // Smaller screens
        if (screen.width < 600) {
            top = talentRect.top - elementRect.top - 10 - tooltipHeight;
            if (top < 0) top = talentRect.bottom - elementRect.top + 10;

            this.tooltip.style.top = top + "px";
            this.tooltip.style.left = left + "px";
            return;
        }

        top = talentRect.top - elementRect.top - tooltipHeight;
        if (top < 0) top = talentRect.top - elementRect.top;

        var tooltipWidth = tooltipRect.right - tooltipRect.left;
        var talentWidth = talentRect.right - talentRect.left;
        left = talentRect.left + (talentWidth / 2) - elementRect.left + 30;
        if (left + tooltipWidth + 5 > screen.width) {
            left = talentRect.left - elementRect.left - 20 - tooltipWidth;
        }

        this.tooltip.style.top = top + "px";
        this.tooltip.style.left = left + "px";
    }

    hideTooltip() {
        this.tooltip.classList.add('hidden');
    }
    
    userPointHistoryUpdateEvent() {
        var self = this;
        this.userPointHistoryUpdateEventSubscribers.forEach(function(callback) {
            callback(self.userPointHistory);
        });
    }

    subscribeToUserPointHistoryUpdateEvent(object, callback) {
        this.userPointHistoryUpdateEventSubscribers.push(callback.bind(object));
    }
}