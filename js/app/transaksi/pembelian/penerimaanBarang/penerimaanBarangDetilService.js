appServices.factory('penerimaanDtFactory',['$http','$rootScope',
	function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/penerimaanDt';
	var penerimaanHd={};

	penerimaanHd.getById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/' + id
		});
	};

	penerimaanHd.delete=function(id){
		return $http({
			method:'DELETE',
			url:urlApi + '/' + id
		});
	};

	penerimaanHd.getByIdHd=function(idHd, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/idHd/' + idHd + '/hal/' + hal + '/jumlah/' + jumlah
		});
	};	

	penerimaanHd.insert = function(penerimaanHd){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(penerimaanHd),
			headers:{'Content-Type':'application/json'}
		});
	};

	return penerimaanHd;

}]);