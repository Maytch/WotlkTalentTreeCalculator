class TalentTreeHeader {
    id;
    element;
    baseUrl = window.location.href;
    talentTreeCalculator;
    className;

    constructor(target, talentTreeCalculator, baseUrl) {
        if (!target) throw 'Could not construct TalentTreeHeader: Element not found';
        this.talentTreeCalculator = talentTreeCalculator;
        this.initTalentTreeHeader(target);
        if (baseUrl != undefined) this.baseUrl = baseUrl;
    }

    initTalentTreeHeader(target) {
        var self = this;
        var otherCount = document.getElementsByClassName("talentTreeHeader").length;
        this.id = "talentTreeHeader" + otherCount;

        var talentTreeHeader = target.appendChild(document.createElement('div'));
        talentTreeHeader.id = this.id;
        talentTreeHeader.classList.add('talentTreeHeader');
        this.element = document.getElementById(this.id);

        var talentTreeHeaderContainer = this.element.appendChild(document.createElement('div'));
        talentTreeHeaderContainer.classList.add('talentTreeHeaderContainer');

        var talentTreeHeaderNameContainer = talentTreeHeaderContainer.appendChild(document.createElement('div'));
        talentTreeHeaderNameContainer.classList.add('talentTreeHeaderNameContainer');

        var classImg = talentTreeHeaderNameContainer.appendChild(document.createElement('div'));
        classImg.classList.add('talentTreeHeaderImage');

        var classNameElement = talentTreeHeaderNameContainer.appendChild(document.createElement('div'));
        classNameElement.classList.add('talentTreeHeaderName');

        var userPointsElement = talentTreeHeaderNameContainer.appendChild(document.createElement('div'));
        userPointsElement.classList.add('talentTreeHeaderPoints');
        userPointsElement.innerText = "[ 0 / 0 / 0 ]";
        
        var talentTreeHeaderLevelContainer = talentTreeHeaderContainer.appendChild(document.createElement('div'));
        talentTreeHeaderLevelContainer.classList.add('talentTreeHeaderLevelContainer');

        var talentTreeHeaderPointsLeftContainer = talentTreeHeaderContainer.appendChild(document.createElement('div'));
        talentTreeHeaderPointsLeftContainer.classList.add('talentTreeHeaderPointsLeftContainer');

        var talentTreeHeaderButtons = talentTreeHeaderContainer.appendChild(document.createElement('div'));
        talentTreeHeaderButtons.classList.add('talentTreeHeaderButtons');

        var talentTreeHeaderLink = talentTreeHeaderButtons.appendChild(document.createElement('div'));
        talentTreeHeaderLink.classList.add('talentTreeHeaderLink');
        talentTreeHeaderLink.innerText = "Link";
        talentTreeHeaderLink.addEventListener('click', function(event) {
            var urlString = self.talentTreeCalculator.exportToUrl();
            var url = new URL(self.baseUrl);

            url.searchParams.delete('c');
            url.searchParams.delete('t');
            url.searchParams.delete('g');

            var params = urlString.split('&');
            params.forEach(function(param) {
                var split = param.split('=');
                url.searchParams.set(split[0], split[1]);
            });
            navigator.clipboard.writeText(url);

            var element = event.target.classList.contains('talentTreeHeaderLink') ? 
                event.target : 
                event.target.closest('.talentTreeHeaderLink');
            element.innerText = "Copied";
            
            element.classList.add('clicked');
            window.setTimeout(function() {
                element.classList.remove('clicked');
                element.innerText = "Link";
            }, 1000);
        });

        var talentTreeHeaderImport = talentTreeHeaderButtons.appendChild(document.createElement('div'));
        talentTreeHeaderImport.classList.add('talentTreeHeaderImport');
        talentTreeHeaderImport.innerText = "Import";
        talentTreeHeaderImport.addEventListener('click', function(event) {
            var string = prompt("Enter parameter string to import");
            if (string.length > 0) {
                self.talentTreeCalculator.importFromUrl(string);
            }
        });
    }

    updateUserClass(className) {
        this.className = className;
        var classData = this.talentTreeCalculator.classData[className];
        
        var classImg = this.element.getElementsByClassName('talentTreeHeaderImage')[0];
        classImg.style.backgroundImage = self.talentTreeCalculator.getIconImageUrl(classData.icon);

        var classNameElement = this.element.getElementsByClassName('talentTreeHeaderName')[0];
        classNameElement.innerText = classData.name;
    }

    updateUserPoints(userPointHistory) {
        if (this.className == undefined) this.className = this.talentTreeCalculator.className;
        var classData = this.talentTreeCalculator.classData[this.className];

        var userPointsString = userPointHistory.join(',');

        var specPoints = [0, 0, 0];
        var i = 0;
        Object.keys(classData.specs).forEach(function(specName) {
            var count = userPointsString.split(specName).length - 1;
            specPoints[i] = count;
            i++;
        });

        var userPointsElement = this.element.getElementsByClassName('talentTreeHeaderPoints')[0];
        userPointsElement.innerText = "[ " + specPoints[0] + " / " + specPoints[1] + " / " + specPoints[2] + " ]";

        var talentTreeHeaderPointsLeftContainer = this.element.getElementsByClassName('talentTreeHeaderPointsLeftContainer')[0];
        talentTreeHeaderPointsLeftContainer.innerText = "Points Left: " + 
            (this.talentTreeCalculator.maxUserSpentPoints - userPointHistory.length);

        var talentTreeHeaderLevelContainer = this.element.getElementsByClassName('talentTreeHeaderLevelContainer')[0];
        talentTreeHeaderLevelContainer.innerText = "Level " + 
            (9 + userPointHistory.length);
    }
}