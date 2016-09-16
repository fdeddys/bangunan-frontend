appServices.factory('historyBarangFactory',['$http','$rootScope',
	function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/historyBarang';
	var historyBarangFactory={};

	historyBarangFactory.getAll=function(idBarang,idGudang,tgl1,tgl2,hal,jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/barang/'+idBarang+'/gudang/'+idGudang+'/tgl1/'+tgl1+'/tgl2/'+tgl2+'/hal/'+hal+'/jumlah/'+jumlah
		});
	};	

	

	return historyBarangFactory;

}]);