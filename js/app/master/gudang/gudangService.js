appServices.factory('gudangFactory',['$http','$rootScope',
	function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/gudang';
	var gudangFactory={};

	gudangFactory.getAll=function(){
		return $http({
			method:'GET',
			url : urlApi +'/all'
		})
	};
	
	gudangFactory.getById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/' + id		
		});
	};

	gudangFactory.getByNamaPage=function(nama, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/nama/' + nama + '/hal/' + hal + '/jumlah/' + jumlah  				
		});
	};


	gudangFactory.insert = function(barang){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(barang),
			headers:{'Content-Type':'application/json'}
		});
	};

	gudangFactory.update = function(id,barang){
		return $http({
			method:'PUT',
			url:urlApi + '/'+ id,
			data:JSON.stringify(barang)
		});
	};

	gudangFactory.delete = function (id){
		return $http({
			method:'DELETE',
			url:urlApi + '/' + id
		});

	}

	return gudangFactory;

}]);