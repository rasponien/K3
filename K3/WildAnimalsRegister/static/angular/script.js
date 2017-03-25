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
