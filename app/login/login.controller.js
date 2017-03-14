angular.module('app.login')
.controller('LoginController', LoginController);

LoginController.$inject = ['$scope', '$state', 'LoginService'];

function LoginController($scope, $state, LoginService){
	$scope.isLoginError = false;
	$scope.loginError = "";
	$scope.disableLoginForm = false;
	$scope.disableRegForm = false;
	$scope.regError = "";
	var vm = this;

	vm.init = function(){
		
	};

	vm.init();

	//*************************
	// Scope functions
	//*************************

	$scope.registerBtnClick = function(form){
		$scope.regError = "";
		var name = ($scope.regUsername != undefined) ? $scope.regUsername.trim() : "";
		var password = ($scope.regPassword != undefined) ? $scope.regPassword.trim() : "";
		if(form.regEmail.$valid){
			if(name.length >= 6){
				if(password.length >= 6){
					$scope.disableRegForm = true;
					LoginService.register($scope.regEmail, name, password).$promise.then(registerSuccess, registerError);
				} else{
					form.regPassword.$invalid = true;
					form.regEmail.$touched = true;
					$('#regPassword').focus();
				}
			} else{
				form.regUsername.$invalid = true;
				form.regEmail.$touched = true;
				$('#regUsername').focus();
			}
		} else{
			form.regEmail.$touched = true;
			form.regEmail.$invalid = true;
			$('#regEmail').focus();
		}
	}

	$scope.loginBtnClick = function(loginForm){
		$scope.loginError = "";
		var name = ($scope.name != undefined) ? $scope.name.trim() : "";
		var password = ($scope.password != undefined) ? $scope.password.trim() : "";
		if(name.length > 0){
			if(password.length > 0){
				$scope.disableLoginForm = true;
				LoginService.login(name, password).$promise.then(loginSuccess, loginError);
			} else{
				loginForm.loginPassword.$invalid = true;
				loginForm.loginPassword.$touched = true;
				$("#loginPassword").focus();
			}
		} else{
			loginForm.loginName.$invalid = true;
			loginForm.loginName.$touched = true;
			$("#loginName").focus();
		}
	}

	//************************
	// Data functions
	//************************

	function loginSuccess(data){
		$scope.disableLoginForm = false;
		$state.go('profile');
	}

	function loginError(res){
		$scope.disableLoginForm = false;
		if(res.status == 400){
			$scope.loginError = res.data.msg;
		} else{
			$scope.loginError = "Network Error";
		}
	}

	function registerSuccess(data){
		$state.go('profile');
	}

	function registerError(res){
		$scope.disableRegForm = false;
		if(res.status == 400){
			$scope.regError = res.data.msg;
		}
	}

}