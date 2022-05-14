'use strict';

angular.module('app', ['ngRoute', 'ngResource'])
	.config(function($routeProvider) {
		$routeProvider
			.when('/problems', {
				templateUrl: 'partials/problems.html',
				controller: 'ProblemController',
				controllerAs: 'problemCtrl'
			})
			.when('/register', {
				templateUrl: 'partials/register.html',
				controller: 'RegisterController',
				controllerAs: 'regCtrl'
			})
			.when('/login', {
				templateUrl: 'partials/login.html',
				controller: 'LoginController',
				controllerAs: 'loginCtrl'
			})
			.when('/info', {
				templateUrl: 'partials/info.html',
				controller: 'InfoController',
				controllerAs: 'infoCtrl'
			})
			.when('/addproblem', {
				templateUrl: 'partials/new_problem.html',
				controller: 'ProblemController',
				controllerAs: 'problemCtrl'
			})
			.otherwise({
				redirectTo: '/problems'
			});
	})
	.factory('User', function($resource) {
		return $resource('api/user/register');
	})
	.factory('Problem', function($resource) {
		return $resource('api/problem/:problemId');
	})
	.factory('Problems', function($resource) {
		return $resource('api/problems/:problemName');
	})
	.factory('Solution', function($resource) {
		return $resource('api/problem/solutions/:problemId');
	})
	.factory('Cause', function($resource) {
		return $resource('api/problem/causes/:problemId');
	})
	.factory('DeleteSolution', function($resource) {
		return $resource('api/problem/solutions/:solutionId');
	})
	.factory('DeleteCause', function($resource) {
		return $resource('api/problem/causes/:causeId');
	})
	.factory('NewProblem', function($resource) {
		return $resource('api/problem/newProblem');
	})
	.factory('ProblemsCount', function($resource) {
		return $resource('api/problem/counts');
	})
	.factory('Comment', function($resource) {
		return $resource('api/problem/comments');
	})
	.directive('fileModel', ['$parse', function($parse) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;
				element.bind('change', function() {
					scope.$apply(function() {
						modelSetter(scope, element[0].files[0]);
					});
				});
			}
		};
	}])
	.config(function($httpProvider) {
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	})
	.run(function($rootScope, $location) {
		$rootScope.$on('$routeChangeSuccess', function(event) {
			gtag('config', 'G-DL5PP5TZ5P', { 'page_path': $location.path() });
			gtag('event', 'page_view');
		});
	});




