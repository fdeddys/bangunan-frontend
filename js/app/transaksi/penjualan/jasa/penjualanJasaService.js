appServices.factory('penjualanJasaService', ['$http','$rootScope' ,
	function($http,$rootScope){

	var penjualanJasaService ={};
	var urlApi = $rootScope.pathServerJSON + '/api/penjualanJasa';

	penjualanJasaService.getById = function(id){
		return $http({
			method : 'GET',
			url : urlApi + '/' + id
		})
	};

	penjualanJasaService.getByNamaTanggalPage = function(nama, tglAwal, tglAkhir, hal, jumlah){
		return $http({
			method : 'GET',
			headers : {"Content-type":"application/json"},
			url : urlApi +'/nama/' + nama + '/tgl1/' + tglAwal+ '/tgl2/' + tglAkhir + '/hal/' + hal + '/jumlah/' + jumlah
		})

	}

	penjualanJasaService.save = function(penjualanJasa){
		return $http({
			method : 'POST',
			data : JSON.Stringify(penjualanJasa),
			headers : {"Content-type":"application/json"},
			url : urlApi 
		})
	};

	penjualanJasaService.edit = function(id, penjualanJasa){
		return $http({
			method : 'PUT',
			data : JSON.Stringify(penjualanJasa),
			headers : {'Content-type' : 'application/json'},
			url : urlApi + '/' + id
		})
	}

	return penjualanJasaService;
}])