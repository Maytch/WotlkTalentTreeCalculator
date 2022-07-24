class TalentTreeHistory {
    id;
    element;
    talentHistoryList;
    talentTreeCalculator;
    baseUrl = './/Images//';
    userPointHistory = [];

    constructor(target, talentTreeCalculator, baseUrl) {
        if (!target) throw 'Could not construct TalentTreeHistory: Element not found';
        this.talentTreeCalculator = talentTreeCalculator;
        this.initTalentTreeHistory(target);
        if (baseUrl != undefined) this.baseUrl = baseUrl;
    }

    initTalentTreeHistory(target) {
        var otherCount = document.getElementsByClassName("talentTreeHistory").length;
        this.id = "talentTreeHistory" + otherCount;

        var talentTreeHistory = target.appendChild(document.createElement('div'));
        talentTreeHistory.id = this.id;
        talentTreeHistory.classList.add('talentTreeHistory');
        this.element = document.getElementById(this.id);

        var header = talentTreeHistory.appendChild(document.createElement('div'));
        header.classList.add('talentTreeHistoryHeader');
        header.innerText = "Talent Order";

        var talentHistoryList = this.element.appendChild(document.createElement('div'));
        talentHistoryList.classList.add('talentHistoryList');
        this.talentHistoryList = talentHistoryList;
    }

    updateUserPointHistory(userPointHistory) {
        var self = this;
        this.userPointHistory = userPointHistory;

        var talentHistoryElements = this.element.querySelector('.talentHistory');
        if (talentHistoryElements == null) talentHistoryElements = [];
        var keyedTalentHistoryElements = {};
        Array.prototype.forEach.call(talentHistoryElements, function(talentHistoryElement) {
            var key = talentHistoryElement.dataset.class + ':' + 
                talentHistoryElement.dataset.spec + ':' + 
                talentHistoryElement.dataset.row + ':' + 
                talentHistoryElement.dataset.column + ':' + 
                talentHistoryElement.dataset.rank;
            keyedTalentHistoryElements[key] = talentHistoryElement;
        });

        var talentHistoryElement;
        var orderedTalentHistoryElements = [];
        var i = 10;
        this.userPointHistory.forEach(function (userPoint) {
            if (keyedTalentHistoryElements[userPoint] != undefined) {
                talentHistoryElement = keyedTalentHistoryElements[userPoint];
                talentHistoryElement.getElementsByClassName('talentNumber')[0].innerText = i;
                orderedTalentHistoryElements.push(talentHistoryElement);
            } else {
                talentHistoryElement = self.createTalentHistoryElement(i, userPoint);
                orderedTalentHistoryElements.push(talentHistoryElement);
            }
            i++;
        });

        this.talentHistoryList.innerHTML = null;
        orderedTalentHistoryElements.forEach(function (talentHistoryElement) {
            self.talentHistoryList.appendChild(talentHistoryElement);
        });
    }

    createTalentHistoryElement(number, userPoint) {
        var self = this;
        var params = this.getTalentParams(userPoint);
        var talentData = this.talentTreeCalculator.getTalentData(params);

        var talentContainer = document.createElement('div');
        talentContainer.classList.add('talentHistory');
        talentContainer.dataset.class = params.class;
        talentContainer.dataset.spec = params.spec;
        talentContainer.dataset.row = params.row;
        talentContainer.dataset.column = params.column;
        talentContainer.dataset.rank = params.rank;

        var talentAnchor = talentContainer.appendChild(document.createElement('div'));
        talentAnchor.classList.add('talentAnchor');
        talentAnchor.addEventListener("mouseenter", function(event) {
            var talentHistory = event.target.classList.contains('talentHistory') ? event.target : event.target.closest('.talentHistory');
            var params = {
                class: talentHistory.dataset.class,
                spec: talentHistory.dataset.spec,
                row: parseInt(talentHistory.dataset.row),
                column: parseInt(talentHistory.dataset.column),
                rank: parseInt(talentHistory.dataset.rank),
                detailed: false
            };
            self.talentTreeCalculator.showTooltip(params);
            self.talentTreeCalculator.positionTooltip(self.element, event.target);
        });

        talentAnchor.addEventListener("mouseleave", function(event) {
            self.talentTreeCalculator.hideTooltip();
        });

        var talentNumber = talentAnchor.appendChild(document.createElement('div'));
        talentNumber.classList.add('talentNumber');
        talentNumber.innerText = number;

        var talentImg = talentAnchor.appendChild(document.createElement('div'));
        talentImg.classList.add("talentImg");

        var imageName = talentData.icon;
        talentImg.style.backgroundImage = "url('" + this.baseUrl + "//" + imageName;

        var talentDescription = talentAnchor.appendChild(document.createElement('div'));
        talentDescription.classList.add('talentName');
        talentDescription.innerText = talentData.name;

        var talentRank = talentAnchor.appendChild(document.createElement('div'));
        talentRank.classList.add('talentRank');
        talentRank.innerText = 'Rank ' + params.rank;

        return talentContainer;
    }

    getTalentParams(userPoint) {
        var split = userPoint.split(':');
        return {
            class: split[0],
            spec: split[1],
            row: split[2],
            column: split[3],
            rank: split[4]
        };
    }
}