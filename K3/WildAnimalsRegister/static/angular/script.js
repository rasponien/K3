/** Created by carlcustav on 3/21/2017. */
var app = angular.module('wildAnimals', ['ngRoute']);
app.config([ '$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');
} ]);
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/searchByName", {
            templateUrl: "/static/templates/AngularTemplates/search.html",
            controller: 'wildAnimalsController'
        })
        .when("/searchBySpecies", {
            templateUrl: "/static/templates/AngularTemplates/searchBySpecies.html",
            controller: 'wildAnimalsController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.controller('wildAnimalsController', function ($scope, $http) {

    $scope.searchResult = [];
    $scope.isSearching = false;
    $scope.isMakingQuery = false;

    $scope.searchByName = function(event) {
        event.preventDefault();
        var form = $('#FormSearchByName');
        $http({
            method: "POST",
            url: 'searchByName/',
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

      $scope.searchBySpecies = function(event) {
        event.preventDefault();
        var form = $('#FormSearchBySpecies');
        $http({
            method: "POST",
            url: 'searchBySpecies/',
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

    $scope.setBackToDefault = function() {
        $scope.isSearching = false;
        $scope.isMakingQuery = false;
    }
});



app.controller('wildAnimalsSpeciesController', function ($scope, $http) {

    $scope.searchResult = [];
    $scope.isSearching = false;
    $scope.isMakingQuery = false;

    $scope.searchByName = function(event) {
        event.preventDefault();
        var form = $('#FormSearchBySpecies');
        $http({
            method: "POST",
            url: 'searchBySpecies/',
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

    $scope.setBackToDefault = function() {
        $scope.isSearching = false;
        $scope.isMakingQuery = false;
    }
});