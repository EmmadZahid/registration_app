angular.module('app.profile')
.factory('ProfileService', ProfileService);

ProfileService.$inject =['$window', '$resource', '$http'];

function ProfileService($window, $resource, $http){
	var profileService = {
		getUserProfile: getUserProfile,
		downloadUserProfileImage: downloadUserProfileImage,
		uploadUserProfileImage: uploadUserProfileImage,
        updateTags: updateTags,
        getTags: getTags,
        saveComment: saveComment
	};

    function saveComment(c){
        var data = {};
        data.comment = c;
        return $resource('http://127.0.0.1:8080/api/comment').save(data, success, error);
        
        function success(data) {
            return data;
        }

        function error(response) {
            return response;
        }
    }

    function getTags(query){
        return $resource('http://127.0.0.1:8080/api/tags').query({'query':query},success, error);
        
        function success(data) {
            return data;
        }

        function error(response) {
            return response;
        }
    }

    function updateTags(tags){
        var data = {};
        data.tags = tags;
        return $resource('http://127.0.0.1:8080/api/tags').save(data, success, error);
        
        function success(data) {
            return data;
        }

        function error(response) {
            return response;
        }
    }

	function getUserProfile(){
		return $resource('http://127.0.0.1:8080/api/profile').get(success, error);
        
        function success(data) {
            return data;
        }

        function error(response) {
            return response;
        }
	}

	function downloadUserProfileImage(){		
		return $resource('http://127.0.0.1:8080/api/profile-image').get(success, error);
        
        function success(data) {
        	delete data.$promise;
            delete data.$resolved;
            return data;
        }

        function error(response) {
            return response;
        }
	}

	function uploadUserProfileImage(){		
		return $resource('http://127.0.0.1:8080/api/profile-image').get(success, error);
        
        function success(data) {
            return data;
        }

        function error(response) {
            return response;
        }
	}

	return profileService;
}