
define([
    'durandal/system',
    'services/timeSpent/model',
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
        var getAllTimeSpentDetails = function (timeSpentObservable) {
         

            var query = EntityQuery.from('TimeSpents')
                .select('id,issueId,userId,timeSpent1,onDate,issue.issueSubject, user.displayName ')
                .orderBy('id');
            
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

           

            function querySucceeded(data) {
                var list = [];
                for (i = 0; i < data.results.length; i++) {
                    list.push(data.results[i]);
                }
                //var list = partialMapper.mapDtosToEntities(
                //    manager, data.results, entityNames.timeSpent, 'id');
              
                if (timeSpentObservable) {
                    timeSpentObservable(list);
                }
             

            }
        };

        var getAllUserDetails = function (userObservable) {
         
            var query = EntityQuery.from('Users')
                .select('id, displayName, active')
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
                
                log('Retrieved [' + entityNames.user + '] from remote data source 2',
                    data, true);
              
            }
        };

       
        var getAllIssuesForUser = function (issueObservable,userId) {
         
            var query = EntityQuery.from('Issues')
                .select('id, issueSubject')
                .where('assignedTo', '==', userId)
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
                
                    log('Retrieved [' + entityNames.issue + '] from remote data source 2',
                        data, true);
              
                }
            };

        //This method get all the users available in the database and load the data into convtactObservable variable.        
        var getAllTimeSpentDetailsWithSearch = function (timeSpentObservable, search) {

            var query = EntityQuery.from('TimeSpents')
                .select('id,issueId,userId,timeSpent1,onDate')
                .where('issues.issueSubject', 'substringof', search)
                .orderBy('id');
           
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.issue, 'id');

                if (timeSpentObservable) {
                    timeSpentObservable(list);
                }
                
                log('Retrieved [' + entityNames.timeSpent + '] from remote data source 3',
                    data, true);

            }
        };

        //Metabase will sync with model.js 
        function configureBreezeManager() {
          //  breeze.NamingConvention.camelCase.setAsDefault();
            var mgr = new breeze.EntityManager(config.remoteServiceName);
            
            model.configureMetadataStore(mgr.metadataStore);
           
            return mgr;
        }

        //This method create empty issue object and send to the view
        var createTimeSpent = function (timeSpent) {
            //hasMetadataFor  will get call while useradd.html call in the very first time.
            //Bacause model.js is not know the metadata object while calling createUser funtion in the very first time
            if (!manager.metadataStore.hasMetadataFor(config.remoteServiceName)) {
                manager.metadataStore.fetchMetadata(config.remoteServiceName, fetchMetadataSuccess, fetchMetadataSuccess);
            } else {
                timeSpent(manager.createEntity(entityNames.timeSpent));
            }

            function fetchMetadataSuccess(rawMetadata) {
                timeSpent(manager.createEntity(entityNames.timeSpent));
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
            catch (e) { alert('[timeSpentdatacontext.js] getValidationMessages : ' + e.message); }
            return 'validation error';
        }

        function queryFailed(error) {
           
            var msg = '[timeSpentdatacontext.js] Error retrieving data. ' + error.message;
            logError(msg, error);
            
            throw error;
        }
        
        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(timeSpentdatacontext), showToast);
        }

        function logError(msg, error) {
            logger.logError(msg, error, system.getModuleId(timeSpentdatacontext), true);
        }
        ////////////////////////


        //This property help to find the database hasChanges
        var hasChanges = ko.observable(false);


        manager.hasChangesChanged.subscribe(function (eventArgs) {
         
            hasChanges(eventArgs.hasChanges);
        });


        //This method call the breeze api service and get a request issue for edit
        var getATimeSpentDetail = function (timeSpentId, timeSpentObservable) {
         
            return manager.fetchEntityByKey(
               entityNames.timeSpent, timeSpentId, true)
               .then(fetchSucceeded)
               .fail(queryFailed);

            function fetchSucceeded(data) {
                var s = data.entity;
               
 
                return s.isPartial() ? refreshtimeSpent(s) : timeSpentObservable(s);
            }

            function refreshissue(timeSpent) {
                  
                return EntityQuery.fromEntities(timeSpent)
                    .using(manager).execute()
                    .then(querySucceeded)
                    .fail(queryFailed);
            }

            function querySucceeded(data) {
                var s = data.results[0];
                s.isPartial(false);
               
                log('Retrieved [' + entityNames.issue + '] from remote data source 4', s, true);
                return issueObservable(s);
            }
        };
        //var primeData = function () {
        //    var promise = Q.all([
        //        getLookups(),
        //        getAllIssueDetails(null)])
        //        .then(applyValidators);

        //    return promise.then(success);

        //    function success() {
        //        issuedatacontext.lookups = {
        //            users: getLocal('Users', 'userName', true)
        //        };
                
        //        log('Primed data', issuedatacontext.lookups);
        //    }

        //    function applyValidators() {
        //        model.applySessionValidators(manager.metadataStore);
        //    }

        //};

        //function getLocal(resource, ordering, includeNullos) {
        //    var query = EntityQuery.from(resource)
        //        .orderBy(ordering);
        //    if (!includeNullos) {
        //        query = query.where('id', '!=', 0);
        //    }
        //    return manager.executeQueryLocally(query);
        //}
        ///Properties, Methods
        var timeSpentdatacontext = {
            hasChanges: hasChanges,
            saveChanges: saveChanges,
            cancelChanges: cancelChanges,
            getAllTimeSpentDetails: getAllTimeSpentDetails,
            createTimeSpent: createTimeSpent,
            getATimeSpentDetail: getATimeSpentDetail,
            getAllUserDetails: getAllUserDetails,
            getAllIssuesForUser: getAllIssuesForUser,
            getAllTimeSpentDetailsWithSearch: getAllTimeSpentDetailsWithSearch
        };
        // primeData: primeData,
        return timeSpentdatacontext;
    });
