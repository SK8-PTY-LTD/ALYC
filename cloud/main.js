var app = require("cloud/app.js");
var SH = require('cloud/shelf.js');
// var shelf = Shelf("54aa1d14e4b0ac08ac9c086c");

var twilio = require("twilio");
var TWILIO_SID = "AC985571b788d6453113144e2b53bcdd51";
var TWILIO_AUTH = "a45d75865d0d10436de72d0fd7bbab64";
var TWILIO_NUMBER = "+15596646446";

var Mailgun = require('mailgun-js');
var MAINGUN_KEY = "key-1abb9ac6b44ecb7982ddf76079fd38fc";
var MAINGUN_DOMAIN = "sk8.asia";

var YTX_ACCOUNT_SID = "8a48b5514b0b8727014b114f547e037d";
var YTX_ACCOUNT_AUTH_TOKEN = "efe84f72028c4025ac83febe5f052fe7";
var YTX_APP_ID = "8a48b5514b0b8727014b22a0d0d5108d";

var CryptoJS = require("crypto-js");

var STRIPE_SECRET_KEY = "sk_live_BD6OKPpH8ZORspdQcMtSbtZN";
var STRIPE_SECRET_TEST_KEY = "sk_test_VmfbXMZ9fJMkDh8IrzlgsTx0";
var stripe = require('stripe')(STRIPE_SECRET_KEY);

//================================================================================
// Cloud functions
//================================================================================

/**
 * Send SMS to a particular number, number has to be a valid number.
 * @param  {message: "This is a test message", receiver: "+61449843149"} request
 * @param  {[Error or null]} response
 * @return {[type]}
 */
AV.Cloud.define("sendSMS", function(request, response) {
	//Construct message
	var receiver = request.params.receiver;
	var content = request.params.message;

	var client = new twilio.RestClient(TWILIO_SID, TWILIO_AUTH);
	client.messages.create({
		body: content,
		to: receiver,
		from: TWILIO_NUMBER
	}, function(err, message) {
		if (err) {
			response.error(err);
		} else {
			response.success(content);
		}
	});
});

/**
 * Send verification sms to a number, Note, receiver has to be a valid mobile number
 * e.g. +86134xxxx4876
 * @param  {receiverQuery: query, alert: message} request
 * @param  {[Error or null]} response
 * @return {[type]}
 */
AV.Cloud.define("sendSMSVerification", function(request, response) {
	//Construct message
	var verificatioinCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
	var message = verificatioinCode + " is your verification code from SHELF, enjoy shopping! :)";
	var receiver = request.params.receiver;
	var client = new twilio.RestClient(TWILIO_SID, TWILIO_AUTH);

	client.messages.create({
		body: content,
		to: receiver,
		from: TWILIO_NUMBER
	}, function(err, message) {
		if (err) {
			response.error(err);
		} else {
			response.success(verificatioinCode);
		}
	});
});

/**
 * Send Email to a particular address, Note, receiver has to be a valid email address
 * @param  {subject: "This is a test subject", message: "This is a test message", receiver: "test@sk8.asia"} request
 * @param  {[Error or null]} response
 * @return {[type]}
 */
AV.Cloud.define("sendEmail", function(request, response) {

	//Construct email
	var receiver = request.params.receiver;
	var subject = request.params.subject;
	var message = request.params.message;

	//We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
	var mailgun = new Mailgun({
		apiKey: MAINGUN_KEY,
		domain: MAINGUN_DOMAIN
	});

	var data = {
		//Specify email data
		from: "feedback@sk8.asia",
		//The email to contact
		to: receiver,
		//Subject and text data  
		subject: subject,
		text: message
	}

	//Invokes the method to send emails given the above data with the helper library
	mailgun.messages().send(data, function(err, body) {
		//If there is an error, render the error page
		if (err) {
			response.error(httpResponse);
		}
		//Else we can greet    and leave
		else {
			response.success(message);
		}
	});
});

/**
 * Send Email to a particular address, Note, receiver has to be a valid email address
 * @param  {tokenId: "tok_xxxxxx"} request
 * @param  {[Error or null]} response
 * @return {[type]}
 */
AV.Cloud.define("updateCard", function(request, response) {

	var user = request.user
	var tokenId = request.params.tokenId;

	var customerId = user.get("customerId");
	if (customerId != undefined) {
		stripe.customers.createCard(
			customerId, {
				card: tokenId
			},
			function(err, card) {
				if (err != undefined) {
					console.log(err);
					user.unset("customerId");
				} else {
					user.set("cardId", card.id);
				}
				user.save(null, {
					success: function(user) {
						response.success();
					},
					error: function(user, error) {
						response.error(error);
					}
				});
			}
		);
	} else {
		var email = user.getEmail();
		//Create stripe customer id
		if (user.get("customerId") == undefined) {
			stripe.customers.create({
					email: user.getEmail()
				},
				function(err, customer) {
					if (!err) {
						user.set("customerId", customer.id);
						user.save();
					} else {
						console.log("Failed to create customerId, " + err);
					}
					response.success();

				}
			);
		}
	}
});

AV.Cloud.define("createCharge", function(request, response) {
	//Construct message
	var totalPriceInCent = request.params.totalPriceInCent;
	var currency = request.params.currency;
	var token = request.params.token;
	var detail = request.params.detail;

	stripe.charges.create({
		amount: totalPriceInCent,
		currency: currency,
		card: token,
		description: detail
	}, function(err, charge) {
		if (!err) {
			response.success(charge.id);
		} else {
			console.log(err);
			response.error(err);
		}
	});
});

//================================================================================
// Before & after save safety checks
//================================================================================

AV.Cloud.afterSave("_User", function(request) {

	var user = request.object;

	//Create stripe customer id
	if (user.get("customerId") == undefined) {
		stripe.customers.create({
				email: user.getEmail()
			},
			function(err, customer) {
				if (!err) {
					user.set("customerId", customer.id);
					user.save();
				}
			}
		);
	}

	if (user.get("messengerId") == undefined) {

		//Get time stamp
		d = new Date();
		localTime = d.getTime();
		localOffset = d.getTimezoneOffset() * 60000;
		utc = localTime + localOffset;
		offset = 8;
		china = utc + (3600000 * offset);
		var date = new Date(china);
		var fmt = "yyyyMMddHHmmss";
		var o = {
			"M+": date.getMonth() + 1, //月份 
			"d+": date.getDate(), //日 
			"H+": date.getHours(), //小时 
			"m+": date.getMinutes(), //分 
			"s+": date.getSeconds(), //秒 
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
			"S": date.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		var timestamp = fmt;

		//Get and encrypt sig
		var sig = YTX_ACCOUNT_SID + YTX_ACCOUNT_AUTH_TOKEN + timestamp;
		sig = CryptoJS.MD5(sig).toString();
		sig = sig.toUpperCase();
		var src = YTX_ACCOUNT_SID + ":" + timestamp;
		var words = CryptoJS.enc.Utf8.parse(src); // WordArray object
		src = CryptoJS.enc.Base64.stringify(words); // string: 'SGVsbG8gd29ybGQ='
		var baseUrl = 'https://app.cloopen.com:8883/2013-12-26/Accounts/' + YTX_ACCOUNT_SID;
		var newSubUserUrl = baseUrl + '/SubAccounts?sig=' + sig;
		var bondSubUserURL = baseUrl + '/QuerySubAccountByName?sig=' + sig;
		var email = user.getEmail();

		//Create YUNTONGXUN subaccount id
		AV.Cloud.httpRequest({
			method: 'POST',
			secureProtocol: 'SSLv3_method',
			url: newSubUserUrl,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json;charset=utf-8',
				'Authorization': src
			},
			body: {
				'appId': YTX_APP_ID,
				'friendlyName': email
			},
			success: function(httpResponse) {
				var responseData = httpResponse.data;
				if (responseData.statusCode != 000000) {
					if (responseData.statusCode == 111150) {
						//User already exists, fetch him and bond them
						AV.Cloud.httpRequest({
							method: 'POST',
							secureProtocol: 'SSLv3_method',
							url: bondSubUserURL,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json;charset=utf-8',
								'Authorization': src
							},
							body: {
								'appId': YTX_APP_ID,
								'friendlyName': email
							},
							success: function(httpResponse) {
								var responseData = httpResponse.data;
								if (responseData.statusCode != 000000) {
									console.error('Request failed with response code ' + responseData.statusCode);
								} else {
									var subAccount = responseData.SubAccount;
									user.set("messengerId", subAccount.subAccountSid);
									user.set("messengerToken", subAccount.subToken);
									user.set("voipAccount", subAccount.voipAccount);
									user.set("voipPassword", subAccount.voipPwd);
									user.save();
								}
							},
							error: function(httpResponse) {
								var statusCode = httpResponse.status;
								console.error('Request failed with response code ' + statusCode);
							}
						});
					} else {
						console.error('Request failed with response code ' + httpResponse.status);
					}
				} else {
					var subAccount = responseData.SubAccount;
					user.set("messengerId", subAccount.subAccountSid);
					user.set("messengerToken", subAccount.subToken);
					user.set("voipAccount", subAccount.voipAccount);
					user.set("voipPassword", subAccount.voipPwd);
					user.save();
				}
			},
			error: function(httpResponse) {
				var statusCode = httpResponse.status;
				console.error('Request failed with response code ' + statusCode);
			}
		});

	}
});

AV.Cloud.beforeDelete("_User", function(request, response) {

	var query = new AV.Query(AV.User);
	query.get(request.object.id, {
		success: function(user) {
			//Delete associated images
			// var coverImage = user.get("profileImage");
			// coverImage.destroy();
			// var backgroundImage = user.get("backgroundImage");
			// backgroundImage.destroy();

			//Delete his products
			query = new AV.Query("Product");
			query.equalTo("seller", user);
			query.find({
				success: function(products) {
					AV.Object.destroyAll(products);
					response.success();
				},
				error: function(error) {
					console.error("Error finding related products " + error.code + ": " + error.message);
					response.success();
				}
			});
		},
		error: function(object, error) {
			response.error(error);
		}
	});

});

AV.Cloud.beforeSave("Address", function(request, response) {
	var address = request.object;
	if (address.getUser() == undefined) {
		response.error(Shelf.Error(0));
		return;
	} else if (address.getRecipient() == undefined) {
		response.error(Shelf.Error(1));
		return;
	} else if (address.getContactNumber() == undefined) {
		response.error(Shelf.Error(2));
		return;
	} else if (address.getStreetAddress() == undefined) {
		response.error(Shelf.Error(3));
		return;
	} else if (address.getCity() == undefined) {
		response.error(Shelf.Error(4));
		return;
	} else if (address.getState() == undefined) {
		response.error(Shelf.Error(5));
		return;
	} else if (address.getCountry() == undefined) {
		response.error(Shelf.Error(6));
		return;
	} else if (address.getPostalCode() == undefined) {
		response.error(Shelf.Error(7));
		return;
	}
	response.success();
});

AV.Cloud.afterUpdate("Address", function(request) {

	var address = request.object;
	var user = address.getUser();

	user.setAddress(address);
	user.setRealName(address.getRecipient());

	user.save();
});


AV.Cloud.beforeSave("Category", function(request, response) {
	var category = request.object;
	if (category.getName() == undefined) {
		response.error(Shelf.Error(10));
		return;
	}
	response.success();
});

AV.Cloud.beforeSave("Comment", function(request, response) {
	var comment = request.object;
	if (comment.getUser() == undefined) {
		response.error(Shelf.Error(20));
		return;
	} else if (comment.getProduct() == undefined) {
		response.error(Shelf.Error(21));
		return;
	} else if (comment.getText() == undefined) {
		response.error(Shelf.Error(22));
		return;
	}
	response.success();
});

AV.Cloud.beforeSave("Membership", function(request, response) {
	var membership = request.object;
	if (membership.getShop() == undefined) {
		response.error(Shelf.Error(30));
		return;
	} else if (membership.getUser() == undefined) {
		response.error(Shelf.Error(31));
		return;
	}
	response.success();
});

AV.Cloud.beforeSave("Product", function(request, response) {
	var product = request.object;
	if (product.getCategory() == undefined) {
		response.error(Shelf.Error(40));
		return;
	} else if (product.getCondition() == undefined || product.getCondition() <= 0) {
		product.setCondition(10);
	} else if (product.getCoverImage() == undefined) {
		response.error(Shelf.Error(41));
		return;
	} else if (product.getCurrency() == undefined) {
		response.error(Shelf.Error(45));
		return;
	} else if (product.getDeliveryPriceInCent() == undefined) {
		product.setDeliveryPrice(0);
	} else if (product.getName() == undefined) {
		response.error(Shelf.Error(42));
		return;
	} else if (product.getPriceInCent() == undefined) {
		response.error(Shelf.Error(43));
		return;
	} else if (product.getPriceInCent() == 0) {
		response.error(Shelf.Error(44));
		return;
	} else if (product.getPromoPriceInCent() == undefined) {
		product.setPromoPrice(0);
	} else if (product.getQuantity() == undefined) {
		if (product.isNew()) {
			product.setQuantity(1);
		} else {
			product.setQuantity(0);
			product.setStatus(SH.Product.STATUS_SOLDOUT);
		}
	} else if (product.getQuantity() == 0) {
		if (product.isNew()) {
			product.setQuantity(1);
		} else {
			product.setStatus(SH.Product.STATUS_SOLDOUT);
		}
	} else if (product.getQuantity() < 0) {
		var name = product.getName();
		product.setStatus(SH.Product.STATUS_SOLDOUT);
		response.error(name + " is sold out!");
		return;
	} else if (product.getSeller() == undefined) {
		response.error(Shelf.Error(46));
		return;
	}
	response.success();
});

AV.Cloud.afterUpdate("Product", function(request) {

	var product = request.object;
	var quantity = product.getQuantity();

	if (quantity == undefined) {
		product.setStatus(SH.Product.STATUS_SOLDOUT);
	} else if (quantity <= 0) {
		product.setStatus(SH.product.STATUS_SOLDOUT);
	}
	product.save();

});

AV.Cloud.beforeDelete('Product', function(request, response) {
  //查询Photo中还有没有属于这个相册的照片
  var product = request.object;
  var array = product.get("imageArray");
  console.log(array.length);
  AV.Object.destroyAll(array);
});

AV.Cloud.beforeSave("Purchase", function(request, response) {
	var purchase = request.object;

	if (purchase.isNew()) {
		if (purchase.getBuyer() == undefined) {
			response.error(Shelf.Error(50));
			return;
		}
		if (purchase.getDeliveryAddress() == undefined) {
			response.error(Shelf.Error(51));
			return;
		}
		if (purchase.get("totalPriceInCent") == undefined) {
			response.error(Shelf.Error(52));
			return;
		}
		if (purchase.get("totalPriceInCent") == 0) {
			response.error(Shelf.Error(53));
			return;
		}
		if (purchase.getDescription() == undefined) {
			response.error(Shelf.Error(54));
			return;
		}
		purchase.setStatus(SH.Purchase.STATUS_INITIATED);
		response.success();
	} else {
		response.success();
	}
});

AV.Cloud.beforeSave("PurchaseEntry", function(request, response) {
	var purchaseEntry = request.object;

	if (purchaseEntry.getBuyer() == undefined) {
		response.error(Shelf.Error(60));
		return;
	}
	if (purchaseEntry.getSeller() == undefined) {
		response.error(Shelf.Error(61));
		return;
	}
	if (purchaseEntry.getProduct() == undefined) {
		response.error(Shelf.Error(62));
		return;
	}
	if (purchaseEntry.getPurchase() == undefined) {
		response.error(Shelf.Error(63));
		return;
	}
	if (purchaseEntry.getDeliveryAddress() == undefined) {
		response.error(Shelf.Error(64));
		return;
	}

	//If purchase entry is new, deduct product quantity by 1
	if (purchaseEntry.isNew()) {
		var product = purchaseEntry.getProduct();
		product.fetchWhenSave(true);
		product.increment("quantity", -1);
		product.save(null, {
			success: function(product) {
				purchaseEntry.setStatus(SH.PurchaseEntry.STATUS_INITIATED);
				response.success();
			},
			error: function(product, error) {
				response.error(error);
				return;
			}
		});
	} else {
		response.success();
	}
});