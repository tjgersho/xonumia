
//var Global = require('./Global');


//if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
  //  Global.mobile = true;
//}


//var $ = require('jquery');
require('angular');
require('angular-ui-router');
require('ngstorage');
require('angular-sanitize');

/////Angular App -- XonumiaJSApp///////////


 /// Custom Modules...

angular.module('Controllers',[]); 

angular.module('Services',[]); 

angular.module('Directives',[]); 

angular.module('Filters',[]); 


////Services////
require('./services/UserService.js').service();
require('./services/AuthService.js').service();
require('./services/GlobalService.js').service();
require('./services/CanvasService.js').service();
require('./services/MatrixService.js').service();
require('./services/LevelService.js').service();
require('./services/DrawService.js').service();
require('./services/CartService.js').service();
require('./services/MerchService.js').service();
require('./services/SponsorshipService.js').service();


///Controllers///
require('./controllers/MainController.js').controller();
require('./controllers/XonumiaController.js').controller();
require('./controllers/LoginController.js').controller();
require('./controllers/SignupController.js').controller();
require('./controllers/BuilderController.js').controller();
require('./controllers/IndexController.js').controller();
require('./controllers/DiscoverController.js').controller();
require('./controllers/AdminController.js').controller();
require('./controllers/DashController.js').controller();
require('./controllers/StoreController.js').controller();
require('./controllers/ProductController.js').controller();
require('./controllers/CheckoutController.js').controller();
require('./controllers/ContactController.js').controller();
require('./controllers/CartController.js').controller();
require('./controllers/RecoverPWController.js').controller();
require('./controllers/ChangePWController.js').controller();
require('./controllers/AdvConfigController.js').controller();
require('./controllers/PayPalPaymentSuccessController.js').controller();
require('./controllers/PaymentsuccessController.js').controller();
require('./controllers/PaymentfailController.js').controller();

///Directives///

require('./directives/HomePanelAdmin.js').directive();
require('./directives/StorePanelAdmin.js').directive();
require('./directives/AdvertisersPanelAdmin.js').directive();
require('./directives/AdvsAdmin.js').directive();
require('./directives/XonumiaPanelAdmin.js').directive();
require('./directives/PlayerPanelAdmin.js').directive();
require('./directives/PayoutPanelAdmin.js').directive();
require('./directives/LevelsPanelAdmin.js').directive();
require('./directives/CommentsPanelAdmin.js').directive();
require('./directives/MerchStorePanel.js').directive();
require('./directives/ProductOptions.js').directive();
require('./directives/ZoomproductPics.js').directive();
require('./directives/SponsorshipStorePanel.js').directive();
require('./directives/StoreItem.js').directive();
require('./directives/fileread.js').directive();
require('./directives/RangeSlider.js').directive();
require('./directives/XbitLeaderboard.js').directive();
require('./directives/XnumLeaderboard.js').directive();
require('./directives/AdvRud.js').directive();
require('./directives/PaginationControl.js').directive();
require('./directives/AdvsPurchaseAdmin.js').directive();
require('./directives/MerchSaleAdmin.js').directive();
require('./directives/CoinBaseNotificationsPanelAdmin.js').directive();
require('./directives/PayoutRequestPanelAdmin.js').directive();
require('./directives/DashConqurings.js').directive();
require('./directives/DashAdvs.js').directive();

/// FILTERS ///

require('./filters/range.js').filter();

/////////////

var XonumiaJSApp = angular.module('XonumiaJSApp', ['ui.router', 'ngStorage', 'ngSanitize', 'Services', 'Controllers', 'Directives', 'Filters']); 






require('./frontroutes.js').frontroutes(XonumiaJSApp);


/////////////////////////////




