/** Created by carlcustav on 3/21/2017. */
var app = angular.module('wildAnimals', ['ngRoute', 'moment-picker', 'angularMoment']);

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

app.constant('animalSpecies',
    [
        'karu',
        'ilves',
        'hunt',
        'rebane',
        'hirv',
        'kits',
        'ahv'
    ]
)
app.constant('configurationParameters', {
    name : {
        queryType : "name",
        labelDescription : "Sisesta otsinguks looma nimi",
        inputGlyphicon : "fa fa-paw",
        includedTemplatePath : "/static/templates/AngularTemplates/searchResultByName.html",
        queryUrl : "searchByName/?"
    },
    species : {
        queryType : "species",
        labelDescription: "Sisesta otsinguks looma liik",
        inputGlyphicon : "fa fa-paw",
        includedTemplatePath : "/static/templates/AngularTemplates/searchResultBySpecies.html",
        queryUrl : 'searchBySpecies/?'
    },
    location : {
        queryType : "location",
        labelDescription: "Sisesta otsinguks looma asukoht",
        inputGlyphicon : "fa fa-location-arrow",
        includedTemplatePath : "/static/templates/AngularTemplates/searchResultByLocation.html",
        queryUrl : 'searchByLocation/?'
    },
      addAnimal : {
        queryType : "addAnimal",
        labelDescription: "Lisa looma nimi ja liik",
        inputGlyphicon : "fa fa-location-arrow",
        includedTemplatePath : "",
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

app.config(function ($routeProvider, $locationProvider) {

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

app.controller('wildAnimalsController', function ($scope, $http, $rootScope, configurationParameters, animalSpecies, $location) {

    $scope.animalSpecies = animalSpecies;
    $scope.selectedSpecies = $scope.animalSpecies[0]

    $scope.searchResult = [];
    $scope.makeQuery = function (event) {
        event.preventDefault();
        var form = $('#searchForm');
        console.log($scope.getQueryUrl() + $.param(form.serializeArray()))
        $http({
            method: "GET",
            url: $scope.getQueryUrl() + $.param(form.serializeArray())
        }).then(
            function success(response) {
                $scope.createDateObject(response.data);
                if ($scope.getQueryType() == configurationParameters['name']['queryType']) {
                    $scope.setCurrentAnimal(response.data[0])
                }
                $scope.searchResult = response.data;
                console.log($scope.searchResult)
                form.trigger("reset");
            },
            function error(response) { alert("SearchFrom Error"); })
    }

    $scope.addAnimal = function (event) {
        event.preventDefault();
        var form = $('#addAnimalForm');
        $http({
            method: "POST",
            url: $scope.getQueryUrl(),
            contentType: "application/json",
            data: {
                animalName : form.find('input[name="animalName"]').val(),
                animalSpecies : $scope.selectedSpecies
            },
        }).then(
            function success(response) { $scope.resetToDefault(); },
            function error(response) { alert("AddAnimal Error"); }
        )
    }

    $scope.addAnimalObservation = function (event) {
        event.preventDefault();
        var form = $('#addObservationForm');
        $http({
            method: "POST",
            url: $scope.getQueryUrl(),
            contentType: "application/json",
            data: {
                animalName : form.find('input[name="animalName"]').val(),
                animalLocation : form.find('input[name="animalLocation"]').val(),
                animalSeenTime : $scope.newObservationDate
            }
        }).then(
            function success(response) { $scope.resetToDefault(); },
            function error(response) { alert("AddAnimalObservation Error"); }
        )
    }

  $scope.removeAnimal = function () {

        $http({
            method: "DELETE",
            url: "removeAnimal/",
            contentType: "application/json",
            data: $scope.getCurrentAnimal().name,
        }).then(
            function success(response) { $scope.resetToDefault(); },
            function error(response) { alert("removeAnimal Error"); }
        )
    }


    $scope.changeAnimalData = function () { $scope.setChangingAnimalData(true); }
    $scope.applyDataChanges = function (event) {
        event.preventDefault();
        $http({
            method: "POST",
            url: "changeAnimalData/",
            contentType: "application/json",
            data: $scope.getCurrentAnimal()
        }).then(
            function success(response) { $scope.resetToDefault(); },
            function error(response) { alert("ApplyDataChanges Error"); }
        )
    }



    /* Setters and getters */
    $scope.setQueryType = function (queryType) {$rootScope.queryType = queryType;}
    $scope.getQueryType = function () {return $rootScope.queryType;}

    $scope.setLabelDescription = function (labelDescription) {$rootScope.labelDescription = labelDescription;}
    $scope.getLabelDescription = function () {return $rootScope.labelDescription;}

    $scope.setInputGlyphicon = function (inputGlyphicon) {$rootScope.inputGlyphicon = inputGlyphicon;}
    $scope.getInputGlyphicon = function () {return $rootScope.inputGlyphicon;}

    $scope.setIncludedTemplatePath = function (includedTemplatePath) {$rootScope.includedTemplatePath = includedTemplatePath;}
    $scope.getIncludedTemplatePath = function () {return $rootScope.includedTemplatePath;}

    $scope.setCurrentAnimal = function (currentAnimal) {$rootScope.currentAnimal = currentAnimal;}
    $scope.getCurrentAnimal = function () {return $rootScope.currentAnimal;}

    $scope.setChangingAnimalData = function (changingAnimalData) {$rootScope.changingAnimalData = changingAnimalData;}
    $scope.getChangingAnimalData = function () {return $rootScope.changingAnimalData;}

    $scope.setQueryUrl = function (queryUrl) {$rootScope.queryUrl = queryUrl;}
    $scope.getQueryUrl = function () {return $rootScope.queryUrl;}


    /* Query configuring and reseting. */
    $scope.makeQueryConfigurations = function (selectedOption) {
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
        $location.path('/');
    }

    $scope.directToAnimalDetails = function ($event) {
        $scope.setCurrentAnimal($scope.searchResult[$event.target.id]);
        $scope.makeQueryConfigurations('name');
        $location.path('/search');
    }

    $scope.createDateObject = function(result) {
        for (var i = 0; i < result.length; i++) {
            for (var j = 0; j < result[i].observationInfo.length; j++) {
                result[i].observationInfo[j].datetime = moment(result[i].observationInfo[j].datetime).locale('et');
            }
        }

    }
});

