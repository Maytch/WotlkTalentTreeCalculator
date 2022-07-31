class TalentTreeClassSelector {
    id;
    element;
    talentTreeCalculator;

    constructor(target, talentTreeCalculator) {
        if (!target) throw 'Could not construct TalentTreeClassSelector: Element not found';
        this.talentTreeCalculator = talentTreeCalculator;
        this.initTalentTreeClassSelector(target);
    }

    initTalentTreeClassSelector(target) {
        var self = this;
        var otherCount = document.getElementsByClassName("talentTreeClassSelector").length;
        this.id = "talentTreeClassSelector" + otherCount;

        var talentTreeClassSelector = target.appendChild(document.createElement('div'));
        talentTreeClassSelector.id = this.id;
        talentTreeClassSelector.classList.add('talentTreeClassSelector');
        this.element = document.getElementById(this.id);

        var talentTreeClassContainer = this.element.appendChild(document.createElement('div'));
        talentTreeClassContainer.classList.add('talentTreeClassContainer');

        Object.keys(this.talentTreeCalculator.classData).forEach(function(className) {
            var classData = self.talentTreeCalculator.classData[className];
            var classAnchor = talentTreeClassContainer.appendChild(document.createElement('div'));
            classAnchor.classList.add('talentTreeClassAnchor');
            classAnchor.dataset.class = className;

            var classImg = classAnchor.appendChild(document.createElement('div'));
            classImg.classList.add('talentTreeClassImage');
            classImg.style.backgroundImage = self.talentTreeCalculator.getIconImageUrl(classData.icon);

            var classNameElement = classAnchor.appendChild(document.createElement('div'));
            classNameElement.classList.add('talentTreeClassName');
            classNameElement.innerText = classData.name;

            classAnchor.addEventListener('click', function(event) {
                var element = event.target.classList.contains('talentTreeClassAnchor') ? 
                    event.target : 
                    event.target.closest('.talentTreeClassAnchor');
                
                self.talentTreeCalculator.buildClass(element.dataset.class);
            });
        });

    }
}