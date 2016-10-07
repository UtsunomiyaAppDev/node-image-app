angular.module('bd', ['ngRoute'])
	.config(function ($routeProvider) {
		'use strict';		

		$routeProvider
			.when('/', {
				templateUrl : "london.html",
				controller : "londonCtrl"
			})
			.when('/employee', {
				templateUrl : "employee.html",
				controller : "empCtrl"
			});	
	});

angular.module('bd')
	.controller("londonCtrl", function ($scope, $http) {
   		$scope.imagetag = "";
   		console.log("hello");
   		$http({
   			url: 'http://localhost:8080/api/v1/image',
				method: 'GET',
			}).then(function(response) {
				console.log(response.data);
				var ml = response.data.lastIndexOf("\\");
				$scope.imagetag = "/static/images"+response.data.substring(ml);
			}, function(error) {
				alert(error.data);
			});
 
	});

angular.module('bd')
	.controller("empCtrl", function ($scope, $http){

		$http({
			url: '/api/v1/employees',
			method: 'GET'
		}).then(function(response){
			console.log(response.data);
			$scope.employees = response.data;
		}, function(error){
			console.log(error);
		});

		$http({
			url: '/api/v1/employee/n606124',
			method: 'GET',
		}).then(function(response){
			console.log(response.data[0].image);
			$scope.imageUrl = "data:image/png;base64,"+response.data[0].image;
			//var urlCreator = window.URL || window.webkitURL;
			//$scope.imageUrl = urlCreator.createObjectURL(response.data.image);
		}, function(error){
			console.log(error);
		});

	});


