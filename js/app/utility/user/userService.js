appServices.factory('userFactory', ['$http','$rootScope', function($http,$rootScope){
	
	var urlApi = $rootScope.pathServerJSON + '/api/user';
	var userFactory = {};

	userFactory.getAllUser=function(hal, jumlah){
		return $http({
			url:urlApi + '/nama/--/hal/' + hal + '/jumlah/' + jumlah,
			method:'GET'
		})
	};

	userFactory.getUserByNama=function(nama, hal, jumlah){
		return $http({
			url : urlApi + '/nama/' + nama + '/hal/' + hal + '/jumlah/' + jumlah,
			method:'GET'
		})
	};

	userFactory.getUserById=function(id){
		return $http({
			url : urlApi + '/' + id,
			method : 'GET'
		})
	};

	userFactory.getByUserId=function(userId){
		return $http({
			url : urlApi + '/userId/' + userId ,
			method : 'GET'
		})
	};

	userFactory.insertUser = function(user){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(user),
			headers:{'Content-Type':'application/json'}
		});
	};

	userFactory.updateUser = function(id,user){
		return $http({
			method:'PUT',
			url:urlApi + '/'+ id,
			data:JSON.stringify(user)
		});
	};

	userFactory.deleteUser = function (id){
		return $http({
			method:'DELETE',
			url:urlApi + '/id/' + id
		});
	}

	return userFactory;

}])