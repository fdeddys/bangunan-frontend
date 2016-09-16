appServices.factory('caraBayarFactory',['$http','$rootScope',
	function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/caraBayar';
	var caraBayarFactory={};

	caraBayarFactory.getAll=function(){
		return $http({
			method:'GET',
			url : urlApi +'/all'
		})
	};
	
	caraBayarFactory.getById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/' + id		
		});
	};

	caraBayarFactory.getByNamaPage=function(nama, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/nama/' + nama + '/hal/' + hal + '/jumlah/' + jumlah  				
		});
	};


	caraBayarFactory.insert = function(barang){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(barang),
			headers:{'Content-Type':'application/json'}
		});
	};

	caraBayarFactory.update = function(id,barang){
		return $http({
			method:'PUT',
			url:urlApi + '/'+ id,
			data:JSON.stringify(barang)
		});
	};

	return caraBayarFactory;

}]);