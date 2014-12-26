define(['services/logger', 'services/contact/contactdatacontext', 'plugins/router'], function (logger, contactdatacontext, router) {
    var contacts = ko.observableArray();
    var searchName = ko.observable();
    var title = 'Contacts';


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
            var url = '#/contactedit/' + selectedContact.id();
            router.navigate(url);

        }
    }

    var addContact = function () {
            var url = '#/contactadd/';
            router.navigate(url);
    }
    //endregion


    //Search Command
    var search = function () {
        contactdatacontext.getAllContactDetailsWithSearch(contacts, searchName());

    };

    //Cancel Search
    var clearSearch = function () {
        contactdatacontext.getAllContactDetails(contacts);
        searchName('');
    };

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
        addContact: addContact
    };

    return vm;
});