appServices.factory('returDtFactory',['$http','$rootScope',
	function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/returDt';
	var returBarangDt={};	

	returBarangDt.getById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/' + id
		});
	};

	returBarangDt.delete=function(id){
		return $http({
			method:'DELETE',
			url:urlApi + '/' + id
		});
	};

	returBarangDt.getByIdHd=function(idHd, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/idHd/' + idHd + '/hal/' + hal + '/jumlah/' + jumlah
		});
	};	

	returBarangDt.insert = function(returBarangDt){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(returBarangDt),
			headers:{'Content-Type':'application/json'}
		});
	};

	return returBarangDt;

}]);