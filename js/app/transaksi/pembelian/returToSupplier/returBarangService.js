appServices.factory('returBarangFactory',['$http','$rootScope',
	function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/returHd';
	var returBarangHd={};

	returBarangHd.getById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/' + id
		});
	};	

	returBarangHd.getByNamaTanggalPage=function(nama, tgl1, tgl2, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/nama/' + nama + '/tglAwal/' + tgl1 +'/tglAkhir/' + tgl2 + '/hal/' + hal + '/jumlah/' + jumlah  				
		});
	};


	returBarangHd.insert = function(returBarangHdDto){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(returBarangHdDto),
			headers:{'Content-Type':'application/json'}
		});
	};

	returBarangHd.approve = function(idHD, idGudang){
		return $http({
			method:'POST',
			url:urlApi + '/approve/' + idHD + '/idGudang/' + idGudang,			
			headers:{'Content-Type':'application/json'}
		});
	};

	returBarangHd.update = function(id,returBarangHdDto){
		return $http({
			method:'PUT',
			url:urlApi + '/'+ id,
			data:JSON.stringify(returBarangHdDto)
		});
	};

	returBarangHd.hitungTotal = function(idHD){
		return $http({
			method:'GET',
			url:urlApi + '/total/'+ idHD
		});
	};

	return returBarangHd;

}]);