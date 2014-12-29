define(['services/logger', 'services/user/userdatacontext', 'plugins/router', 'plugins/dialog'], function (logger, userdatacontext, router, app) {
    var user = ko.observable();
    var title = 'Add User';
    var isSaving = ko.observable(false);

    //Cancel Command
    var cancel = function (complete) {
        router.navigateBack();
    };


    var hasChanges = ko.computed(function () {

        return userdatacontext.hasChanges();
    });

    //Activate method will call while page loading
    function activate() {
        userdatacontext.createUser(user);
    }
    //Deactivate method will call while page unloading
    var deactivate = function () {

    };


    //Save Command
    var save = function () {
        isSaving(true);
        userdatacontext.saveChanges()
            .then(goToEditView).fin(complete);

        function goToEditView(result) {
            alert(router);
            router.navigate('user');
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
                        userdatacontext.cancelChanges();

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
        user: user,
        title: title,
        canSave: canSave,
        cancel: cancel,
        hasChanges: hasChanges,
        save: save
    };

    return vm;
});