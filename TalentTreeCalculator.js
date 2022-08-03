class TalentTreeCalculator {
    id;
    element;
    tooltipId;
    tooltip;
    glyphModal;
    imageParams = {
        icon: ".//Images//Icons",
        iconFormat: "jpg",
        background: ".//Images//Backgrounds//",
        backgroundFormat: "jpg"
    };
    className = '';
    userSpentPoints = {};
    userPointHistory = [];
    maxUserSpentPoints = 71;
    userGlyphs = {
        major: [null, null, null],
        minor: [null, null, null]
    };
    classData;
    talentData;
    glyphsData;
    isLocked = false;
    glyphSearchTypingTimer;

    userPointHistoryUpdateEventSubscribers = [];
    userGlyphsUpdateEventSubscribers = [];
    userClassUpdateEventSubscribers = [];

    constructor(target, classData, talentData, glyphsData, imageParams) {
        if (!target) throw 'Could not construct TalentTreeCalculator: Element not found';
        this.classData = classData;
        this.talentData = talentData;
        this.glyphsData = glyphsData;
        this.initTalentTree(target);
        this.initTooltip();
        this.initGlyphModal();
        if (imageParams != undefined) this.imageParams = imageParams;
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

    setLock(isLocked) {
        var self = this;
        this.isLocked = isLocked;
        var specClears = this.element.getElementsByClassName('talentTableClear');
        var glyphClears = this.element.getElementsByClassName('glyphTableClear');

        if (this.isLocked) {
            Array.prototype.forEach.call(specClears, function(specClear) {
                specClear.classList.add('hidden');
            });
            Array.prototype.forEach.call(glyphClears, function(glyphClear) {
                glyphClear.classList.add('hidden');
            });
        } else {
            Array.prototype.forEach.call(specClears, function(specClear) {
                specClear.classList.remove('hidden');
            });
            Array.prototype.forEach.call(glyphClears, function(glyphClear) {
                glyphClear.classList.remove('hidden');
            });
        }
        
        this.updateLocks();
    }

    buildClass(className) {
        var self = this;
        
        if (this.isLocked) return;
        
        var specs = this.classData[className].specs;
        var i = 0;
        Object.keys(specs).forEach(function(specName) {
            self.buildSpec(i++, className, specName);
        });
        this.buildGlyphTable(className);
        this.className = className;
        this.userClassUpdateEvent();
    }

    buildSpec(number, className, specName) {
        var self = this;

        if (this.isLocked) return;

        this.className = className;
        var specData = this.talentData[className][specName];

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

        var buildArrows = [];
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
                talentImg.style.backgroundImage = this.getIconImageUrl(imageName);

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
                        buildArrows.push({
                            params: params,
                            lockRule: lockRule
                        });
                    });
                }
            }
        }

        buildArrows.forEach(function(buildArrow) {
            self.buildArrow(buildArrow.params, buildArrow.lockRule);
        });

        this.userPointHistory = [];
        this.userSpentPoints = {};
        this.userPointHistoryUpdateEvent();
    }

    getIconImageUrl(iconName) {
        return "url('" + 
            this.imageParams.icon + 
            iconName + "." + this.imageParams.iconFormat +
        "')";
    }

    getBackgroundImageUrl(backgroundName) {
        return "url('" + 
            this.imageParams.background + 
            backgroundName + "." + this.imageParams.backgroundFormat +
        "')";
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
        var elementRect = talentTable.getBoundingClientRect();
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
                left = toRect.right - elementRect.left - (fromRect.right - fromRect.left) / 2 - 5;
                width = fromRect.left - toRect.right + (fromRect.right - fromRect.left) / 2 + 5;
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
            arrowSegment.style.borderTop = 'none';

            arrowEnd = arrowContainer.appendChild(document.createElement('div'));
            arrowEnd.classList.add('arrowEnd');
            arrowEnd.classList.add('pointDown');
            arrowEnd.innerHTML = '<svg viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M 345.44 248.29 L 151.15 442.57 C 138.791 454.935 118.753 454.935 106.4 442.57 C 94.046 430.216 155.683 223.842 155.683 223.842 C 155.683 223.842 94.046 21.622 106.4 9.268 C 118.754 -3.091 138.791 -3.091 151.15 9.268 L 345.44 203.548 C 351.617 209.728 354.702 217.819 354.702 225.914 C 354.702 234.013 351.611 242.11 345.435 248.287" fill="currentColor" transform="matrix(0.03541, -0.00013, 0.00013, 0.03541, 2.98, 3.02)"/></svg>';

            top = toRect.top - elementRect.top - 15;
            left = left - 10;

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
                left = toRect.right - elementRect.left;
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
                left = toRect.right - elementRect.left - 15;
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
            left = left - 10;

            arrowEnd.style.top = top + 'px';
            arrowEnd.style.left = left + 'px';
            return;
        }
    }

    initTalentTable(number, className, specName) {
        var existingTalentTables = this.element.getElementsByClassName("talentTable");
        var talentTable;
        var imageName = this.classData[className].specs[specName].id;

        if (existingTalentTables.length > number) {
            talentTable = existingTalentTables[number];
            talentTable.innerHTML = null;
        } else {
            talentTable = this.element.appendChild(document.createElement('div'));
        }

        talentTable.style.backgroundImage = this.getBackgroundImageUrl(imageName);
        talentTable.classList.add("talentTable");
        talentTable.dataset.class = className;
        talentTable.dataset.specNumber = number;
        talentTable.dataset.spec = specName;

        return talentTable;
    }

    addTalentRank(talentAnchor) {
        var self = this;

        if (this.isLocked) return;

        if (this.getUserSpentPoints() + 1 > this.maxUserSpentPoints) return;
        
        var talentData = this.talentData[talentAnchor.dataset.class][talentAnchor.dataset.spec][talentAnchor.dataset.row][talentAnchor.dataset.column];
        if (parseInt(talentAnchor.dataset.rank) + 1 > talentData.ranks.length) return;

        if (this.getUserSpentPointsInSpec(talentAnchor.dataset.spec) < talentAnchor.dataset.row * 5) {
            return;
        }

        var isLocked = false;
        if (talentData.lockRules.length > 0) {
            talentData.lockRules.forEach(function(lockRule) {
                var otherTalentData = self.talentData[talentAnchor.dataset.class][talentAnchor.dataset.spec][lockRule.row][lockRule.column];

                if (self.getUserSpentPointsInTalent(talentAnchor.dataset.spec, lockRule.row, lockRule.column) < otherTalentData.ranks.length) {
                    isLocked = true;
                    return;
                }
            });
        }

        if (isLocked) return;

        var params = {
            class: talentAnchor.dataset.class,
            spec: talentAnchor.dataset.spec,
            specNumber: parseInt(talentAnchor.dataset.number),
            row: parseInt(talentAnchor.dataset.row),
            column: parseInt(talentAnchor.dataset.column),
            rank: parseInt(talentAnchor.dataset.rank) + 1,
            detailed: true
        };

        var userPointKey = params.class + ':' + 
            params.spec + ':' + 
            params.row + ':' + 
            params.column + ':' + 
            params.rank;
        this.userPointHistory.push(userPointKey);
        this.userPointHistoryUpdateEvent();

        this.updateTalentAnchor(talentAnchor, params.rank);
        this.updateLocks();
        this.showTooltip(params);
        this.positionTooltipToTalent(params.spec, params.row, params.column);
        this.updateTalentTableHeader(talentAnchor.dataset.spec);
    }

    subtractTalentRank(talentAnchor) {
        var self = this;

        if (this.isLocked) return;

        if (talentAnchor.dataset.rank <= 0) return;

        var params = {
            class: talentAnchor.dataset.class,
            spec: talentAnchor.dataset.spec,
            specNumber: parseInt(talentAnchor.dataset.number),
            row: parseInt(talentAnchor.dataset.row),
            column: parseInt(talentAnchor.dataset.column),
            rank: parseInt(talentAnchor.dataset.rank)
        };

        var i;
        var j;
        var pointsUpToRow = 0;
        var pointsAfterRow = 0;
        var minPoints = 0;
        for (i = 0; i < this.talentData[params.class][params.spec].length; i++) {
            var points = 0;
            for (j = 0; j < this.talentData[params.class][params.spec][i].length; j++) {
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
        for (i = 0; i < this.talentData[params.class][params.spec].length; i++) {
            for (j = 0; j < this.talentData[params.class][params.spec][i].length; j++) {
                if (!canSubtract) break;

                var spentPointsInTalent = this.getUserSpentPointsInTalent(params.spec, i, j);

                var talentData = this.talentData[params.class][params.spec][i][j];
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

        params.rank -= 1;
        this.updateTalentAnchor(talentAnchor, params.rank);
        this.updateLocks();
        this.showTooltip(params);
        this.positionTooltipToTalent(params.spec, params.row, params.column);
        this.updateTalentTableHeader(params.spec);
    }

    clearTalentTable(className, specName) {
        var self = this;

        if (this.isLocked) return;

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
                    var otherTalentData = self.talentData[className][specName][lockRule.row][lockRule.column];

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
        
        var talentArrows = self.element.querySelectorAll('.talentArrow[data-spec="' + specName + '"]');
        if (talentArrows.length > 0) {
            Array.prototype.forEach.call(talentArrows, function(talentArrow) {
                talentArrow.classList.add('locked');
            });
        }

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
            row: parseInt(talentAnchor.dataset.row),
            column: parseInt(talentAnchor.dataset.column),
            rank: parseInt(rank),
            detailed: true
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
    }

    updateTalentTableHeader(specName) {
        var talentTablePoints = this.element.querySelector('.talentTable[data-spec="' + specName + '"] .talentTablePoints');
        talentTablePoints.innerText = '[' + this.getUserSpentPointsInSpec(specName) + ']';
    }

    updateLocks() {
        var self = this;
        Object.keys(this.classData[this.className].specs).forEach(function(specName) {
            self.updateSpecLocks(specName);
        });
    }

    updateSpecLocks(specName) {
        var self = this;
        var talentAnchors = this.element.querySelectorAll('.talentAnchor[data-spec="' + specName + '"]');
        var spentPoints = this.getUserSpentPointsInSpec(specName);

        Array.prototype.forEach.call(talentAnchors, function(talentAnchor) {
            var isLocked = false;

            var talentParams = {
                class: talentAnchor.dataset.class,
                spec: talentAnchor.dataset.spec,
                specNumber: parseInt(talentAnchor.dataset.number),
                row: parseInt(talentAnchor.dataset.row),
                column: parseInt(talentAnchor.dataset.column),
                rank: parseInt(talentAnchor.dataset.rank)
            };
            
            // Locked by user or they've spent all points
            var isSoftLocked = self.userPointHistory.length >= self.maxUserSpentPoints || self.isLocked;

            // If there's no ranks in this talent and it's softLocked, lock it
            isLocked = parseInt(talentAnchor.dataset.rank) == 0 && isSoftLocked;
            
            if (spentPoints < talentParams.row * 5) {
                isLocked = true;
            }

            var talentData = self.getTalentData(talentParams);
            if (talentData.lockRules.length > 0 && !isLocked) {
                talentData.lockRules.forEach(function(lockRule) {
                    var otherTalentData = self.talentData[talentParams.class][talentParams.spec][lockRule.row][lockRule.column];

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
        if (this.talentData[params.class] == undefined) throw 'Undefined classType specified';
        if (this.talentData[params.class][params.spec] == undefined) throw 'Undefined specName specified';
        if (this.talentData[params.class][params.spec][params.row] == undefined) throw 'Undefined row specified';
        if (this.talentData[params.class][params.spec][params.row][params.column] == undefined) throw 'Undefined column specified';
        var talentData = this.talentData[params.class][params.spec][params.row][params.column];
        return talentData;
    }

    showTooltip(params) {
        var self = this;

        var talentData = this.getTalentData(params);
        if (talentData == null) return;

        this.tooltip.getElementsByClassName('talentName')[0].innerText = talentData.name;
        this.tooltip.getElementsByClassName('talentRank')[0].innerText = 'Rank ' + (params.rank == 0 ? 1 : params.rank);

        Array.prototype.forEach.call(this.tooltip.getElementsByClassName('talentHeader'), function(element) {
            element.classList.add('hidden');
        });

        if (talentData.headers.length > 0) {
            if (talentData.headers[0].left != undefined) {
                this.tooltip.getElementsByClassName('talentHeaderLeft1')[0].classList.remove('hidden');
                this.tooltip.getElementsByClassName('talentHeaderLeft1')[0].innerText = talentData.headers[0].left;
                
            }
            if (talentData.headers[0].right != undefined) {
                this.tooltip.getElementsByClassName('talentHeaderRight1')[0].classList.remove('hidden');
                this.tooltip.getElementsByClassName('talentHeaderRight1')[0].innerText = talentData.headers[0].right;
            }

            if (talentData.headers.length > 1) {
                if (talentData.headers[1].left != undefined) {
                this.tooltip.getElementsByClassName('talentHeaderLeft2')[0].classList.remove('hidden');
                    this.tooltip.getElementsByClassName('talentHeaderLeft2')[0].innerText = talentData.headers[1].left;
                }
                if (talentData.headers[1].right != undefined) {
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
                    var otherTalentData = self.talentData[params.class][params.spec][lockRule.row][lockRule.column];

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
        var tooltipHeight = this.tooltip.offsetHeight;
        var elementHeight = elementRect.bottom - elementRect.top;

        // Smaller screens
        if (screen.width < 600) {
            top = talentRect.top - elementRect.top - 10 - tooltipHeight;
            if (top < 0) top = talentRect.bottom - elementRect.top + 20;
            console.log(top, talentRect.top, tooltipHeight, elementHeight);
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

    initGlyphModal() {
        var self = this;

        var glyphModal = this.element.appendChild(document.createElement('div'));
        glyphModal.classList.add('talentTreeGlyphModal', 'hidden');
        
        var glyphDialog = glyphModal.appendChild(document.createElement('div'));
        glyphDialog.classList.add('talentTreeGlyphModalDialog');
        
        var glyphContent = glyphDialog.appendChild(document.createElement('div'));
        glyphContent.classList.add('talentTreeGlyphModalContent');

        var glyphHeader = glyphContent.appendChild(document.createElement('div'));
        glyphHeader.classList.add('talentTreeGlyphModalHeader');

        var glyphSearch = glyphHeader.appendChild(document.createElement('div'));
        glyphSearch.classList.add('talentTreeGlyphModalSearch');

        var glyphSearchIcon = glyphSearch.appendChild(document.createElement('div'));
        glyphSearchIcon.classList.add('talentTreeGlyphModalSearchIcon');
        
        var glyphSearchClear = glyphSearch.appendChild(document.createElement('div'));
        glyphSearchClear.classList.add('talentTreeGlyphModalSearchClear');
        glyphSearchClear.innerHTML = '<svg viewBox="45.62 12.774 333.334 332.725" xmlns="http://www.w3.org/2000/svg"><rect x="193.431" y="77.859" width="38.321" height="194.039" rx="9" ry="9" style="fill: currentColor; stroke: none;" transform="matrix(0.707108, 0.707106, -0.707106, 0.707108, 185.924316, -99.10424)"/><rect x="193.431" y="77.859" width="38.321" height="194.039" rx="9" ry="9" style="fill: currentColor; stroke: none;" transform="matrix(0.707106, -0.707108, 0.707108, 0.707106, -60.479069, 202.458252)"/><ellipse style="stroke: currentColor; fill: none; stroke-width: 27px;" cx="212.287" cy="178.629" rx="149.635" ry="149.635"/></svg>';
        glyphSearchClear.addEventListener('click', function(event) {
            var element = event.target.classList.contains('talentTreeGlyphModalSearchClear') ? 
                event.target : 
                event.target.closest('.talentTreeGlyphModalSearchClear');

            clearTimeout(self.glyphSearchTypingTimer);
            self.clearSearchGlyphModal();
        });

        var glyphSearchInput = glyphSearch.appendChild(document.createElement('input'));
        glyphSearchInput.classList.add('talentTreeGlyphModalSearchInput');
        glyphSearchInput.setAttribute('placeholder', 'Search for Glphys...');

        glyphSearchInput.addEventListener('keyup', function(event) {
            var element = event.target.classList.contains('talentTreeGlyphModalSearchInput') ? 
                event.target : 
                event.target.closest('.talentTreeGlyphModalSearchInput');

            clearTimeout(self.glyphSearchTypingTimer);
            if (element.value.length > 0) {
                self.glyphSearchTypingTimer = setTimeout(self.searchGlyphModal, 600, self);
            } else {
                self.clearSearchGlyphModal();
            }
        });

        var glyphClose = glyphHeader.appendChild(document.createElement('div'));
        glyphClose.classList.add('talentTreeGlyphModalClose');
        glyphClose.innerHTML = '<svg viewBox="45.62 12.774 333.334 332.725" xmlns="http://www.w3.org/2000/svg"><rect x="193.431" y="77.859" width="38.321" height="194.039" rx="9" ry="9" style="fill: currentColor; stroke: none;" transform="matrix(0.707108, 0.707106, -0.707106, 0.707108, 185.924316, -99.10424)"/><rect x="193.431" y="77.859" width="38.321" height="194.039" rx="9" ry="9" style="fill: currentColor; stroke: none;" transform="matrix(0.707106, -0.707108, 0.707108, 0.707106, -60.479069, 202.458252)"/><ellipse style="stroke: currentColor; fill: none; stroke-width: 27px;" cx="212.287" cy="178.629" rx="149.635" ry="149.635"/></svg>';

        glyphClose.addEventListener("click", function(event) {
            self.closeGlyphModal();
        });

        var glyphBody = glyphContent.appendChild(document.createElement('div'));
        glyphBody.classList.add('talentTreeGlyphModalBody');

        var glyphTable = glyphBody.appendChild(document.createElement('table'));
        glyphTable.classList.add('talentTreeGlyphModalTable');

        var glyphTableHeader = glyphTable.appendChild(document.createElement('thead'));
        glyphTableHeader.classList.add('talentTreeGlyphModalTableHeader');

        var glyphTableHeaderRow = glyphTableHeader.appendChild(document.createElement('tr'));
        glyphTableHeaderRow.classList.add('talentTreeGlyphModalTableHeaderRow');

        var glyphTableHeaderColumn = glyphTableHeaderRow.appendChild(document.createElement('th'));
        glyphTableHeaderColumn.classList.add('talentTreeGlyphModalTableHeaderColumn');
        glyphTableHeaderColumn.style.width = "36px";

        glyphTableHeaderColumn = glyphTableHeaderRow.appendChild(document.createElement('th'));
        glyphTableHeaderColumn.classList.add('talentTreeGlyphModalTableHeaderColumn');
        glyphTableHeaderColumn.dataset.column = "name";
        glyphTableHeaderColumn.innerText = "Name";

        glyphTableHeaderColumn = glyphTableHeaderRow.appendChild(document.createElement('th'));
        glyphTableHeaderColumn.classList.add('talentTreeGlyphModalTableHeaderColumn');
        glyphTableHeaderColumn.dataset.column = "description";
        glyphTableHeaderColumn.innerText = "Description";

        glyphTableHeaderColumn = glyphTableHeaderRow.appendChild(document.createElement('th'));
        glyphTableHeaderColumn.classList.add('talentTreeGlyphModalTableHeaderColumn');
        glyphTableHeaderColumn.dataset.column = "level";
        glyphTableHeaderColumn.innerText = "Level";
        glyphTableHeaderColumn.style.width = "64px";

        var glyphTableBody = glyphTable.appendChild(document.createElement('tbody'));
        glyphTableBody.classList.add('talentTreeGlyphModalTableBody');

        this.glyphModal = glyphModal;
    }
    
    searchGlyphModal(self) {
        var searchText = self.element.getElementsByClassName('talentTreeGlyphModalSearchInput')[0].value.toLowerCase();
        var rows = self.element.querySelectorAll('.talentTreeGlyphModalTableRow');
        console.log(rows);
        Array.prototype.forEach.call(rows, function(row) {
            var name = row.querySelector('.talentTreeGlyphModalGlyphName a').innerText;
            var description =  row.querySelector('.talentTreeGlyphModalGlyphDescription').innerText;
            if ((name + description).toLowerCase().includes(searchText) || row.dataset.itemId == "null") {
                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
        });
    }

    clearSearchGlyphModal() {
        this.element.getElementsByClassName('talentTreeGlyphModalSearchInput')[0].value = '';
        var hiddenRows = this.element.querySelectorAll('.talentTreeGlyphModalTableRow.hidden');
        Array.prototype.forEach.call(hiddenRows, function(hiddenRow) {
            hiddenRow.classList.remove('hidden');
        });
    }

    closeGlyphModal() {
        this.glyphModal.classList.add('hidden');
        document.body.classList.remove('talentTreeModalOpen');
    }

    buildGlyphTable(className) {
        var self = this;

        if (this.isLocked) return;

        this.className = className;
        var glyphTable;
        var existingGlyphTables = this.element.getElementsByClassName("glyphTable");
        if (existingGlyphTables.length > 0) {
            glyphTable = existingGlyphTables[0];
            glyphTable.dataset.class = className;
            glyphTable.innerHTML = null;
        } else {
            glyphTable = this.element.appendChild(document.createElement('div'));
            glyphTable.classList.add("glyphTable");
            glyphTable.dataset.class = className;
        }


        var glyphTableHeader = glyphTable.appendChild(document.createElement('div'));
        glyphTableHeader.classList.add('glyphTableHeader');
        
        var glyphTableName = glyphTableHeader.appendChild(document.createElement('div'));
        glyphTableName.classList.add('glyphTableName');
        glyphTableName.innerText = "Glyphs";
        
        var glyphTableClear = glyphTableHeader.appendChild(document.createElement('div'));
        glyphTableClear.classList.add('glyphTableClear');
        glyphTableClear.innerHTML = '<svg viewBox="45.62 12.774 333.334 332.725" xmlns="http://www.w3.org/2000/svg"><rect x="193.431" y="77.859" width="38.321" height="194.039" rx="9" ry="9" style="fill: currentColor; stroke: none;" transform="matrix(0.707108, 0.707106, -0.707106, 0.707108, 185.924316, -99.10424)"/><rect x="193.431" y="77.859" width="38.321" height="194.039" rx="9" ry="9" style="fill: currentColor; stroke: none;" transform="matrix(0.707106, -0.707108, 0.707108, 0.707106, -60.479069, 202.458252)"/><ellipse style="stroke: currentColor; fill: none; stroke-width: 27px;" cx="212.287" cy="178.629" rx="149.635" ry="149.635"/></svg>';
        
        glyphTableClear.addEventListener("click", function(event) {
            event.preventDefault();
            self.clearGlyphTable();
        });

        glyphTable.addEventListener("contextmenu", function(event) {
            event.preventDefault();
            return false;
        });

        this.buildGlyphList(glyphTable, className, "major");
        this.buildGlyphList(glyphTable, className, "minor");
        
        this.userGlyphsUpdateEvent();
    }

    buildGlyphList(glyphTable, className, glyphType) {
        var glyphList = glyphTable.appendChild(document.createElement('div'));
        glyphList.classList.add(glyphType + 'GlyphList', 'glyphList');

        var glyphListHeader = glyphList.appendChild(document.createElement('div'));
        glyphListHeader.classList.add('glyphListHeader');
        glyphListHeader.innerText = glyphType[0].toUpperCase() + glyphType.slice(1);

        this.buildGlyphRow(glyphList, className, glyphType, 0);
        this.buildGlyphRow(glyphList, className, glyphType, 1);
        this.buildGlyphRow(glyphList, className, glyphType, 2);
    }

    buildGlyphRow(glyphList, className, glyphType, position) {
        var self = this;

        var glyphRow = glyphList.appendChild(document.createElement('div'));
        glyphRow.classList.add('glyphRow');

        var glyphAnchor = glyphRow.appendChild(document.createElement('a'));
        glyphAnchor.classList.add('glyphAnchor');
        glyphAnchor.dataset.class = className;
        glyphAnchor.dataset.type = glyphType;
        glyphAnchor.dataset.position = position;

        glyphAnchor.addEventListener("click", function(event) {
            var element = event.target.classList.contains('glyphAnchor') ? 
                event.target : 
                event.target.closest('.glyphAnchor');
            self.openGlyphModal(className, glyphType, element.dataset.position);
        });

        var glyphImg = glyphAnchor.appendChild(document.createElement('div'));
        glyphImg.classList.add('glyphImg');
        glyphImg.style.backgroundImage = this.getIconImageUrl("inventoryslot_empty");

        var glyphName = glyphAnchor.appendChild(document.createElement('div'));
        glyphName.classList.add('glyphName');
        glyphName.innerText = "Empty";
    }

    openGlyphModal(className, glyphType, glyphPosition) {
        if (this.glyphsData[className] == undefined) throw "Class not found in Glyph Data";
        if (this.glyphsData[className][glyphType] == undefined) throw "Glyph Type not found in Glyph Data";

        if (this.isLocked) return;

        this.glyphModal.dataset.class = className;
        this.glyphModal.dataset.type = glyphType;
        this.glyphModal.dataset.position = glyphPosition;

        var glyphs = this.glyphsData[className][glyphType];
        this.updateGlyphModalList(glyphs, null, null);
        this.glyphModal.classList.remove('hidden');
        
        document.body.classList.add('talentTreeModalOpen');
    }

    updateGlyphModalList(glyphs, nameFilter, sort) {
        var self = this;

        var glyphModalTableBody = this.glyphModal.getElementsByClassName('talentTreeGlyphModalTableBody')[0];

        var existingGlyphRowElements = glyphModalTableBody.getElementsByClassName('talentTreeGlyphModalTableRow');
        var keyedGlyphRowElements = {};
        Array.prototype.forEach.call(existingGlyphRowElements, function(glyphRowElement) {
            if (nameFilter == null || glyphRowElement.dataset.name.contains(nameFilter)) {
                var key = glyphRowElement.dataset.itemId;
                keyedGlyphRowElements[key] = glyphRowElement;
            }
        });

        var glyphRowElement;
        var glyphRowElements = [this.createGlyphModalRowElement(null)];
        Object.values(glyphs).forEach(function (glyphData) {
            if (keyedGlyphRowElements[glyphData.id] != undefined) {
                glyphRowElement = keyedGlyphRowElements[glyphData.id];
            } else {
                glyphRowElement = self.createGlyphModalRowElement(glyphData);
            }

            if ((self.userGlyphs.major.includes(glyphData.id) ||
                self.userGlyphs.minor.includes(glyphData.id))) {
                glyphRowElement.classList.add('locked');
            } else {
                glyphRowElement.classList.remove('locked');
            }

            glyphRowElements.push(glyphRowElement);
        });

        glyphModalTableBody.innerHTML = null;
        glyphRowElements.forEach(function (glyphRowElement) {
            glyphModalTableBody.appendChild(glyphRowElement);
        });
    }

    createGlyphModalRowElement(glyphData) {
        var self = this;

        var glyphRowElement = document.createElement('tr');
        glyphRowElement.classList.add('talentTreeGlyphModalTableRow');
        glyphRowElement.dataset.itemId = glyphData ? glyphData.id : null;

        var glyphColumnElement = glyphRowElement.appendChild(document.createElement('td'));
        glyphColumnElement.classList.add('talentTreeGlyphModalTableColumn');
        
        var glyphColumnImage = glyphColumnElement.appendChild(document.createElement('div'));
        glyphColumnImage.classList.add('talentTreeGlyphModalGlyphImg');
        if (glyphData) glyphColumnImage.style.backgroundImage = this.getIconImageUrl(glyphData.icon);

        glyphColumnElement = glyphRowElement.appendChild(document.createElement('td'));
        glyphColumnElement.classList.add('talentTreeGlyphModalTableColumn', 'talentTreeGlyphModalGlyphName');
        
        var glyphNameElement = glyphColumnElement.appendChild(document.createElement('a'));
        glyphNameElement.innerText = glyphData ? glyphData.name : "None";
        if (glyphData) glyphNameElement.setAttribute('rel', 'item=' + glyphData.id);

        glyphColumnElement = glyphRowElement.appendChild(document.createElement('td'));
        glyphColumnElement.classList.add('talentTreeGlyphModalTableColumn', 'talentTreeGlyphModalGlyphDescription');
        if (glyphData) glyphColumnElement.innerText = glyphData.description;

        glyphColumnElement = glyphRowElement.appendChild(document.createElement('td'));
        glyphColumnElement.classList.add('talentTreeGlyphModalTableColumn', 'talentTreeGlyphModalGlyphLevel');
        if (glyphData) glyphColumnElement.innerText = glyphData.level;

        glyphRowElement.addEventListener('click', function(event) {
            var element = event.target.classList.contains('talentTreeGlyphModalTableRow') ? 
                event.target : 
                event.target.closest('.talentTreeGlyphModalTableRow');
            
            var params = {
                id: element.dataset.itemId == 'null' ? null : parseInt(element.dataset.itemId),
                class: self.glyphModal.dataset.class,
                type: self.glyphModal.dataset.type,
                position: parseInt(self.glyphModal.dataset.position)
            };
            
            if ((self.userGlyphs.major.includes(params.id) ||
                self.userGlyphs.minor.includes(params.id)) &&
                params.id != null &&
                self.userGlyphs[params.type][params.position] != params.id) return;

            self.updateUserGlyph(params);
            self.closeGlyphModal();
        });

        return glyphRowElement;
    }

    updateUserGlyph(params) {
        if (this.isLocked) return;

        var glyphData = this.getGlyphData(params);
        var glyphAnchor = this.element.querySelectorAll('.glyphAnchor[data-type="' + params.type + '"]')[params.position];

        var glyphImgElement = glyphAnchor.getElementsByClassName('glyphImg')[0];
        var glyphNameElement = glyphAnchor.getElementsByClassName('glyphName')[0];

        if (glyphData == null) {
            glyphNameElement.innerText = "Empty";
            glyphAnchor.setAttribute('rel', '');
            glyphImgElement.style.backgroundImage = this.getIconImageUrl("inventoryslot_empty");
        } else {
            glyphNameElement.innerText = glyphData.name;
            glyphAnchor.setAttribute('rel', 'item=' + glyphData.id);
            glyphImgElement.style.backgroundImage = this.getIconImageUrl(glyphData.icon);
        }

        this.userGlyphs[params.type][params.position] = params.id;
        this.userGlyphsUpdateEvent();
    }

    getGlyphData(params) {
        if (params.id == null) return;
        return this.glyphsData[params.class][params.type][parseInt(params.id)];
    }

    clearGlyphTable() {
        var self = this;

        if (this.isLocked) return;

        var glyphAnchors = this.element.querySelectorAll('.glyphAnchor');
        Array.prototype.forEach.call(glyphAnchors, function(glyphAnchor) {
            glyphAnchor.setAttribute('rel', '');
            var glyphImg = glyphAnchor.getElementsByClassName('glyphImg')[0];
            glyphImg.style.backgroundImage = self.getIconImageUrl("inventoryslot_empty");
            
            var glyphName = glyphAnchor.getElementsByClassName('glyphName')[0];
            glyphName.innerText = "Empty";
        });

        this.userGlyphs.major = [null, null, null];
        this.userGlyphs.minor = [null, null, null];

        this.userGlyphsUpdateEvent();
    }

    exportToUrl() {
        var urlString = '';

        var className = this.className;
        var classKeys = Object.keys(this.talentData);
        urlString += 'c=' + classKeys.indexOf(className);

        var i;
        if (this.userPointHistory.length > 0) {
            urlString += '&t=';
            var talentString = '';
            var currentSpecIndex = -1;
            var specKeys = Object.keys(this.talentData[className]);
            var specs = ['A','B','C'];
            var talents = [
                0,1,2,3,4,5,6,7,8,9,
                'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
                'D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
            ];
            this.userPointHistory.forEach(function(userPoint) {
                var split = userPoint.split(':');
                var specIndex = specKeys.indexOf(split[1]);
                if (specIndex != currentSpecIndex) {
                    currentSpecIndex = specIndex;
                    talentString += specs[currentSpecIndex];
                }
                var talentIndex = (parseInt(split[2]) * 4) + parseInt(split[3]);
                talentString += talents[talentIndex];
            });

            var compressedTalentString = '';
            for (i = 0; i < talentString.length; i++) {
                if (specs.indexOf(talentString[i]) >= 0) {
                    compressedTalentString += talentString[i];
                    continue;
                }
                var count = 1;
                for (var j = i + 1; j < talentString.length; j++) {
                    if (talentString[j] != talentString[i]) break;
                    count++;
                }
                compressedTalentString += talentString[i] + count;
                i += count - 1;
            }

            urlString += compressedTalentString;
        }

        var glyphString = '';
        var majors = ['A','B','C'];
        var minors = ['D','E','F'];
        var majorKeys = Object.keys(this.glyphsData[className].major);
        var minorKeys = Object.keys(this.glyphsData[className].minor);
        for (i = 0; i < this.userGlyphs.major.length; i++) {
            if (this.userGlyphs.major[i] != null) {
                glyphString += majors[i] + majorKeys.indexOf(this.userGlyphs.major[i].toString());
            }
        }
        for (i = 0; i < this.userGlyphs.major.length; i++) {
            if (this.userGlyphs.minor[i] != null) {
                glyphString += minors[i] + minorKeys.indexOf(this.userGlyphs.minor[i].toString());
            }
        }

        if (glyphString.length > 0) {
            urlString += '&g=' + glyphString;
        }

        return urlString;
    }

    importFromUrl(urlString)
    {
        var self = this;
        var userPointHistory = [];
        var userSpentPoints = {};
        var userGlyphs = {
            major: [null, null, null],
            minor: [null, null, null]
        };

        var char;
        var params = this.getParamsFromString(urlString);
        if (params == null) return;

        var talentString = '';
        var className = Object.keys(this.talentData)[parseInt(params['c'])];
        var i;

        this.buildClass(className);
        
        if (params['t'] != undefined) {
            var compressedTalentString = params['t'];
            var uncompressedTalentString = '';
            var specKeys = Object.keys(this.talentData[className]);
            var specs = ['A','B','C'];
            var talents = [
                0,1,2,3,4,5,6,7,8,9,
                'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
                'D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
            ];

            for (i = 0; i < compressedTalentString.length; i++) {
                if (specs.indexOf(compressedTalentString[i]) >= 0) {
                    uncompressedTalentString += compressedTalentString[i];
                    continue;
                }

                for (var j = 0; j < parseInt(compressedTalentString[i + 1]); j++) {
                    uncompressedTalentString += compressedTalentString[i];
                }
                i++;
            }

            var currentSpecName = '';
            for (i = 0; i < uncompressedTalentString.length; i++) {
                char = uncompressedTalentString[i];
                if (specs.indexOf(char) >= 0) {
                    var specIndex = specs.indexOf(char);
                    currentSpecName = Object.keys(this.talentData[className])[specIndex];
                    continue;
                }

                var talentNumber = talents.indexOf(char);
                if (talentNumber < 0) talentNumber = talents.indexOf(parseInt(char));
                var row = Math.floor(talentNumber / 4);
                var column = talentNumber % 4;

                if (userSpentPoints[currentSpecName] == undefined) userSpentPoints[currentSpecName] = [];
                if (userSpentPoints[currentSpecName][row] == undefined) userSpentPoints[currentSpecName][row] = [];
                if (userSpentPoints[currentSpecName][row][column] == undefined) userSpentPoints[currentSpecName][row][column] = 0;
                userSpentPoints[currentSpecName][row][column]++;
                var key = className + ':' +
                currentSpecName + ':' +
                row + ':' +
                column + ':' +
                userSpentPoints[currentSpecName][row][column];
                userPointHistory.push(key);
            }

            // Build tables
            Object.keys(userSpentPoints).forEach(function(specName) {
                var tableElement = self.element.querySelector('.talentTable[data-spec="' + specName + '"]');
                if (tableElement != null) {
                    self.buildSpec(parseInt(tableElement.dataset.specNumber), className, specName);
                } else {
                    var tableElements = self.element.getElementsByClassName('talentTable');
                    self.buildSpec(tableElements.length, className, specName);
                }

                Object.keys(userSpentPoints[specName]).forEach(function(row) {
                    var rowData = userSpentPoints[specName][row];
                    Object.keys(rowData).forEach(function(column) {
                        var talentAnchor = self.element.querySelector('.talentAnchor[data-spec="' + specName + '"][data-row="' + row + '"][data-column="' + column + '"]');
                        if (talentAnchor != null) {
                            self.updateTalentAnchor(talentAnchor, rowData[column]);
                        }
                    });
                });
            });

            this.userPointHistory = userPointHistory;
            this.userSpentPoints = userSpentPoints;

            Object.keys(this.talentData[this.className]).forEach(function(specName) {
                self.updateTalentTableHeader(specName);
            });

            this.updateLocks();
            this.userPointHistoryUpdateEvent();
        }

        if (params['g'] != undefined) {
            var glyphString = params['g'];

            var majors = ['A','B','C'];
            var minors = ['D','E','F'];
            var currentGlyphType = '';
            var currentGlyphPosition = -1;
            var currentString = '';
            var itemId = null;
            for (i = 0; i < glyphString.length; i++) {
                char = glyphString[i];
                if (majors.indexOf(char) >= 0 ||
                    minors.indexOf(char) >= 0) {

                    if (currentString.length > 0) {
                        itemId = Object.keys(this.glyphsData[className][currentGlyphType])[parseInt(currentString)];
                        userGlyphs[currentGlyphType][currentGlyphPosition] = parseInt(itemId);
                        currentString = '';
                    }

                    if (majors.indexOf(char) >= 0) {
                        currentGlyphType = 'major';
                        currentGlyphPosition = majors.indexOf(char);
                    } else if (minors.indexOf(char) >= 0) {
                        currentGlyphType = 'minor';
                        currentGlyphPosition = minors.indexOf(char);
                    }
                    continue;
                }

                currentString += char;
            }
            if (currentString.length > 0) {
                itemId = Object.keys(this.glyphsData[className][currentGlyphType])[parseInt(currentString)];
                userGlyphs[currentGlyphType][currentGlyphPosition] = parseInt(itemId);
            }

            this.buildGlyphTable(className);
            this.userGlyphs = userGlyphs;

            Object.keys(userGlyphs).forEach(function(glyphType) {
                i = 0;
                userGlyphs[glyphType].forEach(function(itemId) {
                    var glyphParams = {
                        id: itemId,
                        class: className,
                        type: glyphType,
                        position: i++
                    };
                    self.updateUserGlyph(glyphParams);
                });
            });

            this.userGlyphsUpdateEvent();
        }
    }
    
    getParamsFromString(paramString) {
        if (paramString.indexOf('=') == -1) return null;
        var stringSplit = paramString.split('?');
        paramString = (stringSplit.length >= 2) ? stringSplit[1] : stringSplit[0];
        var paramStringSplit = paramString.split('&');

        var params = {};

        for (var i = 0; i < paramStringSplit.length; i++) {
            var paramPair = paramStringSplit[i].split('=');
            if (paramPair.length != 2) throw 'Invalid parameter string format';
            params[paramPair[0]] = paramPair[1];
        }

        return params;
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

    userGlyphsUpdateEvent() {
        var self = this;
        this.userGlyphsUpdateEventSubscribers.forEach(function(callback) {
            callback(self.userGlyphs);
        });
    }

    subscribeToUserGlyphsUpdateEvent(object, callback) {
        this.userGlyphsUpdateEventSubscribers.push(callback.bind(object));
    }

    userClassUpdateEvent() {
        var self = this;
        this.userClassUpdateEventSubscribers.forEach(function(callback) {
            callback(self.className);
        });
    }

    subscribeToUserClassUpdateEvent(object, callback) {
        this.userClassUpdateEventSubscribers.push(callback.bind(object));
    }
}