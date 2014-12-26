define(['durandal/system', 'plugins/router', 'services/logger'],
    function (system, router, logger) {
        var shell = {
            activate: activate,
            router: router
        };

        return shell;

        //#region Internal Methods
        function activate() {
            return boot();
        }

        function boot() {
            log('My Contacts Loaded!', null, true);

            router.on('router:route:not-found', function (fragment) {
                logError('No Route Found', fragment, true);
            });

            var routes = [
                { route: '', moduleId: 'contact/contacts', title: 'Contacts', nav: 1 },
                { route: 'contactadd', moduleId: 'contact/contactadd', title: 'Add a contact ', nav: 0 },
                { route: 'contactedit/:id', moduleId: 'contact/contactedit', title: 'Edit', nav: 0 },
                { route: 'user', moduleId: 'user/users', title: 'User', nav: 2 },
                { route: 'useradd', moduleId: 'user/useradd', title: 'User add', nav: 0 },
                { route: 'useredit/:id', moduleId: 'user/useredit', title: 'User edit', nav: 0 },
                { route: 'issue', moduleId: 'issue/issues', title: 'Issue', nav: 3 },
                { route: 'issueadd', moduleId: 'issue/issueadd', title: 'Issue add', nav: 0 },
                { route: 'issueedit/:id', moduleId: 'issue/issueedit', title: 'Issue edit', nav: 0 }
                ];

            return router.makeRelative({ moduleId: 'viewmodels' }) // router will look here for viewmodels by convention
                .map(routes)            // Map the routes
                .buildNavigationModel() // Finds all nav routes and readies them
                .activate();            // Activate the router
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }

        function logError(msg, data, showToast) {
            logger.logError(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion
    });