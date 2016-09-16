appControllers.controller('dashboardController', 
	['$scope','dashboardFactory','$filter',
	function($scope,dashboardFactory, $filter){

	$scope.totalPenjualan=0;
	$scope.totalPembelian=0;

	$scope.tglAwal =null;
	$scope.tglAkhir =null;

	$scope.dataSourceTopCustomer = {
	    chart: {
	        caption: "TOP Customer ",
	        subCaption: "Penjualan",
	        numberPrefix: "Rp",
	        theme: "zune"
    	}
	};

	$scope.dataSourceTopSupplier = {
	    chart: {
	        caption: "TOP Supplier ",
	        subCaption: "Penerimaan",
	        numberPrefix: "Rp",
	        theme: "carbon"
    	}
	};

	$scope.dataSourcePenjPemb = {
	    chart: {
	        caption: "Penjualan - Pembelian",
	        subcaption: "Periode",
	        startingangle: "120",
	        showlabels: "0",
	        showlegend: "1",
	        enablemultislicing: "0",
	        slicingdistance: "15",
	        showpercentvalues: "1",
	        showpercentintooltip: "0",
	        plottooltext: "Jenis : $label Total : $datavalue",
	        theme: "carbon"
	    	}
	};



	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();
	    $scope.opened = true;		    
	};


	$scope.open2 = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();
	    $scope.opened2 = true;		    
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};


	$scope.prosesDashboard = function(){
		var vTgl1 = $filter('date')($scope.tglAwal,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tglAkhir,'yyyy-MM-dd');
		tarikData(vTgl1, vTgl2);
	}

	function tarikData(tglAwal, tglAkhir){

		dashboardFactory
			.getTopCustomer(tglAwal, tglAkhir)
			.success(function(data){
				$scope.dataSourceTopCustomer.data = data;				
			});

		dashboardFactory
			.getTopSupplier(tglAwal, tglAkhir)
			.success(function(data){
				$scope.dataSourceTopSupplier.data = data;				
			});

		
		dashboardFactory
			.getPenjualan(tglAwal, tglAkhir)
			.success(function(data){
				$scope.totalPenjualan = data;
				dashboardFactory
					.getPembelian(tglAwal, tglAkhir)
					.success(function(data){
						$scope.totalPembelian = data;

							$scope.dataSourcePenjPemb ={
								data:[{
						        	label: "Pembelian",
						        	value: $scope.totalPembelian
							    },
							    {
							        label: "Penjualan",
							        value: $scope.totalPenjualan
							    }]			
							}
					});

				// dashboardFactory
				// 	.getTopCustomer(tglAwal, tglAkhir)
				// 	.then(function(response){
				// 		$scope.dataSourcePP= response;
				// 	})

			});
	}

	function loadDashboard(){
		console.log('load dash');

		


		// dashboardFactory
		// 	.getTglAkhir()
		// 	.success(function(data){
		// 		$scope.tglAkhir = data;
		// 	});			

		// return $scope.dataSourcePenerimaanPenjualan.data={
		// 			label:"pembelian",
		// 			value:100
		// 		}

		// return dashboardFactory
		// 	.getPembelian(tgl1, tgl2)
		// 	.then(function(response){				
		// 		totalPembelian = response.data;
		// 	})

		// var vTgl = $filter('date')($scope.tglJual,'yyyy-MM-dd');

		dashboardFactory
			.getTglAwal()
			.then(function(response){
				$scope.tglAwal = new Date(response.data.tglAwal);
				$scope.tglAkhir = new Date(response.data.tglAkhir);
				tarikData(response.data.tglAwal, response.data.tglAkhir);
			})
	}

	function startModule(){
		loadDashboard();
	};


	startModule();

}])