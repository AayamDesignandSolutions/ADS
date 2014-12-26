define(['services/logger', 'services/user/userdatacontext', 'plugins/router', 'plugins/dialog'], function (logger, userdatacontext, router, app) {
    var user = ko.observable();
    var title = 'Edit User';
    var isSaving = ko.observable(false);

    //Cancel Command
    var cancel = function (complete) {
        router.navigateBack();
    };


    var hasChanges = ko.computed(function () {

        return userdatacontext.hasChanges();
    });



    //Activate method will call while page loading
    function activate(routeData) {

        if (!(routeData.toString() === ':id')) {
            
            userdatacontext.getAUserDetail(routeData, user);
        }
        else {

            userdatacontext.createUser(user);
        }


    }


    //Deactivate method will call while page unloading
    var deactivate = function () {

    };

    //Save command
    var save = function () {
        isSaving(true);
        userdatacontext.saveChanges()
            .then(goToEditView).fin(complete);

        function goToEditView(result) {
            router.navigate('user');
        }

        function complete() {
            isSaving(false);
        }
    };
    var canSave = ko.computed(function () {

        return hasChanges() && !isSaving();
    });

    //This method will call and get confirmation from user while page redirecting.
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