//================================================================================
// Shelf is a utility class for apps empowered for Shelf
// Author: Xujie Song
// Copyright: SK8 PTY LTD
//================================================================================

var Shelf = function(shopId) {

	var SHShop = require('cloud/objects/SHShop.js');
	var shop = new SHShop({
		"id": shopId
	});
	shop.fetch({
		success: function(shop) {

			if (shop.isLive()) {
				Shelf.Stripe = require('stripe');
				Shelf.Stripe.initialize('sk_live_BD6OKPpH8ZORspdQcMtSbtZN');
			} else {
				Shelf.Stripe = require('stripe');
				Shelf.Stripe.initialize('sk_test_VmfbXMZ9fJMkDh8IrzlgsTx0');
			}

			Shelf.currentShop = shop;
			Shelf.currentSeller = Shelf.currentShop.getOwner();
			Shelf.currentSeller.fetch({
				success: function(seller) {
					Shelf.seller = seller;
				},
				error: function(seller, error) {
					console.log(error);
				}
			});

			Shelf.currentShopName = Shelf.currentShop.getName();
			Shelf.currentPrimaryColor = Shelf.currentShop.getPrimaryColor();
			Shelf.currentSecondaryColor = Shelf.currentShop.getSecondaryColor();
			Shelf.currentIconImage = Shelf.currentShop.getIcon();
			Shelf.currentTaglineImage = Shelf.currentShop.getTagline();
			Shelf.currentLogoImage = Shelf.currentShop.getLogo();

		},
		error: function(shop, error) {
			window.alert(error.message);
		}
	});

	Shelf.currentUser = SHUser.getCurrentUser();
	Shelf.currentUser.fetch({
		success: function(user) {
			Shelf.currentUser = user;
		},
		error: function(seller, error) {
			console.log(error);
		}
	});

	Shelf.admin = new SHUser({
		"id": "4U6ICM0QFq"
	});
	Shelf.currentPurchase = new SHPurchase();
}

Shelf.showError = function(error) {
	window.alert(error.message);
};

Shelf.log = function(message) {
	window.alert(message);
};

Shelf.sendSMS = function(message, receiver) {

	var Twilio = require('twilio')('AC985571b788d6453113144e2b53bcdd51', 'a45d75865d0d10436de72d0fd7bbab64');

	// Send an SMS message
	Twilio.sendSms({
		to: receiver,
		from: '+15596646446',
		body: message
	}, function(error, responseData) {
		if (error) {
			console.log(error);
		} else {
			//SMS was sent
		}
	});
}

Shelf.sendEmail = function(receiver, subject, message) {

	var Mailgun = require('mailgun');
	Mailgun.initialize('sk8.asia', 'key-1abb9ac6b44ecb7982ddf76079fd38fc');

	//Send email
	Mailgun.sendEmail({
		to: receiver,
		from: "feedback@sk8.asia",
		subject: subject,
		text: message
	}, {
		success: function(httpResponse) {
			//Email was sent
		},
		error: function(httpResponse) {
			console.log(httpResponse);
		}
	});
}

Shelf.sendPush = function(alert, receiverQuery) {

	//Send push
	Parse.Push.send({
		where: receiverQuery,
		data: {
			alert: alert
		}
	}, {
		success: function() {
			//Push was sent
		},
		error: function(error) {
			console.log(error.message);
		}
	});
}

Shelf.Error = function(Error) {
	var ErrorCode = " Error: " + ("000" + Error).slice(-4);
	switch (Error) {
		case 0:
			// A user (SHUser) object is required before saving an SHAddress object
			var message = "Address is missing user."
			return message + ErrorCode;
			break;
		case 1:
			// A recipient (String) is required before saving an SHAddress object
			var message = "Address is missing recipient."
			return message + ErrorCode;
			break;
		case 2:
			// A contactNumber (String) is required before saving an SHAddress object
			var message = "Address is missing contact number."
			return message + ErrorCode;
			break;
		case 3:
			// A streetAddress (String) is required before saving an SHAddress object
			var message = "Address is missing street address."
			return message + ErrorCode;
			break;
		case 4:
			// A city (String) is required before saving an SHAddress object
			var message = "Address is missing city."
			return message + ErrorCode;
			break;
		case 5:
			// A state (String) is required before saving an SHAddress object
			var message = "Address is missing state."
			return message + ErrorCode;
			break;
		case 6:
			// A country (String) is required before saving an SHAddress object
			var message = "Address is missing country."
			return message + ErrorCode;
			break;
		case 7:
			// A postalCode (Number) is required before saving an SHAddress object
			var message = "Address is missing postal code."
			return message + ErrorCode;
			break;
		case 10:
			// A name (String) is required before saving an SHCategory object
			var message = "Category is missing name."
			return message + ErrorCode;
			break;
		case 20:
			// A user (SHUser) is required before saving an SHComment object
			var message = "Comment is missing user."
			return message + ErrorCode;
			break;
		case 21:
			// A product (SHProduct) is required before saving an SHComment object
			var message = "Comment is missing product."
			return message + ErrorCode;
			break;
		case 22:
			// A text (String) is required before saving an SHComment object
			var message = "Comment is missing text."
			return message + ErrorCode;
			break;
		case 30:
			// A shop (SHShop) is required before saving an SHMembership object
			var message = "Membership is missing shop."
			return message + ErrorCode;
			break;
		case 31:
			// A user (SHUser) is required before saving an SHMembership object
			var message = "Membership is missing user."
			return message + ErrorCode;
			break;
		case 40:
			// A category (SHCategory) is required before saving an SHProduct object
			var message = "Product is missing category."
			return message + ErrorCode;
			break;
		case 41:
			// A cover image (AVFile) is required before saving an SHProduct object
			var message = "Product is missing cover image."
			return message + ErrorCode;
			break;
		case 42:
			// A name (String) is required before saving an SHProduct object
			var message = "Product is missing name."
			return message + ErrorCode;
			break;
		case 43:
			// A price (float) is required before saving an SHProduct object
			var message = "Product is missing price."
			return message + ErrorCode;
			break;
		case 44:
			// Product price cannot be $0.00
			var message = "Product price cannot be $0.00."
			return message + ErrorCode;
			break;
		case 45:
			// A seller (SHUser) is required before saving an SHProduct object
			var message = "Product is missing seller."
			return message + ErrorCode;
			break;
		case 50:
			// A buyer (SHUser) is required before saving an SHPurchase object
			var message = "Purchase is missing buyer."
			return message + ErrorCode;
			break;
		case 51:
			// A deliveryAddress (SHAddress) is required before saving an SHPurchase object
			var message = "Purchase is missing delivery address."
			return message + ErrorCode;
			break;
		case 52:
			// A totalPriceInCent (SHAddress) is required before saving an SHPurchase object
			var message = "Purchase is missing total price."
			return message + ErrorCode;
			break;
		case 53:
			// totalPriceInCent cannot be 0
			var message = "Total cannot be $0.00 for a purchase."
			return message + ErrorCode;
			break;
		case 54:
			// A description (String) is required before saving an SHPurchase object
			var message = "Purchase is missing description."
			return message + ErrorCode;
			break;
		case 55:
			// A currency (String) is required before saving an SHPurchase object
			var message = "Purchase is missing currency detail."
			return message + ErrorCode;
			break;
		case 45:
			// A currency (String) is required before saving an SHPurchase object
			var message = "Purchase is missing currency detail."
			return message + ErrorCode;
		case 46:
			// A token (String) is required before saving an SHPurchase object
			var message = "Purchase is missing payment detail."
			return message + ErrorCode;
			break;
		case 60:
			// A buyer (SHUser) is required before saving an SHPurchaseEntry object
			var message = "PurchaseEntry is missing buyer."
			return message + ErrorCode;
			break;
		case 61:
			// A seller (SHUser) is required before saving an SHPurchaseEntry object
			var message = "PurchaseEntry is missing seller."
			return message + ErrorCode;
			break;
		case 62:
			// A product (SHProduct) is required before saving an SHPurchaseEntry object
			var message = "PurchaseEntry is missing product."
			return message + ErrorCode;
			break;
		case 63:
			// A purchase (SHPurchase) is required before saving an SHPurchaseEntry object
			var message = "PurchaseEntry is missing purchase."
			return message + ErrorCode;
			break;
		case 64:
			// A deliveryAdderss (SHAddress) is required before saving an SHPurchaseEntry object
			var message = "SHPurchaseEntry is missing delivery address."
			return message + ErrorCode;
			break;
		case 65:
			// One or more product is out of order
			var message = "Product is out of order."
			return message + ErrorCode;
			break;
		default:
			// Error code not found
			var message = "Error cound not found."
			return message + ErrorCode;
			break;
	}
}

//================================================================================
// Export class
//================================================================================

module.exports = Shelf;