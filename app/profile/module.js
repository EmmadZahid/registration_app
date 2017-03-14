angular.module('app.profile',['ui.router']).config(Config);

Config.$inject = ['$stateProvider'];


function Config($stateProvider){
	$stateProvider
        .state('profile', {
            url: '/profile/',
            templateUrl: 'app/profile/profile.html',
            controller: 'ProfileController',
        });
}