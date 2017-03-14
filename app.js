angular.module('app',['ui.router', 'ngRoute', 'ngResource','app.login', 'app.profile', 'ngTagsInput'])
.config(Config)
.run(Run);

Config.$inject = ['$urlRouterProvider', '$httpProvider'];

function Config($urlRouterProvider, $httpProvider){
	$urlRouterProvider.otherwise('/login/');
	$httpProvider.interceptors.push('HttpInterceptor');
}

Run.$inject = ['$state', '$rootScope','LoginService'];
function Run($state, $rootScope, LoginService){

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		if(!LoginService.isUserLoggedIn() && toState.name != 'login'){
			event.preventDefault();
			$state.go('login');
		} else if(LoginService.isUserLoggedIn() && toState.name != 'profile'){
			event.preventDefault();
			$state.go('profile');
		}
	});
}