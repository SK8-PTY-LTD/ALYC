var app = require("cloud/app.js");
var Mailgun = require('mailgun-js');
var MAINGUN_KEY = "key-1abb9ac6b44ecb7982ddf76079fd38fc";
var MAINGUN_DOMAIN = "sk8.asia";
//================================================================================
// Cloud functions
//================================================================================
/**
 * Send Email to a particular address, Note, receiver has to be a valid email address
 * @param  {subject: "This is a test subject", message: "This is a test message", receiver: "test@sk8.asia"} request
 * @param  {[Error or null]} response
 * @return {[type]}
 */
AV.Cloud.define("sendEmail", function(request, response) {
	//Construct email
	var name = request.params.name;
	var subject = request.params.subject;
	var email = request.params.email;
	var phone = request.params.phone;
	var content = request.params.content;
	var receiver = request.params.receiver;
	//We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
	var mailgun = new Mailgun({
		apiKey: MAINGUN_KEY,
		domain: MAINGUN_DOMAIN
	});
	var data = {
		//Specify email data
		from: "feedback@sk8.asia",
		//The email to contact
		// to: "nan@jmsaustralia.com",
		to: receiver,
		//Subject and text data
		subject: subject,
		html: "<html xmlns='http://www.w3.org/1999/xhtml'><head><meta name='viewport' content='width=device-width' /><meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /><title>Alerts e.g. approaching your limit</title><link href='styles.css' media='all' rel='stylesheet' type='text/css' /></head><body itemscope itemtype='http://schema.org/EmailMessage'><table class='body-wrap'><tr><td></td><td class='container' width='600'><div class='content'><table class='main' width='100%' cellpadding='0' cellspacing='0'><tr><td class='alert alert-warning'>Attention, You have one new enquiry.</td></tr><tr><td class='content-wrap'><table width='100%' cellpadding='0' cellspacing='0'><tr><td class='content-block'>Client Name: <strong>" + name + "</strong>.</td></tr><tr><td class='content-block'>Reply to: <strong>" + email + "</strong>.</td></tr><tr><td class='content-block'>Phone number: <strong>" + phone + "</strong>.</td></tr><tr><td class='content-block'>Message: <br>" + content + "<br></td></tr><tr><td class='content-block'>Thanks for choosing SK8 PTY LTD.</td></tr></table></td></tr></table></div></td><td></td></tr></table></body></html>"
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