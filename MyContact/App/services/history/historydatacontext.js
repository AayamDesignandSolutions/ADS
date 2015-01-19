
define([
    'durandal/system',
    'services/history/model',
     'config',
    'services/logger',
    'services/breeze.partial-entities',
    'plugins/router'],
    function (system, model, config, logger, partialMapper, router) {
        var EntityQuery = breeze.EntityQuery;
        var manager = configureBreezeManager();
        var orderBy = model.orderBy;
        var entityNames = model.entityNames;

        //This method get all the Histories available in the database and load the data into convtactObservable variable.
        //Knockout framework will communicate these information to UI (html)
        var getAllHistoryDetails = function (historyObservable) {

            var query = EntityQuery.from('Histories')
                .select('id,context ,field,contextId,oldValue,newValue,changeDate')
                .orderBy('id');
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.history, 'id');

                if (historyObservable) {
                    historyObservable(list);
                }
                
                log('Retrieved [' + entityNames.history + '] from remote data source',
                    data, true);

            }
        };

        //This method get all the Histories available in the database and load the data into convtactObservable variable.        
        var getAllHistoryDetailsWithSearch = function (historyObservable, search) {

            var query = EntityQuery.from('Histories')
                .select('id,context ,field,contextId,oldValue,newValue,changeDate')
                .where('context', 'substringof', search)
                .orderBy('id');
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.history, 'id');

                if (historyObservable) {
                    historyObservable(list);
                }
                log('Retrieved [' + entityNames.history + '] from remote data source',
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

        //This method create empty history object and send to the view
        var createHistory = function (history) {
            //hasMetadataFor  will get call while historyadd.html call in the very first time.
            //Bacause model.js is not know the metadata object while calling createHistory funtion in the very first time
            if (!manager.metadataStore.hasMetadataFor(config.remoteServiceName)) {
                manager.metadataStore.fetchMetadata(config.remoteServiceName, fetchMetadataSuccess, fetchMetadataSuccess);
            } else {
                history(manager.createEntity(entityNames.history));
            }

            function fetchMetadataSuccess(rawMetadata) {
                history(manager.createEntity(entityNames.history));
            }

            function fetchMetadataFail(exception) {

            }
        };


        //This method save the modified/added history to the datatabase with the help of Breeze framework.        
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
            catch (e) { alert('[historydatacontext.js] getValidationMessages : ' + e.message); }
            return 'validation error';
        }

        function queryFailed(error) {
            var msg = '[historydatacontext.js] Error retrieving data. ' + error.message;
            logError(msg, error);
            throw error;
        }


        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(historydatacontext), showToast);
        }

        function logError(msg, error) {
            logger.logError(msg, error, system.getModuleId(historydatacontext), true);
        }
        ////////////////////////


        //This property help to find the database hasChanges
        var hasChanges = ko.observable(false);


        manager.hasChangesChanged.subscribe(function (eventArgs) {
            hasChanges(eventArgs.hasChanges);
        });


        //This method call the breeze api service and get a request history for edit
        var getAHistoryDetail = function (historyId, historyObservable) {

            return manager.fetchEntityByKey(
               entityNames.history, historyId, true)
               .then(fetchSucceeded)
               .fail(queryFailed);

            function fetchSucceeded(data) {
                var s = data.entity;
                return s.isPartial() ? refreshhistory(s) : historyObservable(s);
            }

            function refreshhistory(history) {
                return EntityQuery.fromEntities(history)
                    .using(manager).execute()
                    .then(querySucceeded)
                    .fail(queryFailed);
            }

            function querySucceeded(data) {
                var s = data.results[0];
                s.isPartial(false);
                log('Retrieved [' + entityNames.history + '] from remote data source', s, true);
                return historyObservable(s);
            }
        };


        ///Properties, Methods
        var historydatacontext = {
            hasChanges: hasChanges,
            saveChanges: saveChanges,
            cancelChanges: cancelChanges,
            getAllHistoryDetails: getAllHistoryDetails,
            createHistory: createHistory,
            getAHistoryDetail: getAHistoryDetail,
            getAllHistoryDetailsWithSearch: getAllHistoryDetailsWithSearch
        };

        return historydatacontext;
    });
