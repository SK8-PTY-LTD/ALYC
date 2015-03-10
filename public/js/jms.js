"use strict";

//Isolation function
(function() {
	//Default function
	var moduleName = "JMS";
	var AV_App_Id = "9bzfvch6oauso7mhu5n3wo8p5vnk8xd2pbl8hiohqg08ib4w";
	var AV_App_Key = "xmkls6i71a6733tow806dze8v5arzi6levnb2sjmbt98v80n";
	//Set root for browser
	var root = this;
	var previous_mymodule = root.JMS;
	//Check module dependency
	var has_require = typeof require !== 'undefined'
	var AV = root.AV

	if (typeof AV === 'undefined') {
		if (has_require) {
			AV = require('avoscloud-sdk').AV;
			AV.initialize(AV_App_Id, AV_App_Key);
		} else throw new Error(moduleName + ' requires AV, see http://leancloud.cn');
	} else {
		AV.initialize(AV_App_Id, AV_App_Key);
	}
	//Initialize module
	var JMS = function() {

	}
	JMS.noConflict = function() {
		root.JMS = previous_mymodule
		return JMS
	}
	//Export module
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = JMS
		}
		exports.JMS = JMS
	} else {
		//Change the root.mymodule to root.customModuleName
		root.JMS = JMS
	}
	//Module code
	// ================================================================================
	// Constructors
	// ================================================================================

	JMS.User = AV.Object.extend("_User");
	JMS.Category = AV.Object.extend("Category");
	JMS.Cruise = AV.Object.extend("Cruise");

	//================================================================================
	// Property setters and getters
	//================================================================================

	JMS.User.prototype.getEmail = function() {
		return this.get("email");
	}

	JMS.User.prototype.setEmail = function(email) {
		this.set("email", email);
	}

	JMS.User.prototype.getProfileName = function() {
		return this.get("profileName");
	}

	JMS.User.prototype.setProfileName = function(profileName) {
		this.set("profileName", profileName);
	}

	JMS.User.prototype.isAdminUser = function() {
		this.get("isAdminUser");
	}

	JMS.Category.prototype.getName = function() {
		return this.get("name");
	}

	JMS.Category.prototype.setName = function(name) {
		this.set("name", name);
	}

	JMS.Cruise.prototype.getName = function() {
		return this.get("name");
	}

	JMS.Cruise.prototype.setName = function(name) {
		this.set("name", name);
	}

	JMS.Cruise.prototype.getSummary = function() {
		return this.get("summary");
	}

	JMS.Cruise.prototype.setSummary = function(summary) {
		this.set("summary", summary);
	}

	JMS.Cruise.prototype.getDetail = function() {
		return this.get("detail");
	}

	JMS.Cruise.prototype.setDetail = function(detail) {
		this.set("detail", detail);
	}

	JMS.Cruise.prototype.getCoverImage = function() {
		return this.get("coverImage");
	}

	JMS.Cruise.prototype.setCoverImage = function(coverImage) {
		this.set("coverImage", coverImage);
	}

	JMS.Cruise.prototype.getPriceInCent = function() {
		return this.get("priceInCent");
	}

	JMS.Cruise.prototype.setPriceInCent = function(priceInCent) {
		this.set("priceInCent", priceInCent);
	}

	JMS.Cruise.prototype.getAgentPriceInCent = function() {
		return this.get("agentPriceInCent");
	}

	JMS.Cruise.prototype.setAgentPriceInCent = function(agentPriceInCent) {
		this.set("agentPriceInCent", agentPriceInCent);
	}

}).call(this);