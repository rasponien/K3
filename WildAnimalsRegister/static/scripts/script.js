/** Created by carlcustav on 3/21/2017. */
var app = angular.module('wildAnimals', ['ngRoute', 'moment-picker']);


/*
app.directive('date', function (dateFilter) {
    return {
        require:'ngModel',
        restrict: 'A',
        scope: {
            date: '=',
            ngModel: '='
        },
        link:function (scope, elm, attrs, wildAnimalsController) {
            wildAnimalsController.$formatters.unshift(function () {
                return dateFilter(scope.ngModel, scope.date);
            });
        }
    };
});

app.directive('labeldateformat', function (dateFilter) {
    return {
        restrict : 'A',
        scope : {
            labeldateformat: '=',
            value: '=',
        },
        link:function (scope, element, attributes) {
            element.append(dateFilter(scope.value, scope.labeldateformat));
        }
    }
});

*/

/*
app.directive('animalData', function() {
  return {
    restrict: 'E',
    templateUrl: '/static/templates/Components/animalData.html'
  };
});
*/
app.constant('configurationParameters', {
    name : {
        queryType : "name",
        labelDescription : "Sisesta otsinguks looma nimi",
        inputGlyphicon : "fa fa-paw",
        includedTemplatePath : "/static/templates/AngularTemplates/searchResultByName.html",
        queryUrl : "searchByName/"
    },
    species : {
        queryType : "species",
        labelDescription: "Sisesta otsinguks looma liik",
        inputGlyphicon : "fa fa-paw",
        includedTemplatePath : "/static/templates/AngularTemplates/searchResultBySpecies.html",
        queryUrl : 'searchBySpecies/'
    },
    location : {
        queryType : "location",
        labelDescription: "Sisesta otsinguks looma asukoht",
        inputGlyphicon : "fa fa-location-arrow",
        includedTemplatePath : "/static/templates/AngularTemplates/searchResultByLocation.html",
        queryUrl : 'searchByLocation/'
    },
      addAnimal : {
        queryType : "addAnimal",
        labelDescription: "Lisa looma nimi ja liik",
        inputGlyphicon : "fa fa-location-arrow",
        queryUrl : 'addAnimal/'
    },
      addObservation : {
        queryType : "addObservation",
        labelDescription: "Lisa looma nimi, viimati nägemise asukoht ja aeg",
        inputGlyphicon : "fa fa-location-arrow",
        includedTemplatePath : "",
        queryUrl : 'addObservation/'
    }
});

app.run(function ($rootScope) {

    $rootScope.queryType = "";
    $rootScope.labelDescription = "";
    $rootScope.inputGlyphicon = "";
    $rootScope.includedTemplatePath = "";
    $rootScope.queryUrl = "";

    $rootScope.currentAnimal = [];
    $rootScope.changingAnimalData = false;

});

app.config(function ($routeProvider, $locationProvider, momentPickerProvider) {

    /*
    momentPickerProvider.options({
        locale:        'et',
        format:        'MMMM Do YYYY, h:mm',
        minView:       'decade',
        maxView:       'minute',
        startView:     'year',
        autoclose:     true,
        today:         true,
        keyboard:      false,

        leftArrow:     '&larr;',
        rightArrow:    '&rarr;',
        hoursFormat:   'HH:[00]',
        minutesFormat: moment.localeData().longDateFormat('LT').replace(/[aA]/, ''),
        minutesStep:   5
    });
    */

    $locationProvider.hashPrefix('');
    $routeProvider
        .when("/search", {
            templateUrl: "/static/templates/AngularTemplates/search.html",
            controller: 'wildAnimalsController'
        }).when("/addAnimal", {
            templateUrl: "/static/templates/AngularTemplates/addAnimal.html",
            controller: 'wildAnimalsController'
        }).when("/addObservation", {
            templateUrl: "/static/templates/AngularTemplates/addObservation.html",
            controller: 'wildAnimalsController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.controller('wildAnimalsController', function ($scope, $http, $rootScope, configurationParameters, $location) {

    $scope.searchResult = [];
    $scope.makeQuery = function (event) {
        event.preventDefault();
        var form = $('#searchForm');
        $http({
            method: "POST",
            url: $scope.getQueryUrl(),
            data: $.param(form.serializeArray()),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(
            function success(response) {
                $scope.createDateObject(response.data);
                if (response.data.length == 1 && $scope.getQueryType() == configurationParameters['name']['queryType']) {
                    $scope.setCurrentAnimal(response.data[0])
                }
                $scope.searchResult = response.data;
                form.trigger("reset");
            },
            function error(response) {
                alert("SearchFrom Error");
            })
    }


    $scope.makeNewAnimal = function (event) {
        event.preventDefault();
        var form = $('#addAnimalForm');
        $http({
            method: "POST",
            url: $scope.getQueryUrl(),
            data: $.param(form.serializeArray()),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(
            function success(response) {
                console.log('SAIN RESPONSE : ' + response);
                $scope.resetToDefault();
                $location.path('/');
            },
            function error(response) {
                alert("Error");
            })
    }

    $scope.makeNewObservation = function (event) {
        event.preventDefault();
        var form = $('#addObservationForm');
        $http({
            method: "POST",
            url: $scope.getQueryUrl(),
            data: $.param(form.serializeArray()),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(
            function success(response) {
                console.log('SAIN RESPONSE : ' + response);
                $scope.resetToDefault();
                $location.path('/');
            },
            function error(response) {
                alert("fucking response on perses Error");
            })
    }

  $scope.removeAnimal = function () {

        $http({
            method: "POST",
            url: "removeAnimal/",
            data: $.param({animalName: $scope.searchResult[0].name}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(
            function success(response) {
                $scope.resetToDefault();
                $location.path('/');
            },
            function error(response) {
                alert("Removal" + response);
            })
    }



    $scope.changeAnimalData = function () {
        $scope.setChangingAnimalData(true);
    }

    $scope.applyDataChanges = function (event) {
        event.preventDefault();
        console.log("---")

        console.log($scope.getCurrentAnimal())
        $http({
            method: "POST",
            url: "changeAnimalData/",
            data: {
                name : $scope.getCurrentAnimal().name,
                species : $scope.getCurrentAnimal().species,
                observationInfo : $scope.getCurrentAnimal().observationInfo
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(
            function success(response) {
                $scope.resetToDefault();
                $location.path('/');
            },
            function error(response) {
                alert(response);
        })
    }


    /* Setters and getters */
    $scope.setQueryType = function (queryType) {
        $rootScope.queryType = queryType;
    }
    $scope.getQueryType = function () {
        return $rootScope.queryType;
    }

    $scope.setLabelDescription = function (labelDescription) {
        $rootScope.labelDescription = labelDescription;
    }
    $scope.getLabelDescription = function () {
        return $rootScope.labelDescription;
    }

    $scope.setInputGlyphicon = function (inputGlyphicon) {
        $rootScope.inputGlyphicon = inputGlyphicon;
    }
    $scope.getInputGlyphicon = function () {
        return $rootScope.inputGlyphicon;
    }

    $scope.setIncludedTemplatePath = function (includedTemplatePath) {
        $rootScope.includedTemplatePath = includedTemplatePath;
    }
    $scope.getIncludedTemplatePath = function () {
        return $rootScope.includedTemplatePath;
    }

    $scope.setCurrentAnimal = function (currentAnimal) {
        $rootScope.currentAnimal = currentAnimal;
    }
    $scope.getCurrentAnimal = function () {
        return $rootScope.currentAnimal;
    }

    $scope.setChangingAnimalData = function (changingAnimalData) {
        $rootScope.changingAnimalData = changingAnimalData;
    }
    $scope.getChangingAnimalData = function () {
        return $rootScope.changingAnimalData;
    }

    $scope.setQueryUrl = function (queryUrl) {
        $rootScope.queryUrl = queryUrl;
    }
    $scope.getQueryUrl = function () {
        return $rootScope.queryUrl;
    }


    /* Query configuring and reseting. */
    $scope.makeQueryConfigurations = function (selectedOption) {
        console.log("Configuration parameter:" + configurationParameters[selectedOption]);
        $scope.setQueryType(configurationParameters[selectedOption]['queryType']);
        $scope.setLabelDescription(configurationParameters[selectedOption]['labelDescription']);
        $scope.setInputGlyphicon(configurationParameters[selectedOption]['inputGlyphicon']);
        $scope.setIncludedTemplatePath(configurationParameters[selectedOption]['includedTemplatePath']);
        $scope.setQueryUrl(configurationParameters[selectedOption]['queryUrl']);
    }
    $scope.resetToDefault = function () {
        $scope.setQueryType("");
        $scope.setLabelDescription("");
        $scope.setInputGlyphicon("");
        $scope.setIncludedTemplatePath("");
        $scope.setChangingAnimalData(false);
        $scope.setQueryUrl("");
    }

    $scope.directToAnimalDetails = function ($event, view) {
        $scope.setCurrentAnimal($scope.searchResult[$event.target.id]);
        $scope.makeQueryConfigurations('name');
        $location.path(view);
    }

    $scope.createDateObject = function(result) {
        for (var i = 0; i < result.length; i++) {
            for (var j = 0; j < result[i].observationInfo.length; j++) {
                result[i].observationInfo[j].datetime = moment(result[i].observationInfo[j].datetime).locale('et');
            }
        }

    }

});

