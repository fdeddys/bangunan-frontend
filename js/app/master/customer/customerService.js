appServices.factory('customerFactory',['$http','$rootScope',function($http,$rootScope){

	var urlApi = $rootScope.pathServerJSON + '/api/customer';
	var customersFactory={};

	customersFactory.getAllCustomer=function(){
		return $http({
			method:'GET',
			url : urlApi
		})
	};

	customersFactory.getCustomerByPage=function(hal, jumlah){		
		return $http({
			method:'GET',
			url:urlApi + '/nama/--/hal/' + hal + '/jumlah/' + jumlah  
		});			
	};
	
	customersFactory.getCustomerById=function(id){
		return $http({
			method:'GET',
			url:urlApi + '/' + id		
		});
	};

	customersFactory.getOneCustomerByKode=function(kode){
		return $http({
			method:'GET',
			url:urlApi + '/oneKode/' + kode				
		});
	};


	customersFactory.getCustomerByNamaPage=function(nama, hal, jumlah){
		return $http({
			method:'GET',
			url:urlApi + '/nama/' + nama + '/hal/' + hal + '/jumlah/' + jumlah  				
		});
	};

	customersFactory.insertCustomer = function(customer){
		return $http({
			method:'POST',
			url:urlApi,
			data:JSON.stringify(customer),
			headers:{'Content-Type':'application/json'}
		});
	};

	customersFactory.updateCustomer = function(id,customer){
		return $http({
			method:'PUT',
			url:urlApi + '/'+ id,
			data:JSON.stringify(customer)
		});
	};

	customersFactory.deleteCustomer = function (id){
		return $http({
			method:'DELETE',
			url:urlApi + '/' + id
		});
	}

	customersFactory.isNamaExist=function(namaCari){
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

	return customersFactory;

}]);