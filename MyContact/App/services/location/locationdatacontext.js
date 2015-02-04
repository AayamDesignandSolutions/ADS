
define([
    'durandal/system',
    'services/location/model',
     'config',
    'services/logger',
    'services/breeze.partial-entities',
    'plugins/router'],
    function (system, model, config, logger, partialMapper, router) {
        var EntityQuery = breeze.EntityQuery;
        var manager = configureBreezeManager();
        var orderBy = model.orderBy;
        var entityNames = model.entityNames;

        //-----------------------Country--------------------------------------------------------------------------------------------------
        var getAllCountryDetails = function (locationObservable) {

            var query = EntityQuery.from('Countries')
                .select('id, name')
                .orderBy('id');
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.country, 'id');

                if (locationObservable) {
                    locationObservable(list);
                }

                log('Retrieved [' + entityNames.country + '] from remote data source',
                    data, true);

            }
        };
        var createCountry = function (country) {
            //hasMetadataFor  will get call while contactadd.html call in the very first time.
            //Bacause model.js is not know the metadata object while calling createContact funtion in the very first time
            if (!manager.metadataStore.hasMetadataFor(config.remoteServiceName)) {
                manager.metadataStore.fetchMetadata(config.remoteServiceName, fetchMetadataSuccess, fetchMetadataSuccess);
            } else {
                country(manager.createEntity(entityNames.country));
            }

            function fetchMetadataSuccess(rawMetadata) {
                country(manager.createEntity(entityNames.country));
            }

            function fetchMetadataFail(exception) {

            }
        };
        var getACountryDetail = function (locationId, locationObservable) {

            return manager.fetchEntityByKey(
               entityNames.country, locationId, true)
               .then(fetchSucceeded)
               .fail(queryFailed);

            function fetchSucceeded(data) {
                var s = data.entity;
                return s.isPartial() ? refreshcountry(s) : locationObservable(s);
            }

            function refreshcountry(country) {
                return EntityQuery.fromEntities(country)
                    .using(manager).execute()
                    .then(querySucceeded)
                    .fail(queryFailed);
            }

            function querySucceeded(data) {
                var s = data.results[0];
                s.isPartial(false);
                log('Retrieved [' + entityNames.country + '] from remote data source', s, true);
                return locationObservable(s);
            }
        };
        var getAllCountryDetailsWithSearch = function (locationObservable, search) {

            var query = EntityQuery.from('Countries')
                .select('id, name')
                .where('name', 'substringof', search)
                .orderBy('id');
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.country, 'id');

                if (locationObservable) {
                    locationObservable(list);
                }
                log('Retrieved [' + entityNames.country + '] from remote data source',
                    data, true);

            }
        };
        //----------------------------------------------------------------------------------------------------------------------------------

        //-----------------------State----------------------------------------------------------------------------------------------------
        var getAllStateDetails = function (locationObservable) {

            var query = EntityQuery.from('States')
                .select('id, name,country')
                .orderBy('id');
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.state, 'id');

                if (locationObservable) {
                    locationObservable(list);
                }

                log('Retrieved [' + entityNames.state + '] from remote data source',
                    data, true);

            }
        };
        var createState = function (state) {
            //hasMetadataFor  will get call while contactadd.html call in the very first time.
            //Bacause model.js is not know the metadata object while calling createContact funtion in the very first time
            if (!manager.metadataStore.hasMetadataFor(config.remoteServiceName)) {
                manager.metadataStore.fetchMetadata(config.remoteServiceName, fetchMetadataSuccess, fetchMetadataSuccess);
            } else {
                state(manager.createEntity(entityNames.state));
            }

            function fetchMetadataSuccess(rawMetadata) {
                state(manager.createEntity(entityNames.state));
            }

            function fetchMetadataFail(exception) {

            }
        };
        var getAStateDetail = function (locationId, locationObservable) {

            return manager.fetchEntityByKey(
               entityNames.state, locationId, true)
               .then(fetchSucceeded)
               .fail(queryFailed);

            function fetchSucceeded(data) {
                var s = data.entity;
                return s.isPartial() ? refreshstate(s) : locationObservable(s);
            }

            function refreshstate(state) {
                return EntityQuery.fromEntities(state)
                    .using(manager).execute()
                    .then(querySucceeded)
                    .fail(queryFailed);
            }

            function querySucceeded(data) {
                var s = data.results[0];
                s.isPartial(false);
                log('Retrieved [' + entityNames.state + '] from remote data source', s, true);
                return locationObservable(s);
            }
        };
        var getAllStateDetailsWithSearch = function (locationObservable, search) {

            var query = EntityQuery.from('States')
                .select('id, name, country')
                .where('name', 'substringof', search)
                .orderBy('id');
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.state, 'id');

                if (locationObservable) {
                    locationObservable(list);
                }
                log('Retrieved [' + entityNames.state + '] from remote data source',
                    data, true);

            }
        };
        var getAllStatesForCountry = function (locationObservable, countryId) {
            var query = EntityQuery.from('States')
               .select('id, name, country')
               .where('countryId', '==', countryId)
               .orderBy('id');
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.state, 'id');

                if (locationObservable) {
                    locationObservable(list);
                }
                log('Retrieved [' + entityNames.state + '] from remote data source',
                    data, true);

            }

        }
        //----------------------------------------------------------------------------------------------------------------------------------

        //-----------------------City----------------------------------------------------------------------------------------------------
        var getAllCityDetails = function (locationObservable) {

            var query = EntityQuery.from('Cities')
                .select('id, name,stateId,countryId,state,country')
                .orderBy('id');
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.city, 'id');

                if (locationObservable) {
                    locationObservable(list);
                }

                log('Retrieved [' + entityNames.city + '] from remote data source',
                    data, true);

            }
        };
        var createCity = function (city) {
            //hasMetadataFor  will get call while contactadd.html call in the very first time.
            //Bacause model.js is not know the metadata object while calling createContact funtion in the very first time
            if (!manager.metadataStore.hasMetadataFor(config.remoteServiceName)) {
                manager.metadataStore.fetchMetadata(config.remoteServiceName, fetchMetadataSuccess, fetchMetadataSuccess);
            } else {
                city(manager.createEntity(entityNames.city));
            }

            function fetchMetadataSuccess(rawMetadata) {
                city(manager.createEntity(entityNames.city));
            }

            function fetchMetadataFail(exception) {

            }
        };
        var getACityDetail = function (locationId, locationObservable) {

            return manager.fetchEntityByKey(
               entityNames.city, locationId, true)
               .then(fetchSucceeded)
               .fail(queryFailed);

            function fetchSucceeded(data) {
                var s = data.entity;
             
                return s.isPartial() ? refreshcity(s) : locationObservable(s);
            }

            function refreshcity(city) {
                return EntityQuery.fromEntities(city)
                    .using(manager).execute()
                    .then(querySucceeded)
                    .fail(queryFailed);
            }

            function querySucceeded(data) {
                var s = data.results[0];
                s.isPartial(false);
                log('Retrieved [' + entityNames.city + '] from remote data source', s, true);
              
                return locationObservable(s);
            }
        };
        var getAllCityDetailsWithSearch = function (locationObservable, search) {

            var query = EntityQuery.from('Cities')
                .select('id, name,stateId,countryId,state,country')
                .where('name', 'substringof', search)
                .orderBy('id');
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.city, 'id');

                if (locationObservable) {
                    locationObservable(list);
                }
                log('Retrieved [' + entityNames.city + '] from remote data source',
                    data, true);

            }
        };
        var getAllCitiesForState = function (locationObservable, stateId) {
            var query = EntityQuery.from('Cities')
               .select('id, name, state')
               .where('stateId', '==', stateId)
               .orderBy('id');
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.city, 'id');

                if (locationObservable) {
                    locationObservable(list);
                }
                log('Retrieved [' + entityNames.city + '] from remote data source',
                    data, true);

            }

        }
        //----------------------------------------------------------------------------------------------------------------------------------
        //-----------------------Domain--------------------------------------------------------------------------------------------------
        var getAllDomainDetails = function (locationObservable) {

            var query = EntityQuery.from('Domains')
                .select('id,name,active,address,city,state,country')
                .orderBy('id');
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.domain, 'id');

                if (locationObservable) {
                    locationObservable(list);
                }

                log('Retrieved [' + entityNames.domain + '] from remote data source',
                    data, true);

            }
        };
        var createDomain = function (domain) {
            //hasMetadataFor  will get call while contactadd.html call in the very first time.
            //Bacause model.js is not know the metadata object while calling createContact funtion in the very first time
            if (!manager.metadataStore.hasMetadataFor(config.remoteServiceName)) {
                manager.metadataStore.fetchMetadata(config.remoteServiceName, fetchMetadataSuccess, fetchMetadataSuccess);
            } else {
                domain(manager.createEntity(entityNames.domain));
            }

            function fetchMetadataSuccess(rawMetadata) {
                domain(manager.createEntity(entityNames.domain));
            }

            function fetchMetadataFail(exception) {

            }
        };
        var getADomainDetail = function (locationId, locationObservable) {

            return manager.fetchEntityByKey(
               entityNames.domain, locationId, true)
               .then(fetchSucceeded)
               .fail(queryFailed);

            function fetchSucceeded(data) {
                var s = data.entity;
                return s.isPartial() ? refreshdomain(s) : locationObservable(s);
            }

            function refreshdomain(domain) {
                return EntityQuery.fromEntities(domain)
                    .using(manager).execute()
                    .then(querySucceeded)
                    .fail(queryFailed);
            }

            function querySucceeded(data) {
                var s = data.results[0];
                s.isPartial(false);
                log('Retrieved [' + entityNames.domain + '] from remote data source', s, true);
                return locationObservable(s);
            }
        };
        var getAllDomainDetailsWithSearch = function (locationObservable, search) {

            var query = EntityQuery.from('Domains')
                .select('id,name,active,address,city,state,country')
                .where('name', 'substringof', search)
                .orderBy('id');
            return manager.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.domain, 'id');

                if (locationObservable) {
                    locationObservable(list);
                }
                log('Retrieved [' + entityNames.domain + '] from remote data source',
                    data, true);

            }
        };
        //----------------------------------------------------------------------------------------------------------------------------------

     
        //Metabase will sync with model.js 
        function configureBreezeManager() {
            breeze.NamingConvention.camelCase.setAsDefault();
            var mgr = new breeze.EntityManager(config.remoteServiceName);
            model.configureMetadataStore(mgr.metadataStore);
            return mgr;
        }

        //This method save the modified/added contact to the datatabase with the help of Breeze framework.        
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
            catch (e) { alert('[locationdatacontext.js] getValidationMessages : ' + e.message); }
            return 'validation error';
        }

        function queryFailed(error) {
            var msg = '[locationdatacontext.js] Error retrieving data. ' + error.message;
            logError(msg, error);
            throw error;
        }


        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(locationdatacontext), showToast);
        }

        function logError(msg, error) {
            logger.logError(msg, error, system.getModuleId(locationdatacontext), true);
        }
        ////////////////////////


        //This property help to find the database hasChanges
        var hasChanges = ko.observable(false);


        manager.hasChangesChanged.subscribe(function (eventArgs) {
            hasChanges(eventArgs.hasChanges);
        });


     

        ///Properties, Methods
        var locationdatacontext = {
            hasChanges: hasChanges,
            saveChanges: saveChanges,
            cancelChanges: cancelChanges,
            getAllCityDetails: getAllCityDetails,
            getAllStateDetails: getAllStateDetails,
            getAllCountryDetails: getAllCountryDetails,
            createCity: createCity,
            createState: createState,
            createCountry: createCountry,
            getACityDetail: getACityDetail,
            getAStateDetail: getAStateDetail,
            getACountryDetail: getACountryDetail,
            getAllCityDetailsWithSearch: getAllCityDetailsWithSearch,
            getAllStateDetailsWithSearch: getAllStateDetailsWithSearch,
            getAllCountryDetailsWithSearch: getAllCountryDetailsWithSearch,
            getAllStatesForCountry: getAllStatesForCountry,
            getAllDomainDetails: getAllDomainDetails,
            createDomain: createDomain,
            getADomainDetail: getADomainDetail,
            getAllDomainDetailsWithSearch: getAllDomainDetailsWithSearch,
            getAllCitiesForState: getAllCitiesForState
        };

        return locationdatacontext;
    });
