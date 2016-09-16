appServices.factory('satuanFactory',['$http','$rootScope',
	function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/satuan';
	var satuanFactory={};

	satuanFactory.getAll=function(){
		return $http({
			method:'GET',
			url : urlApi +'/all'
		})
	};
	
	satuanFactory.getById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/' + id		
		});
	};

	satuanFactory.getByNamaPage=function(nama, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/nama/' + nama + '/hal/' + hal + '/jumlah/' + jumlah  				
		});
	};


	satuanFactory.insert = function(barang){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(barang),
			headers:{'Content-Type':'application/json'}
		});
	};

	satuanFactory.update = function(id,barang){
		return $http({
			method:'PUT',
			url:urlApi + '/'+ id,
			data:JSON.stringify(barang)
		});
	};

	satuanFactory.delete = function (id){
		return $http({
			method:'DELETE',
			url:urlApi + '/' + id
		});

	}

	return satuanFactory;

}]);