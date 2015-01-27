define(['services/logger', 'services/issue/issuedatacontext',  'plugins/router', 'plugins/dialog'], function (logger, issuedatacontext, router, app) {
    var issue = ko.observable();
    var issueUsers = ko.observable();
    var title = 'Add Issue';
    var isSaving = ko.observable(false);

    //Cancel Command
    var cancel = function (complete) {
        router.navigateBack();
    };


    var hasChanges = ko.computed(function () {

        return issuedatacontext.hasChanges();
    });

    //Activate method will call while page loading
    function activate() {
        initLookups();
        issuedatacontext.createIssue(issue);
    }
    //Deactivate method will call while page unloading
    var deactivate = function () {

    };

    initLookups = function () {
        var result = issuedatacontext.getAllUserDetails(issueUsers);
        logger.log(title + ' Issue data fetched', null, title, true);
    }

    //Save Command
    var save = function () {
        isSaving(true);
   
        issuedatacontext.saveChanges()
            .then(goToEditView).fin(complete);

        function goToEditView(result) {
            
            router.navigate('issue');
        }

        function complete() {
            isSaving(false);
        }
    };
    var canSave = ko.computed(function () {

        return hasChanges() && !isSaving();
    });

    //This method will call deactivate, pop message box will display for getting confirmation.
    var canDeactivate = function () {
        if (hasChanges()) {
            var msg = 'Do you want to leave and cancel?';
            return app.showMessage(msg, title, ['Yes', 'No'])
                .then(function (selectedOption) {
                    if (selectedOption === 'Yes') {
                        issuedatacontext.cancelChanges();

                    }
                    return selectedOption;
                });
        }
        return true;
    }

    //ViewModel Properties, Method and Command object
    var vm = {
        activate: activate,
        canDeactivate: canDeactivate,
        deactivate: deactivate,
        issue: issue,
        issueUsers: issueUsers,
        title: title,
        canSave: canSave,
        cancel: cancel,
        hasChanges: hasChanges,
        save: save
    };

    return vm;
});