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

	.service('AuthenticationService', function($rootScope, $http, $resource) {
		var vm = this;
		var CurrentUserId = $resource('api/user/userid/:userName');
		var CurrentUserRole = $resource('api/user/userRole/:userId');
		vm.name;
		vm.currentId;
		vm.registerMessage;
		
		vm.authenticate = function(credentials, successCallback, errorCallback) {
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
						errorCallback();
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
				vm.currentUserRole(data.id);

			},
				function error(response) {
					console.log(response.status);
				});
		};
		vm.currentUserRole = function(id) {
			vm.getCurrentRole = CurrentUserRole.get({ userId: id }, function success(data, headers) {
				console.log('Pobrano dane: ' + data.role);
				console.log(headers('Content-Type'));
				$rootScope.currentRole = data.role;
			},
				function error(response) {
					console.log(response.status);
				})
		}
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
	.service('ProblemService', function($http, AuthenticationService, Problem,
		Problems, Solution, Cause, DeleteSolution, DeleteCause, NewProblem, ProblemsCount) {
		var vm = this;

		vm.problem = new Problem();
		vm.problems = {};
		vm.solution = new Solution();
		vm.cause = new Cause();
		vm.userName = AuthenticationService.name;
		vm.causeToDelete = new DeleteCause();
		vm.solutionToDelete = new DeleteSolution();
		vm.newProblem = new NewProblem();
		vm.formData = new FormData();
		vm.problemsCount = new ProblemsCount();
		
		vm.getProblemsCount = function() {
			return ProblemsCount.get(
				function success(data, headers) {
					console.log('Pobrano dane, licznik problemów: ' + data.problemsQuantity);
					console.log(headers('Content-Type'));					
				},
				function error(response) {
					console.log(response.status);
				});
		}			
		vm.getProblemsList = function(name, successCallback) {
			return Problems.query({ problemName: name },
				function success(data, headers) {
					console.log('Pobrano dane: ' + JSON.stringify(data));
					console.log(headers('Content-Type'));
					successCallback();
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
		vm.addProblem = function(problem, filename, successCallback) {
			vm.newProblem = problem;
			vm.newProblem.imageAddress = filename;
			vm.newProblem.$save(function(data) {
				console.log('Dodano nowy problem: ' + JSON.stringify(data));
				successCallback();
				vm.newProblem = new NewProblem();
			})
		}
		vm.addNewProblemImage = function(file) {
			if (file.name == "") {
				console.log('brak grafiki dla nowego problemu');
				return;
			}
			vm.formData.append('file', file);
			vm.formData.append('filename', file.name)
			$http({
				method: 'POST',
				url: 'api/problem/newProblemImage',
				transformRequest: angular.identity,
				headers: { 'Content-Type': undefined },
				data: vm.formData,
			}).then(function success(response) {
				console.log('Data saved ' + response);
			}, function error(response) {
				console.log('Data not saved ' + response);
			});
			vm.formData = new FormData();
		}

	})
	.service('InfoService', function(Comment) {
		
		var vm = this;
		vm.comment = new Comment();

		vm.addNewComment = function(comment, successCallback) {
			if(comment.author == null || comment.message == null) return;
			vm.comment = comment;			
			vm.comment.$save(function(data) {
				console.log('Wysłano wiadomość: ' + JSON.stringify(data));
				successCallback();
				vm.comment = new Comment();
			});
		}
		vm.getComments = function() {
			return Comment.query(
				function success(data, headers) {
					console.log('Pobrano dane: ' + JSON.stringify(data));
					console.log(headers('Content-Type'));
				},
				function error(response) {
					console.log(response.status);
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
		vm.showErrMessage = false;
		
		var loginSuccess = function() {
			$rootScope.authenticated = true;
			$location.path('/problems');
		}
		var logoutSuccess = function() {
			$rootScope.authenticated = false;
			$location.path('/');
		}
		vm.login = function() {
			AuthenticationService.authenticate(vm.credentials, loginSuccess, vm.showErrMess);
		}
		vm.showErrMess = function() {
			vm.showErrMessage = true;
		}
		vm.logout = function() {
			AuthenticationService.logout(logoutSuccess);
		}
	})
	.controller('ProblemController', function($rootScope, $location, AuthenticationService, ProblemService,
		Solution, Cause, DeleteSolution, DeleteCause, NewProblem, InfoService) {

		var vm = this;
		vm.problems = {};
		vm.solution = new Solution();
		vm.cause = new Cause();
		vm.userName = AuthenticationService.name;
		vm.causeToDelete = new DeleteCause();
		vm.solutionToDelete = new DeleteSolution();
		vm.newProblem = new NewProblem();
		vm.comments = {};
		vm.image;
		const imagesFolderOnServer = '../../../../trouble_images/';
		vm.details;
		vm.file = {};
		vm.file.name = "";
		vm.accessInfo = "";
		vm.problemsCount = 0;

		vm.refreshData = function(name) {
			vm.problemsCount = ProblemService.getProblemsCount();
			vm.problems = ProblemService.getProblemsList(name, vm.success = function() {
			}
			);

		}
		vm.loadComments = function() {
			vm.comments = InfoService.getComments(vm.success = function() {
			});
		}		
		
		vm.addSolution = function(solution) {
			if(solution.description == null) return;
			ProblemService.addSolution(solution, vm.details.id,
				vm.success = function() {
					vm.loadData(solution.problemId);	// odświeża listę rozwiązań	i przyczyn danego problemu	
					vm.solution = new Solution();
				});
		}
		vm.addCause = function(cause) {
			if(cause.description == null) return;
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
		vm.addNewProblem = function() {
			if (vm.newProblem.name == null || vm.newProblem.description == null) return;
			if ($rootScope.currentRole != 'ADMIN') { vm.accessInfo = 'Brak dostępu'; return; }
			ProblemService.addNewProblemImage(vm.file);
			ProblemService.addProblem(vm.newProblem, vm.file.name,
				vm.success = function() {
					console.log("Dodano problem");
					$location.path('/');
				});
			vm.file = {};
			vm.file.name = "";
		}
		vm.loadData = function(id) {			
			vm.showSolutionForm = false;
			vm.showCauseForm = false;
			vm.problemsCount = ProblemService.getProblemsCount();
			vm.details = ProblemService.getProblemDetails((id),
				vm.success = function() {
					if (vm.details.imageAddress == null) { vm.image = 'images/temporary.png' }
					else vm.image = imagesFolderOnServer + vm.details.imageAddress;
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
	.controller('InfoController', function(InfoService, Comment) {

		var vm = this;
		vm.comment = new Comment();
		vm.addCommentMess = "";

		vm.addComment = function() {
			vm.addCommentMess = "";
			InfoService.addNewComment(vm.comment,
				vm.success = function() {
					console.log("comment added")
					vm.comment = new Comment();
					vm.addCommentMess = "Wiadomość wysłana!";
				},
				);
		}
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
		});





