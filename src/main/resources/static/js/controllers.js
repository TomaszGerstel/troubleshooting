angular.module('app')
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
		vm.home();
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
		}
		
		vm.register = function(user) {
			console.log(vm.user._proto_);
			vm.user.name = vm.name;
			vm.user.password = vm.password;
			vm.user.$save(function(data) {
//				vm.loadData(cause.problemId);	// odświeża listę przyczyn	
				vm.user = new User();
				alert ('rejestracja udana!');				
			});
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
		
		vm.home = function() {
			window.location.reload();
		}

		vm.appName = 'Rozwiązywanie problemów z jakością opakowań';
		refreshData();
	});
	
	