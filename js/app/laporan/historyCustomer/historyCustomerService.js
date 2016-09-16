appServices.factory('historyCustomerFactory',['$http','$rootScope',
	function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/historyCustomer';
	var historyCustomerFactory={};

	historyCustomerFactory.getAll=function(idCustomer,tgl1,tgl2,hal,jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/customer/'+idCustomer+'/tgl1/'+tgl1+'/tgl2/'+tgl2+'/hal/'+hal+'/jumlah/'+jumlah
		});
	};	

	

	return historyCustomerFactory;

}]);