define(['services/logger', 'services/timeSpent/timeSpentdatacontext', 'plugins/router', 'plugins/dialog'], function (logger, timeSpentdatacontext, router, app) {
    var timeSpent = ko.observable();
    var users = ko.observable();
    var issues = ko.observable();
   
    var title = 'Add timeSpent';
    var isSaving = ko.observable(false);


   
    var loadIssues = function () {
        if (timeSpent().userId() > 0)
        {

            var result1 = timeSpentdatacontext.getAllIssuesForUser(issues, timeSpent().userId());
        }
    };

    //Cancel Command
    var cancel = function (complete) {
        router.navigateBack();
    };



    var hasChanges = ko.computed(function () {
      
        return timeSpentdatacontext.hasChanges();
    });

    //Activate method will call while page loading
    function activate() {
        initLookups();
        timeSpentdatacontext.createTimeSpent(timeSpent);
    }
    //Deactivate method will call while page unloading
    var deactivate = function () {

    };

    initLookups = function () {
        var result = timeSpentdatacontext.getAllUserDetails(users);
       // 
        logger.log(title + ' Issue data fetched', null, title, true);
    }

    //Save Command
    var save = function () {
        isSaving(true);
   
        timeSpentdatacontext.saveChanges()
            .then(goToEditView).fin(complete);

        function goToEditView(result) {
            
            router.navigate('timeSpent');
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
                        timeSpentdatacontext.cancelChanges();

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
        timeSpent: timeSpent,
        issues: issues,
        users: users,
        title: title,
        canSave: canSave,
        cancel: cancel,
        hasChanges: hasChanges,
        loadIssues: loadIssues,
        save: save
    };

    return vm;
});