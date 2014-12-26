define(['services/logger', 'services/issue/issuedatacontext', 'plugins/router'], function (logger, issuedatacontext, router) {
    var self = this;
    var issues = ko.observableArray();
    var searchName = ko.observable();
    var title = 'Issues';


   

    //Activate method will call while page loading
    function activate() {
        var result = issuedatacontext.getAllIssueDetails(issues);
        alert(result);
        alert(result.length);

        logger.log(title + ' View Activated', null, title, true);
        return true;
    }
    //Deactivate method will call while page unloading
    var deactivate = function () {
        issues([]);
    };

    //#region This method will catch issue click the contact from the list
    var attached = function (view) {
        bindEventToList(view, '.contact-content', gotoDetails);
    }

    var bindEventToList = function (rootSelector, selector, callback) {
        var eName = 'click';
        $(rootSelector).on(eName, selector, function () {
            var issue = ko.dataFor(this);
            callback(issue);
            return false;
        });
    }

    var gotoDetails = function (selectedIssue) {

        if (selectedIssue && selectedIssue.id()) {
            var url = '#/issueedit/' + selectedIssue.id();
            router.navigate(url);

        }
    }

    var addIssue = function () {
            var url = '#/issueadd/';
            router.navigate(url);
    }
    //endregion


    //Search Command
    var search = function () {
        issuedatacontext.getAllIssueDetailsWithSearch(issues, searchName());

    };

    //Cancel Search
    var clearSearch = function () {
        issuedatacontext.getAllIssueDetails(issues);
        searchName('');
    };

    
    //ViewModel Properties, Method and Command object
    var vm = {
        activate: activate,
        deactivate: deactivate,
        issues: issues,
        title: title,
        attached: attached,
        search: search,
        searchName: searchName,
        clearSearch: clearSearch,
        addIssue: addIssue
    };

    return vm;
});