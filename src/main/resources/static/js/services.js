angular.module('app')



.service('AuthenticationService', function($http) {
	
 	this.authenticate = function(credentials, successCallback) {
 		var authHeader = {Authorization: 'Basic ' + btoa(credentials.username+':'+credentials.password)};
 		var config = {headers: authHeader};
 		$http
 		.post(LOGIN_ENDPOINT, {}, config)
 		.then(function success(value) {
			$http.defaults.headers.post.Authorization = authHeader.Authorization;
 			successCallback();
 		}, function error(reason) {
 			console.log('Login error');
 			console.log(reason);
 		});
 	}
	this.logout = function(successCallback) {
 		$http.post(LOGOUT_ENDPOINT)
 		.then(successCallback());
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
 });

const LOGIN_ENDPOINT = '/login';
const LOGOUT_ENDPOINT = '/logout';
const REGISTER_ENDPOINT = '/api/register';

