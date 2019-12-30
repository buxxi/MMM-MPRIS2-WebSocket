Module.register("MMM-MPRIS2-WebSocket",{
	ws: null,
	state: null,
	
	defaults: {
		host : null,
		port : 9000,
		retryInterval: 5 * 60 * 1000
	},

	notificationReceived: function(notification, payload, sender) {
		if (notification == "MODULE_DOM_CREATED") {
			var self = this;

			self.hide();
		
			if (self.config.host === null) {
				self.sendNotification("SHOW_ALERT", { 
					type : "notification",
					title : self.name + " Configuration Error",
					message : "host needs to be set in the configuration file",
				});
				return;
			}
			this.connect();
		}
	},

	getTemplate: function () {
		return "MMM-MPRIS2-WebSocket.njk";
	},

	getStyles: function() {
		return ["MMM-MPRIS2-WebSocket.css"];
	},

	getTemplateData: function () {
		var self = this;
		return { 
			connected: self.ws !== null,
			playing: self.state !== null && 'playing' in self.state,
			state: self.state,
			formatTime: self.formatTime
		};
	},

	connect: function() {
		var self = this;
		var ws = new WebSocket("ws://@" + self.config.host + ":" + self.config.port);
		ws.onopen = function(evt) { 
			console.log("Connected to " + ws.url);
			self.ws = ws;
			self.show();
			self.updateDom();
		};
		ws.onclose = function(evt) { 
			console.log("Disconnected from " + ws.url);
			self.ws = null; 
			self.hide();
			self.retryConnect();
		};
		ws.onerror = function(evt) {
			if (self.ws !== null) { 
				self.sendNotification("SHOW_ALERT", { 
					type : "notification",
					title : self.name + " Error",
					message : "There was an error with the websocket communication",
					timer : 5000
				});
			}
		};
		ws.onmessage = function(message) {
			self.state = JSON.parse(message.data);
			self.updateDom();
		}
	},

	retryConnect: function() {
		var self = this;
		setTimeout(function() {
			self.connect();
		}, self.config.retryInterval);
	},

	formatTime: function(seconds) {
		var minutes = Math.floor(seconds / 60);
		seconds = seconds - (minutes * 60);
		return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
	}
});
