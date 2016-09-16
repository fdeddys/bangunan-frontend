appServices.factory('supplierFactory',['$http','$rootScope',
	function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/supplier';
	var suppliersFactory={};

	suppliersFactory.getAll=function(){
		return $http({
			method:'GET',
			url : urlApi
		})
	};
	
	suppliersFactory.getById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/' + id		
		});
	};

	suppliersFactory.getByNamaPage=function(nama, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/nama/' + nama + '/hal/' + hal + '/jumlah/' + jumlah  				
		});
	};


	suppliersFactory.insert = function(supplier){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(supplier),
			headers:{'Content-Type':'application/json'}
		});
	};

	suppliersFactory.update = function(id,supplier){
		return $http({
			method:'PUT',
			url:urlApi + '/'+ id,
			data:JSON.stringify(supplier)
		});
	};

	suppliersFactory.delete = function (id){
		return $http({
			method:'DELETE',
			url:urlApi + '/' + id
		});

	}

	suppliersFactory.isNamaExist=function(namaCari){
		var cekNama={
			'nama':namaCari
		}

		return $http({
			method:'POST',
			url : urlApi + '/isNamaExist',
			data:JSON.stringify(cekNama),
			headers:{'Content-Type':'application/json'}
		})
	};

	return suppliersFactory;

}]);