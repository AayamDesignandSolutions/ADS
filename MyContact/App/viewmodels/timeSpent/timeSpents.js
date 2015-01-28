define(['services/logger', 'services/timeSpent/timeSpentdatacontext', 'plugins/router'], function (logger, timeSpentdatacontext, router) {
    var self = this;
    var timeSpents = ko.observableArray();
    var searchName = ko.observable();
    var title = 'Time Spent';


   

    //Activate method will call while page loading
    function activate() {
      
        var result = timeSpentdatacontext.getAllTimeSpentDetails(timeSpents);
        

        logger.log(title + ' View Activated', null, title, true);
        return true;
    }
    //Deactivate method will call while page unloading
    var deactivate = function () {
        timeSpents([]);
    };

    //#region This method will catch issue click the contact from the list
    var attached = function (view) {
        bindEventToList(view, '.contact-content', gotoDetails);
    }

    var bindEventToList = function (rootSelector, selector, callback) {
        var eName = 'click';
        $(rootSelector).on(eName, selector, function () {
            var timeSpent = ko.dataFor(this);
            callback(timeSpent);
            return false;
        });
    }

    var gotoDetails = function (selectedTimeSpent) {

        if (selectedTimeSpent && selectedTimeSpent.id()) {
            var url = '#/timeSpentedit/' + selectedTimeSpent.id();
            router.navigate(url);

        }
    }

    var addTimeSpent = function () {
        var url = '#/timeSpentadd/';
            router.navigate(url);
    }
    //endregion


    //Search Command
    var search = function () {
        timeSpentdatacontext.getAllTimeSpentDetailsWithSearch(timeSpents, searchName());

    };

    //Cancel Search
    var clearSearch = function () {
        timeSpentdatacontext.getAllTimeSpentDetails(timeSpents);
        searchName('');
    };

    
    //ViewModel Properties, Method and Command object
    var vm = {
        activate: activate,
        deactivate: deactivate,
        timeSpents: timeSpents,
        title: title,
        attached: attached,
        search: search,
        searchName: searchName,
        clearSearch: clearSearch,
        addTimeSpent: addTimeSpent
    };

    return vm;
});