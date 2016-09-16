appServices.factory('barangFactory',['$http','$rootScope',
	function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/barang';
	var barangsFactory={};

	barangsFactory.getAll=function(){
		return $http({
			method:'GET',
			url : urlApi
		})
	};

	barangsFactory.isNamaExist=function(namaCari){
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
	
	
	barangsFactory.getById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/' + id		
		});
	};

	barangsFactory.getByNamaPage=function(nama, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/nama/' + nama + '/hal/' + hal + '/jumlah/' + jumlah +'/isBarang' 				
		});
	};

	barangsFactory.getByJasaNamaPage=function(nama, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/nama/' + nama + '/hal/' + hal + '/jumlah/' + jumlah +'/isJasa' 				
		});
	};


	barangsFactory.insert = function(barang){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(barang),
			headers:{'Content-Type':'application/json'}
		});
	};

	barangsFactory.update = function(id,barang){
		return $http({
			method:'PUT',
			url:urlApi + '/'+ id,
			data:JSON.stringify(barang)
		});
	};

	barangsFactory.delete = function (id){
		return $http({
			method:'DELETE',
			url:urlApi + '/' + id
		});

	}

	return barangsFactory;

}]);