angular.module('app.login')
.factory('LoginService', LoginService)
.factory('HttpInterceptor', HttpInterceptor);

LoginService.$inject =['$window', '$resource', '$http'];

function LoginService($window, $resource, $http){

	var loginService = {
		isUserLoggedIn:isUserLoggedIn,
		signoutUser: signoutUser,
		login: login,
		register: register
	};

	function login(name, pass){
		var data = {};
		data.name = name;
		data.password = pass;
		
		return $resource('http://127.0.0.1:8080/api/login',{}).save(data, success, error);
        
        function success(data) {
            $window.localStorage.setItem('token', data.token);
            return data;
        }

        function error(response) {
            return response;
        }
	}

	function isUserLoggedIn(){
		var token = $window.localStorage['token'];
		if(token != "" && token != undefined)
			return true;
		return false;
	}

	function signoutUser(){
		$window.localStorage.removeItem('token');
	}

	function register(email, name, password){
		var data = {};
		data.email = email;
		data.name = name;
		data.password = password;
		
		return $resource('http://127.0.0.1:8080/api/register',{}).save(data, success, error);
        
        function success(data) {
            $window.localStorage.setItem('token', data.token);
            return data;
        }

        function error(response) {
            return response;
        }
	}
	return loginService;
}

HttpInterceptor.$inject = ['$injector','$q', '$window'];

function HttpInterceptor($injector, $q, $window) {
    return {
        request: function (config) {
        	var token = $window.localStorage.getItem('token');
        	if(token != undefined)
            	config.headers.token = $window.localStorage.getItem('token');
            return config;
        },

        requestError: function (config) {
            return config;
        },

        response: function (res) {
            return res;
        },

        responseError: function (res) {
            if (res.status == 401) {
                $injector.get('LoginService').signoutUser();
                $injector.get('$state').go('login');
            }
            return $q.reject(res);
        }
    }
};