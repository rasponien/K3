/** Created by carlcustav on 3/21/2017. */
var app = angular.module('wildAnimals', ['ngRoute']);
app.constant('configurationParameters', {
    name : {
        queryType : "name",
        labelDescription : "Sisesta otsinguks looma nimi",
        inputGlyphicon : "fa fa-paw",
        includedTemplatePath : "/static/templates/AngularTemplates/searchResultByName.html"
    },
    species : {
        queryType : "species",
        labelDescription: "Sisesta otsinguks looma liik",
        inputGlyphicon : "fa fa-paw",
        includedTemplatePath : "/static/templates/AngularTemplates/searchResultBySpecies.html"
    },
    location : {
        queryType : "location",
        labelDescription: "Sisesta otsinguks looma asukoht",
        inputGlyphicon : "fa fa-location-arrow",
        includedTemplatePath : "/static/templates/AngularTemplates/searchResultByLocation.html"
    }
});

app.run(function ($rootScope) {

    $rootScope.queryType = "";
    $rootScope.labelDescription = "";
    $rootScope.inputGlyphicon = "";
    $rootScope.includedTemplatePath = "";

});

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when("/search", {
            templateUrl: "/static/templates/AngularTemplates/search.html",
            controller: 'wildAnimalsController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.controller('wildAnimalsController', function ($scope, $http, $rootScope, configurationParameters) {

    $scope.searchResult = [];
    $scope.makeQuery = function(event) {
        event.preventDefault();
        var form = $('#searchForm');
        var queryUrl =  "";

        if ($scope.getQueryType() == configurationParameters['name']['queryType']) { queryUrl = 'searchByName/'; }
        else if ($scope.getQueryType() == configurationParameters['species']['queryType']) { queryUrl = 'searchBySpecies/'; }
        else if ($scope.getQueryType() == configurationParameters['location']['queryType']) { queryUrl = 'searchByLocation/'; }

        $http({
            method: "POST",
            url: queryUrl,
            data: $.param(form.serializeArray()),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(
            function success(response) {
                $scope.searchResult = response.data;
                form.trigger("reset");
            },
            function error(response) {
                alert(response);
            })
    }

    /* Setters and getters */
    $scope.setQueryType = function(queryType) { $rootScope.queryType = queryType;}
    $scope.getQueryType = function() { return $rootScope.queryType; }

    $scope.setLabelDescription = function(labelDescription) { $rootScope.labelDescription = labelDescription; }
    $scope.getLabelDescription = function() { return $rootScope.labelDescription; }

    $scope.setInputGlyphicon = function(inputGlyphicon) { $rootScope.inputGlyphicon = inputGlyphicon; }
    $scope.getInputGlyphicon = function() { return $rootScope.inputGlyphicon; }

    $scope.setIncludedTemplatePath = function(includedTemplatePath) { $rootScope.includedTemplatePath = includedTemplatePath; }
    $scope.getIncludedTemplatePath = function() { return $rootScope.includedTemplatePath; }


    /* Query configuring and reseting. */
    $scope.makeQueryConfigurations = function(selectedOption) {
        $scope.setQueryType(configurationParameters[selectedOption]['queryType']);
        $scope.setLabelDescription(configurationParameters[selectedOption]['labelDescription']);
        $scope.setInputGlyphicon(configurationParameters[selectedOption]['inputGlyphicon']);
        $scope.setIncludedTemplatePath(configurationParameters[selectedOption]['includedTemplatePath']);
    }
    $scope.resetToDefault = function() {
        $scope.setQueryType("");
        $scope.setLabelDescription("");
        $scope.setInputGlyphicon("");
        $scope.setIncludedTemplatePath("");
    }
});

