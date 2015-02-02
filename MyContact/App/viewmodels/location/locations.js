define(['services/logger', 'services/location/locationdatacontext', 'plugins/router'], function (logger, locationdatacontext, router) {
    var navOptions = ko.observableArray();
    var locations = ko.observableArray();
    var selectedlocationType = ko.observable();
    var selectedlocationTypeint = ko.observable();
    var selectedlocation = ko.observable();

    var secondValue = ko.observable();
    var countries = ko.observableArray();
    var selectedcountry = ko.observable();
    var selectedstate = ko.observable();

    var title = ko.observable();

    var selectedcontact = ko.observable();
    var searchName = ko.observable();
   
    var isSaving = ko.observable(false);
   
    var counter = 0;
    var xctr = 0;
    var ItemViewModel = function (title, text) {
        counter += 1;
        this.id = 'tab' + counter.toString();
        this.hash = counter;
        this.title = title;
        this.text = text;
        this.isActive = false;
    };
    
     
    
    //Activate method will call while page loading
    function activate() {
        navOptions.removeAll()
        counter = 0;
        navOptions.push(new ItemViewModel('City', 'City'));
        navOptions.push(new ItemViewModel('State', 'State'));
        selectedlocationType = new ItemViewModel('Country', 'Country')
        navOptions.push(selectedlocationType);
        //selectedlocationType=
        loadData(selectedlocationType);
        logger.log(title + ' View Activated', null, title, true);
        return true;
    }
    var StateCity= function (obj) {
        
        if (selectedlocationType.hash==2)
        {
            secondValue = ', ' + obj.country().name();
        }
        if (selectedlocationType.hash == 1) {
            secondValue = ', ' + obj.state().name();
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
        xctr = 0;
        secondValue = "";
        countries.removeAll();
        switch(xtype.hash) {
            case 1:
                result = locationdatacontext.getAllCityDetails(locations);
                result = locationdatacontext.getAllCountryDetails(countries);
                break;
            case 2:
                result = locationdatacontext.getAllStateDetails(locations);
                result = locationdatacontext.getAllCountryDetails(countries);
                break;
            case 3:
                result = locationdatacontext.getAllCountryDetails(locations);
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

            var contact = ko.dataFor(this);
            callback(contact);

            return false;
        });
    }

    var gotoDetails = function (selectedLocation) {
        if (selectedLocation && selectedLocation.id()) {
        
            switch (selectedlocationType.hash) {
                case 1:
                    locationdatacontext.getACityDetail(selectedLocation.id(), selectedlocation);
                    locationdatacontext.getAllCountryDetails(countries);
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
            }




        
        }
    }
    

    var addLocation = function () {
        var dialogbox = '';
        title = 'Add ' + selectedlocationType.title;
         
      switch (selectedlocationType.hash) {
            case 1:
                locationdatacontext.createCity(selectedlocation);
                locationdatacontext.getAllCountryDetails(countries);
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
        }
        


     
     

            //var url = '#/contactadd/';
            //router.navigate(url);
    }

    var setCbo1 = function () {

        //var xprop;
        ////alert('');
        //switch (selectedlocationType.hash) {
        //    case  1:
        //        return scountry;
        //        break;
        //    case 2:
        //        return selectedlocation.countryId;
        //        break;
        //    case 3:
        //        return scountry;
        //        break;
        //}

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
        }
        //locationdatacontext.getAllContactDetailsWithSearch(locations, searchName());

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
        $('#edited-article-country').modal("hide");
    };


    var hasChanges = ko.computed(function () {
       
      return locationdatacontext.hasChanges();
    });

   


    //Save Command
    var save = function () {
        isSaving(true);
        //alert(selectedstate().countryId());
        //alert(selectedstate().country().id());
        //selectedstate.countryId(selectedstate().country().id());
        //alert(selectedstate().countryId());

        locationdatacontext.saveChanges()
            .then(goToEditView).fin(complete);

        function goToEditView(result) {
           
            loadData(selectedlocationType);
            $('#edited-article-country').modal("hide");
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
        selectedcontact: selectedcontact,
        loadData: loadData,
        selectedlocation: selectedlocation,
        secondValue: secondValue,
        StateCity: StateCity,
        countries: countries,
        selectedlocationType: selectedlocationType,
        selectedlocationTypeint: selectedlocationTypeint,
        selectedcountry: selectedcountry,
        selectedstate: selectedstate,
        setCbo1: setCbo1
    };

    return vm;
});



