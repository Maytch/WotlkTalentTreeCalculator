class TalentTreeProfiles {
    id;
    element;
    talentTreeCalculator;
    className;
    maxProfiles = 3;

    constructor(target, talentTreeCalculator, maxProfiles) {
        if (!target) throw 'Could not construct TalentTreeProfiles: Element not found';
        this.talentTreeCalculator = talentTreeCalculator;
        this.initTalentTreeProfiles(target);
        if (maxProfiles != undefined) this.maxProfiles = maxProfiles;
    }

    initTalentTreeProfiles(target) {
        var self = this;
        var otherCount = document.getElementsByClassName("talentTreeProfiles").length;
        this.id = "talentTreeProfiles" + otherCount;

        var talentTreeProfiles = target.appendChild(document.createElement('div'));
        talentTreeProfiles.id = this.id;
        talentTreeProfiles.classList.add('talentTreeProfiles');
        this.element = document.getElementById(this.id);

        var talentTreeProfilesContainer = this.element.appendChild(document.createElement('div'));
        talentTreeProfilesContainer.classList.add('talentTreeProfilesContainer');

        for (var i = 0; i < this.maxProfiles; i++) {
            this.initProfile(i, talentTreeProfilesContainer);
        }
    }

    initProfile(number, talentTreeProfilesContainer) {
        var self = this;

        var talentTreeProfileContainer = talentTreeProfilesContainer.appendChild(document.createElement('div'));
        talentTreeProfileContainer.classList.add('talentTreeProfileContainer');
        talentTreeProfileContainer.dataset.number = number;
        talentTreeProfileContainer.dataset.name = '';
        talentTreeProfileContainer.dataset.params = '';
        
        var talentTreeProfileName = talentTreeProfileContainer.appendChild(document.createElement('input'));
        talentTreeProfileName.classList.add('talentTreeProfileName');
        talentTreeProfileName.placeholder = "Blank Save Profile";

        var talentTreeProfileButtons = talentTreeProfileContainer.appendChild(document.createElement('div'));
        talentTreeProfileButtons.classList.add('talentTreeProfileButtons');

        var talentTreeProfileSave = talentTreeProfileButtons.appendChild(document.createElement('div'));
        talentTreeProfileSave.classList.add('talentTreeProfileSave');
        talentTreeProfileSave.innerText = "Save";
        talentTreeProfileSave.addEventListener('click', function(event) {
            var element = event.target.classList.contains('talentTreeProfileSave') ? 
                event.target : 
                event.target.closest('.talentTreeProfileSave');

            var container = element.closest('.talentTreeProfileContainer');
            var success = self.saveProfile(container.dataset.number, talentTreeProfileName.value);
            if (success) {
                element.innerText = "Saved!";
                element.classList.add('clicked');
    
                window.setTimeout(function() {
                    element.classList.remove('clicked');
                    element.innerText = "Save";
                }, 1000);
            }
        });

        var talentTreeProfileLoad = talentTreeProfileButtons.appendChild(document.createElement('div'));
        talentTreeProfileLoad.classList.add('talentTreeProfileLoad');
        talentTreeProfileLoad.innerText = "Load";
        talentTreeProfileLoad.addEventListener('click', function(event) {
            var element = event.target.classList.contains('talentTreeProfileLoad') ? 
                event.target : 
                event.target.closest('.talentTreeProfileLoad');

            var container = element.closest('.talentTreeProfileContainer');
            var success = self.loadProfile(container.dataset.params);
            if (success) {
                element.classList.add('clicked');
                element.innerText = "Loaded!";

                window.setTimeout(function() {
                    element.classList.remove('clicked');
                    element.innerText = "Load";
                }, 1000);
            }
            
        });
    }

    updateUserClass(className) {
        this.className = className;
        this.showProfiles();
    }

    showProfiles() {
        var classProfiles = [];

        var profilesString = localStorage.getItem("talentTreeProfiles");
        if (profilesString != null && profilesString.length > 0) {
            var talentTreeProfiles = JSON.parse(profilesString);
            if (talentTreeProfiles[this.className] !== undefined) {
                classProfiles = talentTreeProfiles[this.className];
            }
        }

        var containers = this.element.getElementsByClassName('talentTreeProfileContainer');

        var name;
        for (var i = 0; i < containers.length; i++) {
            if (classProfiles[i] == undefined) {
                containers[i].dataset.name = '';
                containers[i].dataset.params = '';
                name = containers[i].getElementsByClassName('talentTreeProfileName')[0];
                name.value = null;
            } else {
                containers[i].dataset.name = classProfiles[i].name;
                containers[i].dataset.params = classProfiles[i].params;
    
                name = containers[i].getElementsByClassName('talentTreeProfileName')[0];
                name.value = classProfiles[i].name;
            }
        }
    }

    saveProfile(number, profileName) {
        if (profileName.length == 0) return false;

        var profilesString = localStorage.getItem("talentTreeProfiles");
        var talentTreeProfiles = (profilesString == null || profilesString.length == 0) ? 
            {} : JSON.parse(profilesString);

        if (talentTreeProfiles[this.className] == undefined) {
            talentTreeProfiles[this.className] = [];
        }

        var params = this.talentTreeCalculator.exportToUrl();
        talentTreeProfiles[this.className][number] = {
            "name": profileName,
            "params": params
        };
        localStorage.setItem("talentTreeProfiles", JSON.stringify(talentTreeProfiles));

        var container = this.element.querySelector('.talentTreeProfileContainer[data-number="' + number + '"]');
        container.dataset.number = number;
        container.dataset.name = profileName;
        container.dataset.params = params;

        return true;
    }

    loadProfile(params) {
        if (params.length == 0) return false;

        this.talentTreeCalculator.importFromUrl(params);

        return true;
    }
}