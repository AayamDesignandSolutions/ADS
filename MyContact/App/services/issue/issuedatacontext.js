
define([
    'durandal/system',
    'services/issue/model',
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
        var getAllIssueDetails = function (issueObservable) {

            var query = EntityQuery.from('Issues')
                .select('id,issueSubject,issueDetails,assignedTo,createdDate,user')
                .orderBy('id');
           
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

           

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.issue, 'id');

                if (issueObservable) {
                    issueObservable(list);
                }
                log('Retrieved [' + entityNames.issue + '] from remote data source',
                    data, true);

            }
        };

        //This method get all the users available in the database and load the data into convtactObservable variable.        
        var getAllIssueDetailsWithSearch = function (issueObservable, search) {

            var query = EntityQuery.from('Issues')
                .select('id,issueSubject,issueDetails,assignedTo,createdDate,user')
                .where('issueSubject', 'substringof', search)
                .orderBy('id');
           
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.issue, 'id');

                if (issueObservable) {
                    issueObservable(list);
                }
                log('Retrieved [' + entityNames.issueSubject + '] from remote data source',
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

        //This method create empty issue object and send to the view
        var createIssue = function (issue) {
            //hasMetadataFor  will get call while useradd.html call in the very first time.
            //Bacause model.js is not know the metadata object while calling createUser funtion in the very first time
            if (!manager.metadataStore.hasMetadataFor(config.remoteServiceName)) {
                manager.metadataStore.fetchMetadata(config.remoteServiceName, fetchMetadataSuccess, fetchMetadataSuccess);
            } else {
                issue(manager.createEntity(entityNames.issue));
            }

            function fetchMetadataSuccess(rawMetadata) {
                issue(manager.createEntity(entityNames.issue));
            }

            function fetchMetadataFail(exception) {

            }
        };


        //This method save the modified/added issue to the datatabase with the help of Breeze framework.        
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
            catch (e) { alert('[issuedatacontext.js] getValidationMessages : ' + e.message); }
            return 'validation error';
        }

        function queryFailed(error) {
            alert(error.message);
            var msg = '[issuedatacontext.js] Error retrieving data. ' + error.message;
            logError(msg, error);
            throw error;
        }


        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(issuedatacontext), showToast);
        }

        function logError(msg, error) {
            logger.logError(msg, error, system.getModuleId(issuedatacontext), true);
        }
        ////////////////////////


        //This property help to find the database hasChanges
        var hasChanges = ko.observable(false);


        manager.hasChangesChanged.subscribe(function (eventArgs) {
        
            hasChanges(eventArgs.hasChanges);
        });


        //This method call the breeze api service and get a request issue for edit
        var getAIssueDetail = function (issueId, issueObservable) {

            return manager.fetchEntityByKey(
               entityNames.issue, issueId, true)
               .then(fetchSucceeded)
               .fail(queryFailed);

            function fetchSucceeded(data) {
                var s = data.entity;
                return s.isPartial() ? refreshissue(s) : issueObservable(s);
            }

            function refreshissue(issue) {
                return EntityQuery.fromEntities(issue)
                    .using(manager).execute()
                    .then(querySucceeded)
                    .fail(queryFailed);
            }

            function querySucceeded(data) {
                var s = data.results[0];
                s.isPartial(false);
                log('Retrieved [' + entityNames.issueSubject + '] from remote data source', s, true);
                return userObservable(s);
            }
        };


        ///Properties, Methods
        var issuedatacontext = {
            hasChanges: hasChanges,
            saveChanges: saveChanges,
            cancelChanges: cancelChanges,
            getAllIssueDetails: getAllIssueDetails,
            createIssue: createIssue,
            getAIssueDetail: getAIssueDetail,
            getAllIssueDetailsWithSearch: getAllIssueDetailsWithSearch
        };

        return issuedatacontext;
    });
