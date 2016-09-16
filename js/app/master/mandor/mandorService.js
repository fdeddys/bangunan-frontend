appServices.factory('mandorService', ['$http','$rootScope',
	function($http, $rootScope){
	
	var urlApi = $rootScope.pathServerJSON + '/api/mandor';
	var mandorService={};

	mandorService.getAll=function(){
		return $http({
			method:'GET',
			url : urlApi
		})
	};
	
	mandorService.getById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/' + id		
		});
	};

	mandorService.getByNamaPage=function(nama, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/nama/' + nama + '/hal/' + hal + '/jumlah/' + jumlah  				
		});
	};

	mandorService.insert = function(mandor){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(mandor),
			headers:{'Content-Type':'application/json'}
		});
	};

	mandorService.update = function(id,mandor){
		return $http({
			method:'PUT',
			url:urlApi + '/'+ id,
			data:JSON.stringify(mandor)
		});
	};

	return mandorService;
	
}])