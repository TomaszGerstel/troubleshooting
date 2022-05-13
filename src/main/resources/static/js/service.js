'use strict';

angular.module('app')
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
					$rootScope.authority = JSON.stringify(value.data.authorities);	
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
			if (comment.author == null || comment.message == null) return;
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