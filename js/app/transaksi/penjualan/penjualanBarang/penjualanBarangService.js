appServices.factory('penjualanHdFactory',['$http','$rootScope',
	function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/penjualanHd';
	var penjualanHd={};

	penjualanHd.getById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/' + id
		});
	};	

	penjualanHd.getByNamaTanggalPage=function(nama, tgl1, tgl2, hal, jumlah, isTransBarang){
		return $http({
			method:'GET',
			url:urlApi + '/namaCust/' + nama + '/tgl1/' + tgl1 +'/tgl2/' + tgl2 + '/hal/' + hal + '/jumlah/' + jumlah  + '/isTransBarang/' + isTransBarang
		});
	};


	penjualanHd.insert = function(penjualanHdDto){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(penjualanHdDto),
			headers:{'Content-Type':'application/json'}
		});
	};

	penjualanHd.approve = function(idHD, idGudang){
		return $http({
			method:'POST',
			url:urlApi + '/approve/' + idHD + '/idGudang/' + idGudang,
			data:JSON.stringify(penjualanHd),
			headers:{'Content-Type':'application/json'}
		});
	};

	penjualanHd.batalApprove = function(idHD, idGudang){
		return $http({
			method:'POST',
			url:urlApi + '/batalApprove/' + idHD + '/idGudang/' + idGudang,
			data:JSON.stringify(penjualanHd),
			headers:{'Content-Type':'application/json'}
		});
	};

	penjualanHd.update = function(id,penjualanHd){
		return $http({
			method:'PUT',
			url:urlApi + '/'+ id,
			data:JSON.stringify(penjualanHd)
		});
	};

	penjualanHd.hitungTotal = function(idHD){
		return $http({
			method:'GET',
			url:urlApi + '/total/'+ idHD
		});
	};

	penjualanHd.getAllApprovedPage=function(namaCust, tgl1, tgl2, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/approved/namaCust/' + namaCust + '/tgl1/' + tgl1 +'/tgl2/' + tgl2 + '/hal/' + hal + '/jumlah/' + jumlah  
		});
	};

	penjualanHd.pembayaran = function(pembayaranDto){
		return $http({
			method:'POST',
			url:urlApi + '/pembayaran',
			data:JSON.stringify(pembayaranDto),
			headers:{'Content-Type':'application/json'}
		});
	};

	return penjualanHd;

}]);