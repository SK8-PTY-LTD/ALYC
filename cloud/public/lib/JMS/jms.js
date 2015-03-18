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
	Object.defineProperty(JMS.User.prototype, "email", {
		get: function() {
			return this.get("email");
		},
		set: function(value) {
			this.set("email", value);
		}
	});
	Object.defineProperty(JMS.User.prototype, "profileName", {
		get: function() {
			return this.get("profileName");
		},
		set: function(value) {
			this.set("profileName", value);
		}
	});

	JMS.User.prototype.isAdminUser = function() {
		this.get("isAdminUser");
	}

	Object.defineProperty(JMS.Category.prototype, "name", {
		get: function() {
			return this.get("name");
		},
		set: function(value) {
			this.set("name", value);
		}
	});

	Object.defineProperty(JMS.Cruise.prototype, "agentPriceInCent", {
		get: function() {
			return this.get("agentPriceInCent");
		},
		set: function(value) {
			this.set("agentPriceInCent", value);
		}
	});

	Object.defineProperty(JMS.Cruise.prototype, "category", {
		get: function() {
			return this.get("category");
		},
		set: function(value) {
			this.set("category", value);
		}
	});

	Object.defineProperty(JMS.Cruise.prototype, "agentPrice", {
		get: function() {
			if (this.tempAgentPricePriceStringPriceString == undefined) {
				this.tempAgentPricePriceStringPriceString = (this.agentPriceInCent/100).toFixed(2);
			}
			return this.tempAgentPricePriceStringPriceString;
		},
		set: function(value) {
			this.agentPriceInCent = parseInt(value * 100);
			//tempString is here to enable decimal input for ng-model
			this.tempAgentPricePriceStringPriceString = value;
		}
	});

	Object.defineProperty(JMS.Cruise.prototype, "coverImage", {
		get: function() {
			return this.get("coverImage");
		},
		set: function(value) {
			this.set("coverImage", value);
		}
	});

	Object.defineProperty(JMS.Cruise.prototype, "detail", {
		get: function() {
			return this.get("detail");
		},
		set: function(value) {
			this.set("detail", value);
		}
	});

	Object.defineProperty(JMS.Cruise.prototype, "imageArray", {
		get: function() {
			return this.get("imageArray");
		},
		set: function(value) {
			this.set("imageArray", value);
		}
	});

	Object.defineProperty(JMS.Cruise.prototype, "minimumHour", {
		get: function() {
			return this.get("minimumHour");
		},
		set: function(value) {
			this.set("minimumHour", value);
		}
	});

	Object.defineProperty(JMS.Cruise.prototype, "name", {
		get: function() {
			return this.get("name");
		},
		set: function(value) {
			this.set("name", value);
		}
	});

	Object.defineProperty(JMS.Cruise.prototype, "priceInCent", {
		get: function() {
			return this.get("priceInCent");
		},
		set: function(value) {
			this.set("priceInCent", value);
		}
	});

	Object.defineProperty(JMS.Cruise.prototype, "price", {
		get: function() {
			if (this.tempPriceString == undefined) {
				this.tempPriceString = (this.priceInCent/100).toFixed(2);
			}
			return this.tempPriceString;
		},
		set: function(value) {
			if (this.agentPrice > value) {
				this.agentPrice = value;
			}
			this.priceInCent = parseInt(value * 100);
			//tempString is here to enable decimal input for ng-model
			this.tempPriceString = value;
		}
	});

	Object.defineProperty(JMS.Cruise.prototype, "summary", {
		get: function() {
			return this.get("summary");
		},
		set: function(value) {
			this.set("summary", value);
		}
	});

}).call(this);