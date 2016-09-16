appControllers.controller('penjualanJasaDetilController', 
	['$scope', 'penjualanJasaService','$filter','$location','$window','growl','customerFactory','$routeParams','mandorService','focus',
	function($scope, penjualanJasaService, $filter, $location, $window, growl, customerFactory, $routeParams, mandorService, focus){	

	// tanggal
 	$scope.today = function() {
	    	$scope.tglJual = new Date();	    	
		};		

		$scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;		    
		};

		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	// END tanggal


    function cekStatusApakahBisaBatalApprove(){

    	var deferred =$q.defer();
		penjualanHdFactory
		    .getById($scope.penjualanHd.id)
		    .then(function(response){
		    	var hasil = response.data;
		    	if (hasil.statusJual == 'APPROVED'){
					deferred.resolve(hasil.statusJual);		    		
		    	}else{
		    		deferred.reject(hasil.statusJual);
		    	}
		    })
		return deferred.promise;
    }
    
    $scope.batalAprove=function(){   
    	var promise = cekStatusApakahBisaBatalApprove()
    					.then(function(data){
    						//growl.addInfoMessage("batal approve");
    						prosesBatalApprove();
    					},function(error){
    						// console.log(error);
    						growl.addWarnMessage("Batal approve gagal, status = [" + error + "]");
    					})
    }

    function prosesBatalApprove(){

    	var modalInstance = $uibModal.open({
			templateUrl: 'js/app/dialogForm/dialogForm.html',
			controller: 'dialogController',
			size: '',
		    resolve: 
		    	{
	        		pesan: function () {
	          			return "Apakah anda yakin akan ** BATAL APPROVE ** data ini ?";
	        		},
	        		id: function () {
	          			return $scope.penjualanHd.id;
	        		}	
      			}
	    });

	    modalInstance
	    	.result.then(function(idHd){
		    	var idGudang = $rootScope.globals.currentUser.idGudang;
		    	penjualanHdFactory
		    		.batalApprove(idHd, idGudang)
		    		.then(function(response){
		    			$scope.penjualanHd = response.data;
		    			$scope.kondisiView = true;
						$scope.approved =true;
		    		},function(data){		    			
		    			//console.log(data);
		    			//data -->> data, status, headers, config, statusText
		    			
		    			if(data.status=="418"){		    				
		    				growl.addInfoMessage("error " + data.data.message );		    									 
		    			}
		    		});

	    	},function(response){
	    		growl.addInfoMessage(" canceled");

	    	})
    }

    $scope.approvedTrans=function(){

    	if($scope.penjualanBarangDetils.length==0){
    		growl.addInfoMessage("Barang belum ada , silahkan di isi!!!");
    		return;
    	}
    	
    	var modalInstance = $uibModal.open({
			templateUrl: 'js/app/dialogForm/dialogForm.html',
			controller: 'dialogController',
			size: '',
		    resolve: 
		    	{
	        		pesan: function () {
	          			return "Apakah anda yakin akan APPROVE data ini ?";
	        		},
	        		id: function () {
	          			return $scope.penjualanHd.id;
	        		}
      			}
	    });

	    modalInstance
	    	.result.then(function(idHd){
		    	var idGudang = $rootScope.globals.currentUser.idGudang;
		    	penjualanHdFactory
		    		.approve(idHd, idGudang)
		    		.then(function(response){
		    			$scope.penjualanHd = response.data;
		    			$scope.kondisiView = true;
						$scope.approved =true;
		    		},function(data){		    			
		    			//console.log(data);
		    			//data -->> data, status, headers, config, statusText
		    			
		    			if(data.status=="418"){		    				
		    				growl.addInfoMessage("error " + data.data.message );		    									 
		    			}
		    		});

	    	},function(response){
	    		growl.addInfoMessage(" canceled");
	    	})
    }

    $scope.edit =  function(){
    	$scope.kondisiView = !$scope.kondisiView;
    	focus('keterangan');
    };

    function saveHdr(){

    	var deferred = $q.defer();

    	if($scope.customerSelected==null || $scope.customerSelected==undefined || $scope.customerSelected==''){    		
    		growl.addInfoMessage("customer belum terisi !!");
    		deferred.reject('customer belum ada');   
    	}    	
    	else 
    	{
	    	var vTgl = $filter('date')($scope.tglJual,'yyyy-MM-dd');
	    	var hdrDto={
	    		    "id": null,
				    "customer": $scope.customerSelected.id,
				    "tglTransaksi": vTgl,
				    "keterangan": $scope.penjualanHd.keterangan,				    				   
				    "userUpdate": $rootScope.globals.currentUser.nama,
				    "jumlah": 0,
				    "mandor": null			   			   
	    	}

	    	if($scope.penjualanHd.id== null){
	    		penjualanJasaService
		    		.save(hdrDto)
		    		.then(function(response){
		    			$scope.penjualanHd = response.data;	    				    			
		    			console.log("save success");
		    			focus('barang');
		    			deferred.resolve('true');
		    		},function(data, status, headers, config, statusText){
		    			deferred.reject('error save ' + data.message);   
		    			console.log("data : " + data + " status " + status);
		    		})    		
	    	}else{
	    		penjualanHdFactory
	    			.edit($scope.penjualanHd.id,hdrDto)
	    			.then(function(response){
		    			$scope.penjualanHd = response.data;	    				    			
		    			console.log("update hdr success");
		    			focus('barang');
		    			deferred.resolve('true');
		    		}, function(error){
		    			deferred.reject('error update');   
		    			console.log('error');	
		    		})    		
	    	}
	    	
	    }
	    return deferred.promise;
    }


    $scope.getCustomerByNama = function(cariNama){
    	
		return	customerFactory
	    	 		.getCustomerByNamaPage(cariNama, 1, 10)
					.then(function(response){
	    				//console.log('load http' + response.data.nama); 
	    				customers=[];
	    				angular.forEach(response.data.content, function(item){
			                customers.push(item);
			                // console.log('tambah :' + item.namaSatuan);
			            });
	    				return customers;
	    			})
    }

    $scope.getMandorByNama = function(cariNama){
    	
		return	mandorService
    	 		.getByNamaPage(cariNama, 1, 10)
				.then(function(response){
    				//console.log('load http' + response.data.nama); 
    				mandors=[];
    				angular.forEach(response.data.content, function(item){
		                mandors.push(item);
		                // console.log('tambah :' + item.namaSatuan);
		            });
    				return mandors;
    			})
    }

    $scope.getBarangByNama = function(cariNama){

    	if(transaksiBarang == 'true'){
			return barangFactory
					.getByNamaPage(cariNama, 1, 10)
					.then(function(response){
						console.log('load barang http' + response.data.nama); 
						barangs=[];
						angular.forEach(response.data.content, function(item){
			                barangs.push(item);		                
			            });
						return barangs;
					})    		
    	}else{
    		return barangFactory
					.getByJasaNamaPage(cariNama, 1, 10)
					.then(function(response){
						console.log('load jasa shttp' + response.data.nama); 
						barangs=[];
						angular.forEach(response.data.content, function(item){
			                barangs.push(item);		                
			            });
						return barangs;
					})    		
    	}
    };

    $scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/api/penjualanHd/report/'+$scope.penjualanHd.id, '_blank');
	}


    $scope.transaksiBaru = function(){
    	newRec();
    	focus('customers');
    }

    function newRec(){
    	$scope.today();
    	$scope.approved =false;

    	$scope.customerSelected=null;
    	var customers=[];	
		
		$scope.penjualanJasa={
		    "id": null,
			"customer": null,
			"tglTransaksi": null,
			"keterangan": null,
			"statusJual": null,
			"lastUpdate": new Date(),
			"userUpdate": null,
			"jumlah": 0,
			"mandor": null
		};	
		$scope.statusTrans ='NEW';	
		focus('customers');
    }

	function startModule(){	

		$scope.approved =false;
		newRec();
		
		var idParam = $routeParams.idHdr;

		switch(idParam){
			case '0' :
					//new
					//$scope.statusTrans ='NEW';
					//console.log("0 baru");
					newRec();
					break;
			case 'undefined':
					// new
					//$scope.statusTrans ='NEW';
					//console.log("undefined baru");
					//focus('customers');
					newRec();
					break;
			default :
					// edit
					$scope.statusTrans ='EDIT';
					console.log("edit");
					penjualanJasaService					
						.getById(idParam)
						.then(function(response){
							$scope.penjualanHd = response.data;
							$scope.tglJual = new Date($scope.penjualanHd.tglJual);
							$scope.customerSelected = $scope.penjualanHd.customer;
							if($scope.penjualanHd.statusJual=="APPROVED"){
								$scope.kondisiView = true;
								$scope.approved =true;
							}else{
								$scope.kondisiView = false;
								focus('barang');								
							}
						})					
		}
	};

	startModule();
	
}])