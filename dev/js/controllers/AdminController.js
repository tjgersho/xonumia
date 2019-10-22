require('angular');
require('angular-ui-router');
var $ = require('jquery');

module.exports.controller = function(){
'use strict';
angular.module('Controllers').controller('AdminController', ['User', function(User){
    //console.log("LoginController");
  //console.log(Global);
  //console.log(User);
var self = this;

   User.isTokenValid();

self.homePanel = true;
self.storePanel = false;
self.salesPanel = false;
self.advertisersPanel = false;
self.advsPanel = false;
self.advPurchase = false;
self.payoutRequestPanel = false;
self.payoutPanel = false;
self.playerPanel = false;
self.xonumiaPanel = false;
self.levelsPanel = false;
self.commentsPanel = false;
self.coinbaseNotificationPanel = false;

self.activatePanel = function(panel){
	console.log(panel);
	switch (panel){
		case 'home':
			self.homePanel = true;
			self.storePanel = false;
			self.salesPanel = false;
			self.advertisersPanel = false;
			self.advPurchase = false;
			self.advsPanel = false;
			self.payoutRequestPanel = false;
			self.payoutPanel = false;
			self.playerPanel = false;
			self.xonumiaPanel = false;
			self.levelsPanel = false;
			self.commentsPanel = false;
			self.coinbaseNotificationPanel = false;
		break;
		case 'store':

			self.homePanel = false;
			self.storePanel = true;
			self.salesPanel = false;
			self.advertisersPanel = false;
			self.advPurchase = false;
			self.advsPanel = false;
			self.payoutRequestPanel = false;
			self.payoutPanel = false;
			self.playerPanel = false;
			self.xonumiaPanel = false;
			self.levelsPanel = false;
			self.commentsPanel = false;
			self.coinbaseNotificationPanel = false;
		break;
		case 'sales':
			self.homePanel = false;
			self.storePanel = false;
			self.salesPanel = true;
			self.advertisersPanel = false;
			self.advPurchase = false;
			self.advsPanel = false;
			self.payoutRequestPanel = false;
			self.payoutPanel = false;
			self.playerPanel = false;
			self.xonumiaPanel = false;
			self.levelsPanel = false;
			self.commentsPanel = false;
			self.coinbaseNotificationPanel = false;
		break;
		case 'advertisers':
			self.homePanel = false;
			self.storePanel = false;
			self.salesPanel = false;
			self.advertisersPanel = true;
			self.advPurchase = false;
			self.advsPanel = false;
			self.payoutRequestPanel = false;
			self.payoutPanel = false;
			self.playerPanel = false;
			self.xonumiaPanel = false;
			self.levelsPanel = false;
			self.commentsPanel = false;
			self.coinbaseNotificationPanel = false;
		break;
		case 'advs':
			self.homePanel = false;
			self.storePanel = false;
			self.salesPanel = false;
			self.advertisersPanel = false;
			self.advPurchase = false;
			self.advsPanel = true;
			self.payoutRequestPanel = false;
			self.payoutPanel = false;
			self.playerPanel = false;
			self.xonumiaPanel = false;
			self.levelsPanel = false;
			self.commentsPanel = false;
			self.coinbaseNotificationPanel = false;
		break;
		case 'advpurchase':
			self.homePanel = false;
			self.storePanel = false;
			self.salesPanel = false;
			self.advertisersPanel = false;
			self.advPurchase = true;
			self.advsPanel = false;
			self.payoutRequestPanel = false;
			self.payoutPanel = false;
			self.playerPanel = false;
			self.xonumiaPanel = false;
			self.levelsPanel = false;
			self.commentsPanel = false;
			self.coinbaseNotificationPanel = false;
		break;
		case 'payoutsReq':
			self.homePanel = false;
			self.storePanel = false;
			self.salesPanel = false;
			self.advertisersPanel = false;
			self.advPurchase = false;
			self.advsPanel = false;
			self.payoutRequestPanel = true;
			self.payoutPanel = false;
			self.playerPanel = false;
			self.xonumiaPanel = false;
			self.levelsPanel = false;
			self.commentsPanel = false;
			self.coinbaseNotificationPanel = false;
		break;
		case 'payouts':
			self.homePanel = false;
			self.storePanel = false;
			self.salesPanel = false;
			self.advertisersPanel = false;
			self.advPurchase = false;
			self.advsPanel = false;
			self.payoutRequestPanel = false;
			self.payoutPanel = true;
			self.playerPanel = false;
			self.xonumiaPanel = false;
			self.levelsPanel = false;
			self.commentsPanel = false;
			self.coinbaseNotificationPanel = false;
		break;
		case 'players':
			self.homePanel = false;
			self.storePanel = false;
			self.salesPanel = false;
			self.advertisersPanel = false;
			self.advPurchase = false;
			self.advsPanel = false;
			self.payoutRequestPanel = false;
			self.payoutPanel = false;
			self.playerPanel = true;
			self.xonumiaPanel = false;
			self.levelsPanel = false;
			self.commentsPanel = false;
			self.coinbaseNotificationPanel = false;
		break;
		case 'xonumia':
			self.homePanel = false;
			self.storePanel = false;
			self.salesPanel = false;
			self.advertisersPanel = false;
			self.advPurchase = false;
			self.advsPanel = false;
			self.payoutRequestPanel = false;
			self.payoutPanel = false;
			self.playerPanel = false;
			self.xonumiaPanel = true;
			self.levelsPanel = false;
			self.commentsPanel = false;
			self.coinbaseNotificationPanel = false;
		break;
		case 'levels':
			self.homePanel = false;
			self.storePanel = false;
			self.salesPanel = false;
			self.advertisersPanel = false;
			self.advPurchase = false;
			self.advsPanel = false;
			self.payoutRequestPanel = false;
			self.payoutPanel = false;
			self.playerPanel = false;
			self.xonumiaPanel = false;
			self.levelsPanel = true;
			self.commentsPanel = false;
			self.coinbaseNotificationPanel = false;
		break;
		case 'comments':
			self.homePanel = false;
			self.storePanel = false;
			self.salesPanel = false;
			self.advertisersPanel = false;
			self.advPurchase = false;
			self.advsPanel = false;
			self.payoutRequestPanel = false;
			self.payoutPanel = false;
			self.playerPanel = false;
			self.xonumiaPanel = false;
			self.levelsPanel = false;
			self.commentsPanel = true;
			self.coinbaseNotificationPanel = false;
		break;
		case 'coinbasenotifications':
			self.homePanel = false;
			self.storePanel = false;
			self.salesPanel = false;
			self.advertisersPanel = false;
			self.advPurchase = false;
			self.advsPanel = false;
			self.payoutRequestPanel = false;
			self.payoutPanel = false;
			self.playerPanel = false;
			self.xonumiaPanel = false;
			self.levelsPanel = false;
			self.commentsPanel = false;
			self.coinbaseNotificationPanel = true;
		break;


	}

};



   
}]);


		

}; 