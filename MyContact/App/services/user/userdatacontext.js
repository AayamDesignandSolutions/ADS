
define([
    'durandal/system',
    'services/user/model',
     'config',
    'services/logger',
    'services/breeze.partial-entities',
    'plugins/router'],
    function (system, model, config, logger, partialMapper, router) {
        var EntityQuery = breeze.EntityQuery;
        var manager = configureBreezeManager();
        var orderBy = model.orderBy;
        var entityNames = model.entityNames;

        //This method get all the users available in the database and load the data into convtactObservable variable.
        //Knockout framework will communicate these information to UI (html)
        var getAllUserDetails = function (userObservable) {
       
            var query = EntityQuery.from('Users')
                .select('id, userName, password, active')
                .orderBy('id');
           
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.user, 'id');

                if (userObservable) {
                    userObservable(list);
                }
                log('Retrieved [' + entityNames.user + '] from remote data source',
                    data, true);
             
            }
        };

        //This method get all the users available in the database and load the data into convtactObservable variable.        
        var getAllUserDetailsWithSearch = function (userObservable, search) {

            var query = EntityQuery.from('Users')
                .select('id, userName, password, active')
                .where('name', 'substringof', search)
                .orderBy('id');
           
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.user, 'id');

                if (userObservable) {
                    userObservable(list);
                }
                log('Retrieved [' + entityNames.user + '] from remote data source',
                    data, true);

            }
        };

        //Metabase will sync with model.js 
        function configureBreezeManager() {
            breeze.NamingConvention.camelCase.setAsDefault();
            var mgr = new breeze.EntityManager(config.remoteServiceName);
            
            model.configureMetadataStore(mgr.metadataStore);
           
            return mgr;
        }

        //This method create empty user object and send to the view
        var createUser = function (user) {
            //hasMetadataFor  will get call while useradd.html call in the very first time.
            //Bacause model.js is not know the metadata object while calling createUser funtion in the very first time
            if (!manager.metadataStore.hasMetadataFor(config.remoteServiceName)) {
                manager.metadataStore.fetchMetadata(config.remoteServiceName, fetchMetadataSuccess, fetchMetadataSuccess);
            } else {
                user(manager.createEntity(entityNames.user));
            }

            function fetchMetadataSuccess(rawMetadata) {
                user(manager.createEntity(entityNames.user));
            }

            function fetchMetadataFail(exception) {

            }
        };


        //This method save the modified/added user to the datatabase with the help of Breeze framework.        
        var saveChanges = function () {
            return manager.saveChanges()
                .then(saveSucceeded)
                .fail(saveFailed);

            function saveSucceeded(saveResult) {
                log('Saved data Successfully', saveResult, true);
            }

            function saveFailed(error) {
                var message = 'Save Failed: ' + getErrorMessages(error);
                logError(message, error);
                error.message = message;
                throw error;
            }
        };

        //This method cancel the change set managed by the breeze
        var cancelChanges = function () {
            manager.rejectChanges();
            log('Canceled changes', null, true);
        }


        ////////////////////////
        function getErrorMessages(error) {
            var msg = error.message;
            if (msg.match(/see the entityErrors collection/i)) {//Artha
                return getValidationMessages(error);
            }
            return msg;
        }

        function getValidationMessages(error) {
            try {
                //foreach entity with a validation error
                return error.entityErrors.map(function (entity) {
                    // return the error message from the validation
                    return entity.errorMessage;
                }).join('; <br/>');
            }
            catch (e) { alert('[userdatacontext.js] getValidationMessages : ' + e.message); }
            return 'validation error';
        }

        function queryFailed(error) {
            alert(error.message);
            var msg = '[userdatacontext.js] Error retrieving data. ' + error.message;
            logError(msg, error);
            throw error;
        }


        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(userdatacontext), showToast);
        }

        function logError(msg, error) {
            logger.logError(msg, error, system.getModuleId(userdatacontext), true);
        }
        ////////////////////////


        //This property help to find the database hasChanges
        var hasChanges = ko.observable(false);


        manager.hasChangesChanged.subscribe(function (eventArgs) {
        
            hasChanges(eventArgs.hasChanges);
        });


        //This method call the breeze api service and get a request user for edit
        var getAUserDetail = function (userId, userObservable) {

            return manager.fetchEntityByKey(
               entityNames.user, userId, true)
               .then(fetchSucceeded)
               .fail(queryFailed);

            function fetchSucceeded(data) {
                var s = data.entity;
                return s.isPartial() ? refreshuser(s) : userObservable(s);
            }

            function refreshuser(user) {
                return EntityQuery.fromEntities(user)
                    .using(manager).execute()
                    .then(querySucceeded)
                    .fail(queryFailed);
            }

            function querySucceeded(data) {
                var s = data.results[0];
                s.isPartial(false);
                log('Retrieved [' + entityNames.user + '] from remote data source', s, true);
                return userObservable(s);
            }
        };


        ///Properties, Methods
        var userdatacontext = {
            hasChanges: hasChanges,
            saveChanges: saveChanges,
            cancelChanges: cancelChanges,
            getAllUserDetails: getAllUserDetails,
            createUser: createUser,
            getAUserDetail: getAUserDetail,
            getAllUserDetailsWithSearch: getAllUserDetailsWithSearch
        };

        return userdatacontext;
    });
