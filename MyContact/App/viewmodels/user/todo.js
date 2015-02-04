define(['services/logger', 'services/user/userdatacontext', 'plugins/router'], function (logger, userdatacontext, router) {
    var users = ko.observableArray();
    var searchUser = ko.observable();
    var toDouser = ko.observable();
    var toDos = ko.observableArray();
    var currentUsers = ko.observableArray();

    var title = 'To Do';


    //Activate method will call while page loading
    function activate() {
       
        var result = userdatacontext.getAllUserDetailsWithTodo(users);
        var r1 = userdatacontext.getCurrentUser(searchUser);
         
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
            var url = '#/issueedit/' + selectedUser.id();
            router.navigate(url);

        }
    }

    var addUser = function () {
            var url = '#/useradd/';
            router.navigate(url);
    } 
    var addIssue = function () {
        var url = '#/issueadd/';
            router.navigate(url);
    }
    //endregion


    //Search Command
    var loadTodo = function () {
     
        toDos.removeAll();
        ko.utils.arrayForEach(users(), function (user) {
          
            if (user.id() == searchUser().id()) {
                toDouser = user;
              
                ko.utils.arrayForEach(toDouser.issues(), function (issue) {
                    toDos.push(issue);
                  
                });
            }
        });

        //toDos = ko.computed(function () {
        //    return ko.utils.arrayFilter(users(), function (user) {
        //        if (user.id() == searchUser().id()) {
        //            return user;
        //        }
        //    });
        //});
     

        };

    //Cancel Search
    var clearSearch = function () {
        userdatacontext.getAllUserDetails(users);
        searchUser('');
    };

    //ViewModel Properties, Method and Command object
    var vm = {
        activate: activate,
        deactivate: deactivate,
        users: users,
        toDos: toDos,
        title: title,
        attached: attached,
        loadTodo: loadTodo,
        searchUser: searchUser,
        clearSearch: clearSearch,
        addUser: addUser,
        addIssue: addIssue
    };

    return vm;
});