appServices.factory('penjualanDtFactory',['$http','$rootScope',
	function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/penjualanDt';
	var penjualanDt={};	

	penjualanDt.getById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/' + id
		});
	};

	penjualanDt.getTotalJualByIdCust=function(idCust){
		return $http({
			method:'GET',
			url:urlApi + '/totalPenjualanByIdCust/' + idCust
		});
	};

	penjualanDt.delete=function(id){
		return $http({
			method:'DELETE',
			url:urlApi + '/' + id
		});
	};

	penjualanDt.getByIdHd=function(idHd, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/idHd/' + idHd + '/hal/' + hal + '/jumlah/' + jumlah
		});
	};	

	penjualanDt.insert = function(penjualanDt){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(penjualanDt),
			headers:{'Content-Type':'application/json'}
		});
	};

	return penjualanDt;

}]);