var myApp = angular.module('appSIMPRO',[
	'ngRoute',
	'ngAnimate',
	'appControllers',
	'appServices',	
	'ngCookies',
	'angular-growl',	
	'ui.bootstrap',
	'ng-fusioncharts'
]);

var appServices = angular.module('appServices',[]);

var appControllers = angular.module('appControllers',['ui.bootstrap','appServices']);


appControllers.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return  input.slice(start);
    };
});


myApp.factory('focus', function($timeout, $window) {
	return function(id) {
      // timeout makes sure that it is invoked after any other event has been triggered.
      // e.g. click events that need to run before the focus or
      // inputs elements that are in a disabled state but are enabled when those events
      // are triggered.
      $timeout(function() {
      	var element = $window.document.getElementById(id);
      	if(element)
      		element.focus();
      });
  };
});

myApp.directive('eventFocus', function(focus) {
	return function(scope, elem, attr) {
		elem.on(attr.eventFocus, function() {
			focus(attr.eventFocusId);
		});

      // Removes bound events in the element itself
      // when the scope is destroyed
      scope.$on('$destroy', function() {
      	elem.off(attr.eventFocus);
      });
  };
});

myApp.run(['$window', '$rootScope', '$location', '$cookieStore', '$http', 
	function($window, $rootScope, $location, $cookieStore, $http){

	// buat hidden menu nya
	// kalo masuk form LOGIN sembunyikan
	// tapi logo nyo masih ado koq cumen bar menu bae yang ilang
	$rootScope.isLogin=false;

	// Pindahkan scroll selalu ke paling atas => efek dari animasi
	$rootScope.$on('$viewContentLoaded', function(){ window.scrollTo(0, 0); });

	// Path server database	
	//$rootScope.pathServerJSON='http://localhost:8080/simpback';
	$rootScope.pathServerJSON='http://localhost:8088';
	//$rootScope.pathServerJSON='http://192.168.1.1:8088';


	// refresh masih tetep login brooo
    $rootScope.globals = $cookieStore.get('globals') || {};    
    if ($rootScope.globals.currentUser) {
        //$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }
    $rootScope.isLogin = $cookieStore.get('isLogin') || {};
	

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        // redirect to login page, soalnya $rootScope blm login
        if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
            $location.path('/login');
        }
    });

}]);

myApp.config(['$routeProvider','$locationProvider','growlProvider',
	function($routeProvider,$locationProvider,growlProvider){
	
	// $locationProvider.html5Mode(true);
	growlProvider.globalTimeToLive(5000);

	$routeProvider.
		when('/',{
			templateUrl:'partials/dashboard.html',
			controller:'dashboardController'				
		}).
		when('/login',{
			templateUrl:'Logon_form.html',
			controller:'loginController'
		}).		
		when('/masterCustomer',{
			templateUrl:'partials/master/masterCustomer.html',
			controller:'customerController'
		}).
		when('/masterSupplier',{
			templateUrl:'partials/master/masterSupplier.html',
			controller:'supplierController'
		}).
		when('/masterSatuan',{
			templateUrl:'partials/master/masterSatuan.html',
			controller:'satuanController'
		}).
		when('/masterGudang',{
			templateUrl:'partials/master/masterGudang.html',
			controller:'gudangController'
		}).
		when('/masterBarang',{
			templateUrl:'partials/master/masterBarang.html',
			controller:'barangController'
		}).
		when('/masterCaraBayar',{
			templateUrl:'partials/master/masterCaraBayar.html',
			controller:'caraBayarController'
		}).
		when('/masterMandor',{
			templateUrl:'partials/master/masterMandor.html',
			controller:'mandorController'
		}).
		when('/penerimaanBarang',{
			templateUrl:'partials/transaksi/pembelian/penerimaan_barang.html',
			controller:'penerimaanBarangController'
		}).
		when('/penerimaanBarangDetil',{
			redirectTo:'/penerimaanBarangDetil/0'
		}).
		when('/penerimaanBarangDetil/:idHdr',{
			templateUrl:'partials/transaksi/pembelian/penerimaan_barang_detil.html',
			controller:'penerimaanBarangDetilController'			
		}).		
		when('/returBarang',{
			templateUrl:'partials/transaksi/pembelian/retur_ke_supplier.html',
		    controller:'returBarangController'
		}).
		when('/returBarangDetil',{
			redirectTo:'/returBarangDetil/0'
		}).
		when('/returBarangDetil/:idHdr',{
			templateUrl:'partials/transaksi/pembelian/retur_ke_supplier_detil.html',
			controller:'returBarangDetilController'			
		}).		
		when('/pembayaranSupplier',{
			templateUrl:'partials/transaksi/pembelian/pembayaran_ke_supplier.html',
			controller:'pembayaranSupplierController'
		}).
		when('/penjualanBarang/:isTransBarang',{
			templateUrl:'partials/transaksi/penjualan/penjualan_barang.html',
			controller:'penjualanBarangController'
		}).
		when('/penjualanBarangDetil',{
			redirectTo:'/penjualanBarangDetil/0/true'
		}).
		when('/penjualanBarangDetil/:idHdr/:isTransBarang',{
			templateUrl:'partials/transaksi/penjualan/penjualan_barang_detil.html',
			controller:'penjualanBarangDetilController'			
		}).
		when('/penjualanJasa',{
			templateUrl:'partials/transaksi/penjualan/penjualan_jasa.html',
			controller:'penjualanJasaController'
		}).
		when('/penjualanJasaDetil/:idHdr',{
			templateUrl:'partials/transaksi/penjualan/penjualan_jasa_detil.html',
			controller:'penjualanJasaDetilController'
		}).
		when('/pembayaranCustomer',{
			templateUrl:'partials/transaksi/penjualan/pembayaran_customer.html',
			controller:'pembayaranCustomerController'
		}).
		when('/lapHistoryBarang',{
			templateUrl:'partials/laporan/historyBarang.html',
			controller:'historyBarangController'
		}).
		when('/lapHistoryCustomer',{
			templateUrl:'partials/laporan/historyCustomer.html',
			controller:'historyCustomerController'
		}).
		when('/lapPembelian/:idLap',{
			templateUrl:'partials/laporan/laporanPembelian.html',
			controller:'laporanPembelianController'
		}).
		when('/user',{
			templateUrl:'partials/utility/user.html',
			controller:'userController'
		}).
        otherwise({
			redirectTo:'/'
		});

}]);





