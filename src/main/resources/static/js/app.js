'use strict';

angular.module('app', ['ngRoute', 'ngResource'])
	.config(function($routeProvider) {
		$routeProvider
			.when('/problems', {
				templateUrl: 'partials/problems.html',
				controller: 'ProblemController',
				controllerAs: 'problemContr'
			})
			.when('/problems/:id', {
				templateUrl: 'partials/problems.html',
				controller: 'ProblemController',
				controllerAs: 'problemContr'
			})
			.when('/register', {
				templateUrl: 'partials/register.html',
				controller: 'RegisterController',
				controllerAs: 'regCtrl'
			})
			.when('/login', {
				templateUrl: 'partials/login.html',
				controller: 'ProblemController',
				controllerAs: 'problemContr'
			})
			.when('/info', {
				templateUrl: 'partials/info.html',
				controller: '',
				controllerAs: ''
			})
			.otherwise({
				redirectTo: '/problems'
			});
	})
	//.constant('LOGIN_ENDPOINT', 'login')
	//.constant('LOGOUT_ENDPOINT', 'logout')
	.service('AuthenticationService', function($http) {
		var vm = this;
		vm.loginErr = false;
		this.authenticate = function(credentials, successCallback) {
			var authHeader = { Authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password) };
			var config = { headers: authHeader };
			$http
				.post('login', {}, config)
				.then(function success(value) {
					$http.defaults.headers.post.Authorization = authHeader.Authorization;
					successCallback();

				}, function error(reason) {

					console.log('Login error');
					console.log(reason);
					vm.loginErr = true;
					//	window.location.reload();

					//alert(vm.errMessage);
				});
		}
		this.logout = function(successCallback) {
			delete $http.defaults.headers.post.Authorization;
			(successCallback());
		}

		//	this.register = function(name, password) {
		//		user = new User();	
		//		user.name = name;
		//		user.password = password;
		//		var parameters = {user: user};
		// 		$http
		//		.post(REGISTER_ENDPOINT, {params: parameters})
		//		;
		//	}

	})
	.controller('RegisterController', function($http, $location, $resource) {
		var vm = this;
		var User = $resource('register');
		vm.user = new User();
		vm.register = function(user) {
			console.log(vm.user._proto_);
			vm.user.name = vm.name;
			vm.user.password = vm.password;
			vm.user.$save(function() {
				vm.user = new User();
		//		$location.path('/');
		//		alert('rejestracja udana!');
				vm.errorMessage = 'Rejestracja się powiodła! Możesz się zalogować.'

			},
				function error(response) {
					console.log(response.status);
					if (response.status == 409) {
						vm.errorMessage = response.data;
						console.log(response.data);
					}
					else {
						vm.errorMessage = 'Rejestracja nieudana!';
					}
					vm.message = '';
				}
			)
		}
	})
	.controller('ProblemController', function($http, $resource, $rootScope, $location, AuthenticationService) {

		var vm = this;

		var Problem = $resource('api/problems/:problemId');
		var Solution = $resource('api/problems/solutions/:problemId');
		var Cause = $resource('api/problems/causes/:problemId');

		var loginSuccess = function() {
			$rootScope.authenticated = true;
			$location.path('/');
		}

		var logoutSuccess = function() {
			$rootScope.authenticated = false;
			$location.path('/');
		}

		var User = $resource('register/:userId');

		vm.credentials = {};
		vm.problem = new Problem();
		vm.solution = new Solution();
		vm.cause = new Cause();
		vm.user = new User();

		function refreshData() {
			vm.problems = Problem.query(
				function success(data, headers) {
					console.log('Pobrano dane: ' + data);
					console.log(headers('Content-Type'));
				},
				function error(response) {
					console.log(response.status);
				});
		}

		vm.addSolution = function(solution) {
			console.log(vm.solution._proto_);
			vm.solution.problemId = vm.details.id;
			vm.solution.$save(function(data) {
				vm.loadData(solution.problemId);	// odświeża listę rozwiązań		
				vm.solution = new Solution();
			});
		}

		vm.addCause = function(cause) {
			console.log(vm.cause._proto_);
			vm.cause.problemId = vm.details.id;
			vm.cause.$save(function(data) {
				vm.loadData(cause.problemId);	// odświeża listę przyczyn	
				vm.cause = new Cause();
			});
		}

		vm.loadData = function(id) {
			console.log("user: " + vm.credentials.username);
			vm.showSolutionForm = false;
			vm.showCauseForm = false;
			vm.details = Problem.get({ problemId: id });
			vm.solutions = Solution.query({ problemId: id }, function success(data, headers) {
				console.log('Pobrano dane: ' + data);
				console.log(headers('Content-Type'));
			},
				function error(response) {
					console.log(response.status);
				});
			vm.causes = Cause.query({ problemId: id }, function success(data, headers) {
				console.log('Pobrano dane: ' + data);
				console.log(headers('Content-Type'));
			},
				function error(response) {
					console.log(response.status);
				});
		}

		vm.login = function() {
			AuthenticationService.authenticate(vm.credentials, loginSuccess);
			if (AuthenticationService.loginErr == true) vm.showErrMess();
		}

		vm.showErrMess = function() {
			vm.showErrMessage = true;
		}

		vm.logout = function() {
			AuthenticationService.logout(logoutSuccess);
		}

		//		vm.register = function() {
		//		AuthenticationService.register(vm.name, vm.password);			
		//	}

		vm.showAddSolutionForm = function() {
			vm.showSolutionForm = true;
		}

		vm.showAddCauseForm = function() {
			vm.showCauseForm = true;
		}

		vm.appName = 'Rozwiązywanie problemów z jakością opakowań';
		refreshData();
	})
	.config(function($httpProvider) {
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	});





