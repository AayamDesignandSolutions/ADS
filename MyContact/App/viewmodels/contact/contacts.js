define(['services/logger', 'services/contact/contactdatacontext', 'plugins/router'], function (logger, contactdatacontext, router) {
    var contacts = ko.observableArray();
    var selectedcontact = ko.observable();
    var searchName = ko.observable();
    var title = 'Contacts';
    var isSaving = ko.observable(false);

    //Activate method will call while page loading
    function activate() {
      
        var result = contactdatacontext.getAllContactDetails(contacts);
        logger.log(title + ' View Activated', null, title, true);
        return true;
    }
    //Deactivate method will call while page unloading
    var deactivate = function () {
        contacts([]);
    };

    //#region This method will catch user click the contact from the list
    var attached = function (view) {
        bindEventToList(view, '.contact-content', gotoDetails);
    }

    var bindEventToList = function (rootSelector, selector, callback) {
        var eName = 'click';
        $(rootSelector).on(eName, selector, function () {
            var contact = ko.dataFor(this);
            callback(contact);
            return false;
        });
    }

    var gotoDetails = function (selectedContact) {
        if (selectedContact && selectedContact.id()) {
            contactdatacontext.getAContactDetail(selectedContact.id(), selectedcontact);
            $('#edited-article').modal("show");
        }
    }
    

    var addContact = function () {
        title = 'Add Contact';
        contactdatacontext.createContact(selectedcontact);
        $('#edited-article').modal("show");


            //var url = '#/contactadd/';
            //router.navigate(url);
    }
    //Search Command
    var search = function () {
        contactdatacontext.getAllContactDetailsWithSearch(contacts, searchName());

    };

    //Cancel Search
    var clearSearch = function () {
        contactdatacontext.getAllContactDetails(contacts);
        searchName('');
    };
    
    //------------------------------ Contact Add-----------------------------------------------
    //Cancel Command
    var cancel = function (complete) {
        contactdatacontext.getAllContactDetails(contacts);
        $('#edited-article').modal("hide");
    };


    var hasChanges = ko.computed(function () {

        return contactdatacontext.hasChanges();
    });

   


    //Save Command
    var save = function () {
        isSaving(true);
        contactdatacontext.saveChanges()
            .then(goToEditView).fin(complete);

        function goToEditView(result) {
            contactdatacontext.getAllContactDetails(contacts);
            $('#edited-article').modal("hide");
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
                        contactdatacontext.cancelChanges();

                    }
                    return selectedOption;
                });
        }
        return true;
    }
    //------------------------------ Contact Add-----------------------------------------------

  

    //ViewModel Properties, Method and Command object
    var vm = {
        activate: activate,
        deactivate: deactivate,
        contacts: contacts,
        title: title,
        attached: attached,
        search: search,
        searchName: searchName,
        clearSearch: clearSearch,
        addContact: addContact,
        canSave: canSave,
        cancel: cancel,
        hasChanges: hasChanges,
        save: save,
        selectedcontact: selectedcontact
    };

    return vm;
});