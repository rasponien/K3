/** Created by carlcustav on 3/21/2017. */
var app = angular.module('wildAnimals', ['ngRoute']);
app.config([ '$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');
} ]);
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/add", {
            template: "hello",
            controller: 'wildAnimalsController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.controller('wildAnimalsController', function ($scope, $http) {

    $scope.searchResult = [];
    $scope.queryType = '';
    $scope.isSearching = false;

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

    //getters & setters
    $scope.setQueryType = function (queryType) {
        $scope.queryType = queryType;
        $scope.isSearching = true;
        $scope.searchResult = [];
    }
    $scope.getQueryType = function () {
        return $scope.queryType;
    }

    $scope.showQueryTypes = function() {
        $scope.queryType = 'none';
        $scope.isSearching = false;
    }
});