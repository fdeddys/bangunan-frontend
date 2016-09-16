appServices.factory('penerimaanHdFactory',['$http','$rootScope',
	function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/penerimaanHd';
	var penerimaanHd={};

	penerimaanHd.getById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/' + id
		});
	};	

	penerimaanHd.getByNamaTanggalPage=function(nama, tgl1, tgl2, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/namaSupp/' + nama + '/tgl1/' + tgl1 +'/tgl2/' + tgl2 + '/hal/' + hal + '/jumlah/' + jumlah  				
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

	penerimaanHd.approve = function(idHD, idGudang){
		return $http({
			method:'POST',
			url:urlApi + '/approve/' + idHD + '/idGudang/' + idGudang,
			data:JSON.stringify(penerimaanHd),
			headers:{'Content-Type':'application/json'}
		});
	};

	penerimaanHd.update = function(id,penerimaanHd){
		return $http({
			method:'PUT',
			url:urlApi + '/'+ id,
			data:JSON.stringify(penerimaanHd)
		});
	};

	penerimaanHd.hitungTotal = function(idHD){
		return $http({
			method:'GET',
			url:urlApi + '/total/'+ idHD
		});
	};

	penerimaanHd.getAllApprovedPage=function(idSupp, tgl1, tgl2, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/idSupp/' + idSupp + '/tgl1/' + tgl1 +'/tgl2/' + tgl2 + '/hal/' + hal + '/jumlah/' + jumlah  
		});
	};	

	penerimaanHd.pembayaran = function(pembayaranDto){
		return $http({
			method:'POST',
			url:urlApi + '/pembayaran',
			data:JSON.stringify(pembayaranDto),
			headers:{'Content-Type':'application/json'}
		});
	};

	return penerimaanHd;

}]);