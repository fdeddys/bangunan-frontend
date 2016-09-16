appServices.factory('dashboardFactory',['$http','$rootScope', function($http,$rootScope){
	
	var urlApi = $rootScope.pathServerJSON + '/api/dashboard';
	var dashboardFactory={};

	dashboardFactory.getPenjualan=function(tgl1, tgl2){
		return $http({
			method:'GET',
			url : urlApi +'/penjualan/tglAwal/'+tgl1+'/tglAkhir/'+tgl2
		})
	};

	dashboardFactory.getPembelian=function(tgl1, tgl2){
		return $http({
			method:'GET',
			url : urlApi +'/penerimaan/tglAwal/'+tgl1+'/tglAkhir/'+tgl2
		})
	};

	dashboardFactory.getTglAwal=function(){
		return $http({
			method:'GET',
			url : urlApi +'/tglAwal'
		})
	};

	dashboardFactory.getTglAkhir=function(){
		return $http({
			method:'GET',
			url : urlApi +'/tglAkhir'
		})
	};

	dashboardFactory.getTopCustomer=function(tgl1, tgl2){
		return $http({
			method:'GET',
			url : urlApi +'/topCustomer/'+ tgl1 +'/tglAkhir/' + tgl2
		})
	};

	dashboardFactory.getTopSupplier=function(tgl1, tgl2){
		return $http({
			method:'GET',
			url : urlApi +'/topSupplier/'+ tgl1 +'/tglAkhir/' + tgl2
		})
	};

	//http://localhost:8088/api/dashboard/topCustomer/2016-06-01/tglAkhir/2016-12-31

	return dashboardFactory;

}])