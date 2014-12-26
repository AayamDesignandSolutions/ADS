define(['services/logger', 'services/user/userdatacontext', 'plugins/router'], function (logger, userdatacontext, router) {
    var users = ko.observableArray();
    var searchName = ko.observable();
    var title = 'Users';


    //Activate method will call while page loading
    function activate() {
        var result = userdatacontext.getAllUserDetails(users);
        
        logger.log(title + ' View Activated', null, title, true);
        return true;
    }
    //Deactivate method will call while page unloading
    var deactivate = function () {
        users([]);
    };

    //#region This method will catch user click the contact from the list
    var attached = function (view) {
        bindEventToList(view, '.contact-content', gotoDetails);
    }

    var bindEventToList = function (rootSelector, selector, callback) {
        var eName = 'click';
        $(rootSelector).on(eName, selector, function () {
            var user = ko.dataFor(this);
            callback(user);
            return false;
        });
    }

    var gotoDetails = function (selectedUser) {

        if (selectedUser && selectedUser.id()) {
            var url = '#/useredit/' + selectedUser.id();
            router.navigate(url);

        }
    }

    var addUser = function () {
            var url = '#/useradd/';
            router.navigate(url);
    }
    //endregion


    //Search Command
    var search = function () {
        userdatacontext.getAllUserDetailsWithSearch(users, searchName());

    };

    //Cancel Search
    var clearSearch = function () {
        userdatacontext.getAllUserDetails(users);
        searchName('');
    };

    //ViewModel Properties, Method and Command object
    var vm = {
        activate: activate,
        deactivate: deactivate,
        users: users,
        title: title,
        attached: attached,
        search: search,
        searchName: searchName,
        clearSearch: clearSearch,
        addUser: addUser
    };

    return vm;
});