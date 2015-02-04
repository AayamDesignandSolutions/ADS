define(['services/logger', 'services/location/locationdatacontext', 'plugins/router'], function (logger, locationdatacontext, router) {
    var navOptions = ko.observableArray();
    var locations = ko.observableArray();
    var selectedlocationType = ko.observable();
    var selectedlocationTypeint = ko.observable();
    var selectedlocation = ko.observable();

    var secondValue = ko.observable();
    var countries = ko.observableArray();
    var states = ko.observableArray();
    var cities = ko.observableArray();

    var selectedcountry = ko.observable();
    var selectedstate = ko.observable();
    var selectedcity = ko.observable();
    var selecteddomain = ko.observable();

    
    var title = ko.observable();

    var searchName = ko.observable();
   
    var isSaving = ko.observable(false);
   
    var counter = 0;
    var xctr = 0;
    var ItemViewModel = function (id,title, text) {
        counter += 1;
        this.id = 'tab' + counter.toString();
        this.hash = id;
        this.title = title;
        this.text = text;
        this.isActive = false;
    };
    
     
    
    //Activate method will call while page loading
    function activate() {
        navOptions.removeAll()
        counter = 0;
        navOptions.push(new ItemViewModel(1,'City', 'City'));
        navOptions.push(new ItemViewModel(2,'State', 'State'));
        selectedlocationType = new ItemViewModel(3,'Country', 'Country')
        navOptions.push(selectedlocationType);
        selectedlocationType = new ItemViewModel(4,'Domain', 'Domain')
        navOptions.push(selectedlocationType);

        //selectedlocationType=
        loadData(selectedlocationType);
        logger.log(title + ' View Activated', null, title, true);
        return true;
    }
    var StateCity= function (obj) {
        secondValue = '';
        switch (selectedlocationType.hash) {
            case 2:
                secondValue = ', ' + obj.country().name();
                break;
            case 1:
                if (obj.state() != null) {
                    secondValue = ', ' + obj.state().name();
                }
                break;
            case 4:
                if (obj.city() != null) {
                    secondValue = ', ' + obj.city().name();
                }
                break;
        }
        return secondValue;
    }
    //Deactivate method will call while page unloading
    var deactivate = function () {
        locations([]);
    };

    var loadData = function (xtype) {
        var result;
      
        selectedlocationType = xtype;
        title = xtype.title;
        secondValue = "";
      
        switch (xtype.hash) {
            case 1:
                result = locationdatacontext.getAllCityDetails(locations);
                break;
            case 2:
                
                result = locationdatacontext.getAllStateDetails(locations);
                 
                break;
            case 3:
                result = locationdatacontext.getAllCountryDetails(locations);
                break;
            case 4:
                
                result = locationdatacontext.getAllDomainDetails(locations);
               
                break;
        }
       

    };

    //#region This method will catch user click the contact from the list
    var attached = function (view) {
        bindEventToList(view, '.contact-content', gotoDetails);
    }

    var bindEventToList = function (rootSelector, selector, callback) {
        var eName = 'click';
        $(rootSelector).on(eName, selector, function () {

            var location = ko.dataFor(this);
            callback(location);

            return false;
        });
    }

    var gotoDetails = function (selectedLocation) {
        if (countries().length >0)
            countries.removeAll();
        if (selectedLocation && selectedLocation.id()) {
        
            switch (selectedlocationType.hash) {
                case 1:
                    locationdatacontext.getACityDetail(selectedLocation.id(), selectedcity)
                    locationdatacontext.getAllCountryDetails(countries);
                    locationdatacontext.getAllStateDetails(states);
                    $('#edited-article-city').modal("show");
                    break;
                case 2:
                    locationdatacontext.getAStateDetail(selectedLocation.id(), selectedstate);
                    locationdatacontext.getAllCountryDetails(countries);
                    $('#edited-article-state').modal("show");
                    break;
                case 3:
                   
                    locationdatacontext.getACountryDetail(selectedLocation.id(), selectedcountry);
                    $('#edited-article-country').modal("show");
                    break;
                case 4:
                    locationdatacontext.getADomainDetail(selectedLocation.id(), selecteddomain)
                    locationdatacontext.getAllCountryDetails(countries);
                    locationdatacontext.getAllStateDetails(states);
                    locationdatacontext.getAllCityDetails(cities);

                    $('#edited-article-domain').modal("show");
                    break;
            }




        
        }
    }
    
    var loadstates = function (obj)
    {
        if (obj != null && obj.country() != null) {
            if (obj.country().id() > 0) {

                var result1 = locationdatacontext.getAllStatesForCountry(states, obj.country().id());
            }

        }

    }
    var loadcities = function (obj) {
      
     
        if (obj != null && obj.state() != null) {
           
            if (obj.state().id() > 0) {

                var result1 = locationdatacontext.getAllCitiesForState(cities, obj.state().id());
            }

        }

    }

    var addLocation = function () {
        var dialogbox = '';
        title = 'Add ' + selectedlocationType.title;
         
        switch (selectedlocationType.hash) {
            case 1:
                locationdatacontext.createCity(selectedcity);
                locationdatacontext.getAllCountryDetails(countries);
                //locationdatacontext.getAllCountryDetails(states);
                $('#edited-article-city').modal("show");
                break;
            case 2:
                locationdatacontext.createState(selectedstate);
                locationdatacontext.getAllCountryDetails(countries);
                $('#edited-article-state').modal("show");
                break;
            case 3:

                locationdatacontext.createCountry(selectedcountry);
                $('#edited-article-country').modal("show");
                break;
            case 4:
                locationdatacontext.createDomain(selecteddomain);
                locationdatacontext.getAllCountryDetails(countries);
                $('#edited-article-domain').modal("show");
                break;

        }

    }

    

    //Search Command
    var search = function () {

        switch (selectedlocationType.hash) {
            case 1:
                locationdatacontext.getAllCityDetailsWithSearch(locations, searchName());
                break;
            case 2:
                locationdatacontext.getAllStateDetailsWithSearch(locations, searchName());
                break;
            case 3:
                locationdatacontext.getAllCountryDetailsWithSearch(locations, searchName());
                break;
            case 4:
                locationdatacontext.getAllDomainDetailsWithSearch(locations, searchName());
                break;

        }
      

    };

    //Cancel Search
    var clearSearch = function () {
        loadData(selectedlocationType);
        searchName('');
    };
    
    //------------------------------ Contact Add-----------------------------------------------
    //Cancel Command
    var cancel = function (complete) {
        loadData(selectedlocationType);
        hidepanel();
    };


    var hasChanges = ko.computed(function () {
       
      return locationdatacontext.hasChanges();
    });

   
    var hidepanel = function () {
        switch (selectedlocationType.hash) {
            case 1:
                $('#edited-article-city').modal("hide");
                break;
            case 2:
                $('#edited-article-state').modal("hide");
                break;
            case 3:
                $('#edited-article-country').modal("hide");
                break;
            case 4:
                $('#edited-article-domain').modal("hide");
                break;

        }

    }


    //Save Command
    var save = function () {
        isSaving(true);
   

        locationdatacontext.saveChanges()
            .then(goToEditView).fin(complete);

        function goToEditView(result) {
            
            loadData(selectedlocationType);
         
            hidepanel();
        }

        function complete() {
           
            isSaving(false);
        }
    };
    var canSave = ko.computed(function () {

        return hasChanges() && !isSaving();
    });

    //This method will call deactivate, pop message box will display for getting confirmation.
    var canDeactivate = function () {
        if (hasChanges()) {
            var msg = 'Do you want to leave and cancel?';
            return app.showMessage(msg, title, ['Yes', 'No'])
                .then(function (selectedOption) {
                    if (selectedOption === 'Yes') {
                        locationdatacontext.cancelChanges();
                        hidepanel();
                    }
                    return selectedOption;
                });
        }
        return true;
    }
    //------------------------------ Contact Add-----------------------------------------------

  

    //ViewModel Properties, Method and Command object
    var vm = {
        activate: activate,
        navOptions: navOptions,
        deactivate: deactivate,
        locations: locations,
        title: title,
        attached: attached,
        search: search,
        searchName: searchName,
        clearSearch: clearSearch,
        addLocation: addLocation,
        canSave: canSave,
        cancel: cancel,
        hasChanges: hasChanges,
        save: save,
        loadData: loadData,
        loadstates: loadstates,
        selectedlocation: selectedlocation,
        secondValue: secondValue,
        StateCity: StateCity,
        countries: countries,
        states: states,
        selectedlocationType: selectedlocationType,
        selectedlocationTypeint: selectedlocationTypeint,
        selectedcountry: selectedcountry,
        selectedstate: selectedstate,
        selectedcity: selectedcity,
        selecteddomain: selecteddomain,
        cities: cities,
        loadcities: loadcities
    };

    return vm;
});



