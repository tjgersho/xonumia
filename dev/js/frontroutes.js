//angular app router
module.exports.frontroutes = function(app){

app.config(['$stateProvider', '$locationProvider',  function ($stateProvider, $locationProvider, $q){

$stateProvider
   .state('index', {
       name: 'index',
        url: '/',
        templateUrl: 'partials/index',
        controller: 'IndexController',
        controllerAs: 'indexCtrl'
    })
   .state('play', {
        name: 'play',
        url: '/play?level',
        templateUrl: 'partials/play',
        controller: 'XonumiaController',
        controllerAs: 'playCtrl',
        resolve: {
           loggedin: function(User, $q, $state) {
                console.log('User RESOLVE');
                    var deferred = $q.defer();
                    console.log(User);
                   User.isTokenValid().then(function(res){
                    console.log('Resolve Admin');
                    console.log('res',res);

                    deferred.resolve(res);

                   }, function(err){
                    $state.go('login');
                    deferred.reject();
                   });

                   return deferred.promise;
                 }
        }
    })
   .state('store', {
       name: 'store',
        url: '/store',
        templateUrl: 'partials/store',
        controller: 'StoreController',
        controllerAs: 'storeCtrl',
        resolve: {
           loggedin: function(User, $q, $state) {
                console.log('User RESOLVE');
                    var deferred = $q.defer();
                    console.log(User);
                   User.isTokenValid().then(function(res){
                    console.log('Resolve Admin');
                    console.log('res',res);

                    deferred.resolve(res);

                   }, function(err){
                    $state.go('login');
                    deferred.reject();
                   });

                   return deferred.promise;
                 }
        }
       })
 	.state('product', {
      	 	name: 'product',
        	url: '/product/:id',
        	templateUrl: 'partials/product',
        	controller: 'ProductController',
        	controllerAs: 'productCtrl',
        	resolve: {
          	 loggedin: function(User, $q, $state) {
                console.log('User RESOLVE');
                    var deferred = $q.defer();
                    console.log(User);
                    User.isTokenValid().then(function(res){
                     console.log('Resolve Admin');
                     console.log('res',res);

                     deferred.resolve(res);

                   }, function(err){
                    $state.go('login');
                    deferred.reject();
                   });

                   return deferred.promise;
                 }
        	}
   	 })
      .state('checkout', {
       name: 'checkout',
        url: '/checkout',
        templateUrl: 'partials/checkout',
        controller: 'CheckoutController',
        controllerAs: 'checkoutCtrl',
        resolve: {
           loggedin: function(User, $q, $state) {
                console.log('User RESOLVE');
                    var deferred = $q.defer();
                    console.log(User);
                   User.isTokenValid().then(function(res){
                    console.log('Resolve Admin');
                    console.log('res',res);

                    deferred.resolve(res);

                   }, function(err){
                    $state.go('login');
                    deferred.reject();
                   });

                   return deferred.promise;
                 }
        }
    })   
    .state('advconfig', {
       name: 'advconfig',
        url: '/advconfig',
        templateUrl: 'partials/advconfig',
        controller: 'AdvConfigController',
        controllerAs: 'advconfigCtrl',
        resolve: {
           loggedin: function(User, $q, $state) {
                console.log('User RESOLVE');
                    var deferred = $q.defer();
                    console.log(User);
                   User.isTokenValid().then(function(res){
                    console.log('Resolve Admin');
                    console.log('res',res);

                    deferred.resolve(res);

                   }, function(err){
                    $state.go('login');
                    deferred.reject();
                   });

                   return deferred.promise;
                 }
        }
    })
    .state('cart', {
       name: 'cart',
        url: '/cart',
        templateUrl: 'partials/cart',
        controller: 'CartController',
        controllerAs: 'cartCtrl',
        resolve: {
           loggedin: function(User, $q, $state) {
                console.log('User RESOLVE');
                    var deferred = $q.defer();
                    console.log(User);
                   User.isTokenValid().then(function(res){
                    console.log('Resolve Admin');
                    console.log('res',res);

                    deferred.resolve(res);

                   }, function(err){
                    $state.go('login');
                    deferred.reject();
                   });

                   return deferred.promise;
                 }
          }
      })
      .state('paymentsuccess', {
        name: 'paymentsuccess',
        url: '/paymentsuccess',
        templateUrl: 'partials/paymentsuccess',
        controller: 'PaymentsuccessController',
        controllerAs: 'paymentsuccessCtrl',
        resolve: {
           loggedin: function(User, $q, $state) {
                console.log('User RESOLVE');
                    var deferred = $q.defer();
                    console.log(User);
                   User.isTokenValid().then(function(res){
                    console.log('Resolve Admin');
                    console.log('res',res);

                    deferred.resolve(res);

                   }, function(err){
                     $state.go('login');
                     deferred.reject();
                   });

                   return deferred.promise;
                 }
        }
       })
     .state('paymentfail', {
        name: 'paymentfail',
        url: '/paymentfail',
        templateUrl: 'partials/paymentfail',
        controller: 'PaymentfailController',
        controllerAs: 'paymentfailCtrl',
        resolve: {
           loggedin: function(User, $q, $state) {
                console.log('User RESOLVE');
                    var deferred = $q.defer();
                    console.log(User);
                   User.isTokenValid().then(function(res){
                    console.log('Resolve Admin');
                    console.log('res',res);

                    deferred.resolve(res);

                   }, function(err){
                     $state.go('login');
                     deferred.reject();
                   });

                   return deferred.promise;
                 }
        }
       })
	.state('login', {
        name: 'login',
        url: '/login',
        templateUrl: 'partials/login',
        controller: 'LoginController',
        controllerAs: 'loginCtrl'
    })
     .state('signup', {
        name: 'signup',
        url: '/signup',
        templateUrl: 'partials/signup',
        controller: 'SignupController'
    }) 
    .state('resetpw', {
        name: 'resetpw',
        url: '/resetpw',
        templateUrl: 'partials/resetpw',
        controller: 'RecoverPWController',
        controllerAs: 'recoverpwCtrl'
    })
    .state('changepassword', {
        name: 'changepassword',
        url: '/changepassword/:username/code/:code',
        templateUrl: 'partials/changepassword',
        controller: 'ChangePWController',
        controllerAs: 'changepwCtrl'
    })
     .state('terms', {
        name: 'terms',
        url: '/terms',
        templateUrl: 'partials/terms'
    }) 
     .state('returns', {
        name: 'returns',
        url: '/returns',
        templateUrl: 'partials/returns'
    }) 
    .state('privacy', {
        name: 'privacy',
        url: '/privacy',
        templateUrl: 'partials/privacy'
    }) 
    .state('paypalpaymentsuccess', {
        name: 'paypalpaymentsuccess',
        url: '/paypalpaymentsuccess',
        templateUrl: 'partials/paypalpaymentsuccess',
        controller: 'PayPalSucessController',
        controllerAs: 'paypaySuccessCtrl'
    }) 
     .state('dashboard', {
       name: 'dashboard',
        url: '/dashboard',
        templateUrl: 'partials/dashboard',
        controller: 'DashController',
        controllerAs: 'dashCtrl',
        resolve: {
           loggedin: function(User, $q, $state) {
                console.log('User RESOLVE');
                    var deferred = $q.defer();
                    console.log(User);
                   User.isTokenValid().then(function(res){
                    console.log('Resolve Admin');
                    console.log('res',res);

                    deferred.resolve(res);

                   }, function(err){
                    $state.go('login');
                    deferred.reject();
                   });

                   return deferred.promise;
                 }
        }
    })
     .state('build', {
        name: 'build',
        url: '/build',
        templateUrl: 'partials/build',
        controller: 'BuilderController',
        controllerAs: 'bldCtrl',
         resolve: {
           loggedin: function(User, $q, $state) {
                console.log('User RESOLVE');
                    var deferred = $q.defer();
                    console.log(User);
                   User.isTokenValid().then(function(res){
                    console.log('Resolve Admin');
                    console.log('res',res);

                    deferred.resolve(res);

                   }, function(err){
                    $state.go('login');
                    deferred.reject();
                   });

                   return deferred.promise;
                 }
        }
    })
     .state('discover', {
        name: 'discover',
        url: '/discover',
        templateUrl: 'partials/discover',
        controller: 'DiscoverController',
        controllerAs: 'discoverCtrl',
         resolve: {
           loggedin: function(User, $q, $state) {
                console.log('User RESOLVE');
                    var deferred = $q.defer();
                    console.log(User);
                   User.isTokenValid().then(function(res){
                    console.log('Resolve Admin');
                    console.log('res',res);

                    deferred.resolve(res);

                   }, function(err){
                    
                    deferred.resolve(err);
                   });

                   return deferred.promise;
                 }
        }
    })
      .state('contact', {
        name: 'contact',
        url: '/contact',
        templateUrl: 'partials/contact',
        controller: 'ContactController',
        controllerAs: 'contactCtrl',
         resolve: {
           loggedin: function(User, $q, $state) {
                console.log('User RESOLVE');
                    var deferred = $q.defer();
                    console.log(User);
                   User.isTokenValid().then(function(res){
                    console.log('Resolve Admin');
                    console.log('res',res);

                    deferred.resolve(res);

                   }, function(err){
                    
                    deferred.resolve(err);
                   });

                   return deferred.promise;
                 }
        }
    })
      .state('admin', {
        name: 'admin',
        url: '/admin',
        templateUrl: 'partials/admin',
        controller: 'AdminController',
        controllerAs: 'adminCtrl',
        resolve: {
              admin: function(Auth, $q, $state) {
                console.log('AUTH RESOLVE');
                    var deferred = $q.defer();
                    console.log(Auth);
                   Auth.adminAuthenticate().then(function(res){
                    console.log('Resolve Admin');
                    console.log('res',res);

                    deferred.resolve(res);

                   }, function(err){
                    $state.go('login');
                    deferred.reject();
                   });

                   return deferred.promise;
                 }
        }
    });

$locationProvider.html5Mode(true);

}]);



};