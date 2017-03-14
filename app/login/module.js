angular.module('app.login',['ui.router']).config(Config);

Config.$inject = ['$stateProvider'];


function Config($stateProvider){
	$stateProvider
        .state('login', {
            url: '/login/',
            templateUrl: 'app/login/login.html',
            controller: 'LoginController',
        });
}