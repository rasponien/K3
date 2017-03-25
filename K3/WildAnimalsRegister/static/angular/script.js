<<<<<<< HEAD
/** Created by carlcustav on 3/21/2017. */
var app = angular.module('wildAnimals', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/search", {
            templateUrl: "templates/lisamine.html",
            controller: 'DogsController'
        })
        .otherwise({
            redirectTo: '/'
        });
});
app.controller('wildAnimalsController', function ($scope, $http) {

    $scope.searchResult = [];
    $scope.queryType = '';

    $scope.searchByName = function(event) {
        event.preventDefault();
        var form = $('#FormSearchByName');
        $http({
            method: "POST",
            url: 'searchByName/',
            data: $.param(form.serializeArray()),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(
            function success(response) { $scope.searchResult = response.data; },
            function error(response) { alert(response); })
    }

    //getters & setters
     $scope.setQueryType = function (queryType) {
        $scope.queryType = queryType;
    }
    $scope.getQueryType = function () {
        return $scope.queryType;
    }


});
=======
/**
 * Created by carlcustav on 3/21/2017.
 */
var app = angular.module('wildAnimals', []);

app.controller('wildAnimalsController', function ($scope, $http) {

    $scope.searchResult = [];
    $scope.searchByName = function(event) {
        event.preventDefault();
        var form = $('#FormSearchByName');
        $http({
            method: "POST",
            url: 'searchByName/',
            data: $.param(form.serializeArray()),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(
            function success(response) { $scope.searchResult = response.data; },
            function error(response) { alert(response); })
    }


});
>>>>>>> c067a0d717779ebd6f92b63ce6a8e6c03146fe58
