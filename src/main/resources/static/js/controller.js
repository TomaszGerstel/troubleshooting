'use strict';

angular.module('app')
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
			console.log('auth: ' + $rootScope.authority);
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
		vm.appName = 'Rozwiązywanie problemów z jakością opakowań';

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
			if (solution.description == null) return;
			ProblemService.addSolution(solution, vm.details.id,
				vm.success = function() {
					vm.loadData(solution.problemId);	// odświeża listę rozwiązań	i przyczyn danego problemu	
					vm.solution = new Solution();
				});
		}
		vm.addCause = function(cause) {
			if (cause.description == null) return;
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
			if (!vm.hasAdminAuthority()) { vm.accessInfo = 'Brak dostępu'; return; }
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
		vm.hasAdminAuthority = function() {
			if ($rootScope.authority.includes('ADMIN')) return true;
			return false;
		}
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