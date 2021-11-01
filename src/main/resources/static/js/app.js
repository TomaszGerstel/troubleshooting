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
				controller: '',
				controllerAs: ''
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
	.service('AuthenticationService', function($http, $resource) {
		var vm = this;
		var CurrentUserId = $resource('api/user/userid/:userName');
		vm.loginErr = false;
		vm.name;
		vm.currentId;
		vm.registerMessage;
		vm.authenticate = function(credentials, successCallback) {
			var authHeader = { Authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password) };
			var config = { headers: authHeader };
			$http
				.post('api/login', {}, config)
				.then(function success(value) {
					$http.defaults.headers.post.Authorization = authHeader.Authorization;
					vm.name = credentials.username;
					successCallback();
					vm.currentUserId();
				},
					function error(reason) {
						console.log('Login error');
						console.log(reason);
						vm.loginErr = true;
					});
		}
		vm.logout = function(successCallback) {
			delete $http.defaults.headers.post.Authorization;
			(successCallback());
		};
		vm.currentUserId = function() {
			vm.getCurrentId = CurrentUserId.get({ userName: vm.name }, function success(data, headers) {
				console.log('Pobrano dane: ' + data.id);
				console.log(headers('Content-Type'));
				vm.currentId = data.id;
			},
				function error(response) {
					console.log(response.status);
				});
		};
		vm.register = function(user, registerCallback) {
			console.log(user._proto_);
			user.$save(function() {
				vm.registerMessage = 'Rejestracja się powiodła! Możesz się zalogować.'
				registerCallback();
			},
				function error(response) {
					console.log(response.status);
					if (response.status == 409) {
						vm.registerMessage = response.data[0];
						console.log(response.data);
					}
					else {
						vm.registerMessage = 'Rejestracja nieudana!';
					}
					registerCallback();
				}
			)
		}
	})
	.service('ProblemService', function(AuthenticationService, Problem,
		Problems, Solution, Cause, DeleteSolution, DeleteCause) {
		var vm = this;

		vm.problem = new Problem();
		vm.problems = {};
		vm.solution = new Solution();
		vm.cause = new Cause();
		vm.userName = AuthenticationService.name;
		vm.causeToDelete = new DeleteCause();
		vm.solutionToDelete = new DeleteSolution();

		vm.getProblemsList = function(name) {
			return Problems.query({ problemName: name },
				function success(data, headers) {
					console.log('Pobrano dane: ' + JSON.stringify(data));
					console.log(headers('Content-Type'));
				},
				function error(response) {
					console.log(response.status);
				});
		}
		vm.getProblemDetails = function(id, successCallback) {
			return Problem.get({ problemId: id }, function success(data, headers) {
				console.log('Wybrano problem: ' + JSON.stringify(data));
				console.log(headers('Content-Type'));
				successCallback();
			}, function error(response) {
				console.log(response.status);
			});
		}
		vm.getCauses = function(id) {
			return Cause.query({ problemId: id }, function success(data, headers) {
				console.log('Pobrano przyczyny dla wybranego problemu: ' + JSON.stringify(data));
				console.log(headers('Content-Type'));
			},
				function error(response) {
					console.log(response.status);
				});
		}
		vm.getSolutions = function(id) {
			return Solution.query({ problemId: id }, function success(data, headers) {
				console.log('Pobrano rozwiązania dla wybranego problemu: ' + JSON.stringify(data));
				console.log(headers('Content-Type'));
			},
				function error(response) {
					console.log(response.status);
				});
		}
		vm.addSolution = function(solution, problemId, successCallback) {
			vm.solution = solution;
			vm.solution.userId = AuthenticationService.currentId;
			vm.solution.problemId = problemId;
			vm.solution.$save(function(data) {
				console.log('Dodano rozwiązanie: ' + JSON.stringify(data));
				successCallback();
				vm.solution = new Solution();
			});
		}
		vm.addCause = function(cause, problemId, successCallback) {
			vm.cause = cause;
			vm.cause.userId = AuthenticationService.currentId;
			vm.cause.problemId = problemId;
			vm.cause.$save(function(data) {
				console.log('Dodano przyczynę: ' + JSON.stringify(data));
				successCallback();
				vm.cause = new Cause();
			});
		}
		vm.deleteCause = function(id, successCallback) {
			vm.causeToDelete.$delete({ causeId: id })
				.then(function success() {
					console.log('Cause deleted');
					successCallback();
				},
					function error(reason) {
						console.log('deleting record error' + reason);
					});
		}
		vm.deleteSolution = function(id, successCallback) {
			vm.solutionToDelete.$delete({ solutionId: id })
				.then(function success() {
					console.log('Solution deleted');
					successCallback();
				},
					function error(reason) {
						console.log('deleting record error' + reason);
					});
		}
	})
	.controller('RegisterController', function(AuthenticationService, User) {
		var vm = this;
		vm.user = new User();
		vm.registerMassage;
		vm.register = function() {
			AuthenticationService.register(vm.user, registerCallback);
			vm.user = new User();
		}
		var registerCallback = function() {
			vm.registerMessage = AuthenticationService.registerMessage;
		}
	})
	.controller('LoginController', function($rootScope, $location, AuthenticationService) {
		var vm = this;
		vm.credentials = {};
		var loginSuccess = function() {
			$rootScope.authenticated = true;
			$location.path('/');
		}
		var logoutSuccess = function() {
			$rootScope.authenticated = false;
			$location.path('/');
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
	})
	.controller('ProblemController', function(AuthenticationService, ProblemService,
		Solution, Cause, DeleteSolution, DeleteCause) {

		var vm = this;
		vm.problems = {};
		vm.solution = new Solution();
		vm.cause = new Cause();
		vm.userName = AuthenticationService.name;
		vm.causeToDelete = new DeleteCause();
		vm.solutionToDelete = new DeleteSolution();
		vm.image;
		vm.details;

		vm.refreshData = function(name) {
			vm.problems = ProblemService.getProblemsList(name);
		}
		vm.addSolution = function(solution) {
			ProblemService.addSolution(solution, vm.details.id,
				vm.success = function() {
					vm.loadData(solution.problemId);	// odświeża listę rozwiązań	i przyczyn danego problemu	
					vm.solution = new Solution();
				});
		}
		vm.addCause = function(cause) {
			ProblemService.addCause(cause, vm.details.id,
				vm.success = function() {
					vm.loadData(cause.problemId);	// odświeża listę rozwiązań	i przyczyn danego problemu	
					vm.cause = new Cause();
				});
		}
		vm.deleteCause = function(id, problemId) {
			ProblemService.deleteCause(id,
				vm.success = function() {
					vm.loadData(problemId);
				});
		}
		vm.deleteSolution = function(id, problemId) {
			ProblemService.deleteSolution(id,
				vm.success = function() {
					vm.loadData(problemId);
				});
		}
		vm.loadData = function(id) {
			vm.showSolutionForm = false;
			vm.showCauseForm = false;
			vm.details = ProblemService.getProblemDetails((id),
				vm.success = function() {
					if (vm.details.imageAddress == null) { vm.image = 'images/temporary.png' }
					else vm.image = vm.details.imageAddress;
				});
			vm.solutions = ProblemService.getSolutions(id);
			vm.causes = ProblemService.getCauses(id);
		}
		vm.showAddSolutionForm = function() {
			vm.showSolutionForm = true;
		}
		vm.showAddCauseForm = function() {
			vm.showCauseForm = true;
		}
		vm.appName = 'Rozwiązywanie problemów z jakością opakowań';

		vm.refreshData();
	})
	.config(function($httpProvider) {
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	});





