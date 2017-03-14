angular.module('app.profile')
.controller('ProfileController', ProfileController);

ProfileController.$inject = ['$scope', '$state', '$timeout','ProfileService', 'LoginService'];

function ProfileController($scope, $state, $timeout, ProfileService, LoginService){
	var vm = this;
	$scope.isLoading = true;
	$scope.isError = false;
	$scope.tags = [];
	$scope.comment = "";
	$scope.commentName = "";
	vm.init = function(){
		$('body').scrollTop(0);
		ProfileService.getUserProfile().$promise.then(profileSuccess, profileError);
	};

	vm.init();

	//*****************************
	// Scope functions
	//*****************************

	$scope.signout = function(){
		LoginService.signoutUser();
		$state.go('login');
		$('body').scrollTop(0);
	}

	$scope.tagsChanged = function(){
		ProfileService.updateTags($scope.tags).$promise.then(function(){}, function(){});
	}

	$scope.loadTags = function($query){
		return ProfileService.getTags($query).$promise;
	}

	$scope.commentClick = function(comment){
		var c = $scope.comment.trim();
		var name = $scope.commentName.trim();
		if(c.length > 0 && name.length > 0){
			var commentObj = {};
			commentObj.name = name;
			commentObj.time = new Date().toDateString();
			commentObj.text = c;
			ProfileService.saveComment(commentObj).$promise.then(function(){
				$scope.user.comments.push(commentObj);
				$scope.comment = "";
				$scope.commentName = "";
			}, function(){});	
		}
	}
	//*****************************
	// Data fucntions
	//*****************************

	function profileSuccess(data){
		$timeout(function(){
			$scope.isLoading = false;
			$scope.user = data.profile;
			$scope.tags = $scope.user.tags;
		},2000);
	}

	function profileError(res){
		$scope.isError = true;
		$scope.isLoading = false;
	}
}