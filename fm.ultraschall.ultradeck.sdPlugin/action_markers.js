const markers = {
	settings: {},

	onWillAppear: function (jsn) {
		console.log("huhu i bims eine Marker Action", jsn);
		this.settings = jsn.payload.settings;

		// set defaults, if nothing is set
		if (!this.settings.hasOwnProperty('markertype')) { this.settings.markertype = "Insert chapter marker"; }
		if (!this.settings.hasOwnProperty('icon')) { this.settings.icon = "action/images/Chapter_marker.svg"; }
		if (!this.settings.hasOwnProperty('title')) { this.settings.title = "chapter"; }
		if (!this.settings.hasOwnProperty('markercolor')) { this.settings.markercolor = defaulticoncolor; }
		if (!this.settings.hasOwnProperty('markercolortext')) { this.settings.markercolortext = "Icon color"; }
		if (!this.settings.hasOwnProperty('markertext')) { this.settings.markertext = ""; }
		if (!this.settings.hasOwnProperty('cursor')) { this.settings.cursor = "Automatic depending on followmode"; }
		if (!this.settings.hasOwnProperty('markeroffset')) { this.settings.markeroffset = "0"; }
		if (!this.settings.hasOwnProperty('iconstyle')) { this.settings.iconstyle = "normal"; }
		if (!this.settings.hasOwnProperty('url')) { this.settings.url = "/_/SET/EXTSTATE/ultradeck/markertype/chapter" + ";SET/EXTSTATE/ultradeck/markeroffset/" + encodeURIComponent(this.settings.markeroffset) + ";SET/EXTSTATE/ultradeck/cursor/" + encodeURIComponent(this.settings.cursor) + ";_Ultraschall_StreamDeck"; }
		if (ExtraDefaultColor[this.settings.icon]) { this.settings.markercolor = ExtraDefaultColor[this.settings.icon]; }

		this.settings.lastmarkertype = this.settings.markertype;
		$SD.api.setSettings(jsn.context, this.settings);
		this.setIconColor(jsn);

		// refresh
		this.onDidReceiveSettings(jsn);
	},

	onKeyDown: function (jsn) {
		this.settings = jsn.payload.settings;
		var xhttp = new XMLHttpRequest();
		var request_url = "http://" + globalSettings.ipadress + ":" + globalSettings.port + this.settings.url;
		xhttp.open("GET", request_url, true);

		xhttp.onerror = function () {
			this.settings = jsn.payload.settings;
			var image = SetImageStyle(Icons[this.settings.icon], this.settings.iconstyle, this.settings.markercolor);
			// add RedX:
			image = image.replace(/\<\/svg\>/g, `${redX}</svg>`);
			$SD.api.setImage(jsn.context, 'data:image/svg+xml;base64,' + btoa(image));
			$SD.api.setTitle(jsn.context, this.settings.title);
		};

		xhttp.onload = function () {
			this.settings = jsn.payload.settings;
			var image = SetImageStyle(Icons[this.settings.icon], this.settings.iconstyle, this.settings.markercolor);
			$SD.api.setImage(jsn.context, 'data:image/svg+xml;base64,' + btoa(image));
			$SD.api.setTitle(jsn.context, this.settings.title);
		};

		xhttp.send();
	},

	onSendToPlugin: function (jsn) {
		if (jsn.payload.hasOwnProperty('sdpi_collection')) {
			if (jsn.payload.sdpi_collection.key === "resetcolor") {
				this.resetIconColor(jsn);
			}
		}
	},

	setIconColor: function (jsn) {
		var image = SetImageStyle(Icons[this.settings.icon], this.settings.iconstyle, this.settings.markercolor);
		$SD.api.setImage(jsn.context, 'data:image/svg+xml;base64,' + btoa(image));
		$SD.api.setTitle(jsn.context, this.settings.title);
		$SD.api.setSettings(jsn.context, this.settings);
	},

	resetIconColor: function (jsn) {
		this.settings.markercolor = defaulticoncolor;
		if (ExtraDefaultColor[this.settings.icon]) {
			this.settings.markercolor = ExtraDefaultColor[this.settings.icon];
		}
		this.setIconColor(jsn);
	},

	onDidReceiveSettings: function (jsn) {
		console.log('%c%s', 'color: white; background: red; font-size: 15px;', 'Actio Markers.js onDidReceiveSettings:', jsn);
		this.settings = jsn.payload.settings;
		console.log("%s - %s", this.settings.markertype, this.settings.lastmarkertype);
		if (this.settings.markertype === this.settings.lastmarkertype) { // no markertype change
			// do something
			var markerchanged = false;
		} else { //markertype changed, reset values       
			// default values
			var markerchanged = true;
			this.settings.markercolortext = "Icon color";
			this.settings.markercolor = defaulticoncolor;
			this.settings.markertext = "";
			this.settings.markeroffset = "";
			this.settings.cursor = "";
			this.settings.lastmarkertype = this.settings.markertype;
			this.settings.iconstyle = "normal"
		}

		switch (this.settings.markertype) {
			case "Insert chapter marker":
				if (this.settings.markeroffset === "") { this.settings.markeroffset = "0" };
				this.settings.markercolortext = "Icon color";
				if (this.settings.cursor === "") { this.settings.cursor = "Automatic depending on followmode" };
				this.settings.url = "/_/SET/EXTSTATE/ultradeck/markertype/chapter" + ";SET/EXTSTATE/ultradeck/markeroffset/" + encodeURIComponent(this.settings.markeroffset) + ";SET/EXTSTATE/ultradeck/cursor/" + encodeURIComponent(this.settings.cursor) + ";_Ultraschall_StreamDeck";
				this.settings.icon = "action/images/Chapter_marker.svg"
				this.settings.title = "chapter";
				break;
			case "Insert chapter marker and edit name":
				if (this.settings.markeroffset === "") { this.settings.markeroffset = "0" };
				this.settings.markercolortext = "Icon color";
				if (this.settings.cursor === "") { this.settings.cursor = "Automatic depending on followmode" };
				this.settings.url = "/_/SET/EXTSTATE/ultradeck/markertype/chapter_enter_name" + ";SET/EXTSTATE/ultradeck/markeroffset/" + encodeURIComponent(this.settings.markeroffset) + ";SET/EXTSTATE/ultradeck/cursor/" + encodeURIComponent(this.settings.cursor) + ";_Ultraschall_StreamDeck";
				this.settings.icon = "action/images/Chapter_marker.svg"
				this.settings.title = "named";
				break;
			case "Insert marker with time stamp (ISO 8601)":
				if (this.settings.markeroffset === "") { this.settings.markeroffset = "0" };
				this.settings.markercolortext = "Marker color";
				if (this.settings.cursor === "") { this.settings.cursor = "Automatic depending on followmode" };
				this.settings.icon = "action/images/Timestamp_marker.svg"
				this.settings.title = "time";
				if (this.settings.markercolor === "" || markerchanged) {
					if (ExtraDefaultColor[this.settings.icon]) {
						this.settings.markercolor = ExtraDefaultColor[this.settings.icon];
					}
				}
				this.settings.url = "/_/SET/EXTSTATE/ultradeck/markertype/marker_with_timestamp"
					+ ";SET/EXTSTATE/ultradeck/markercolor/" + encodeURIComponent(this.settings.markercolor)
					+ ";SET/EXTSTATE/ultradeck/markeroffset/" + encodeURIComponent(this.settings.markeroffset)
					+ ";SET/EXTSTATE/ultradeck/cursor/" + encodeURIComponent(this.settings.cursor)
					+ ";_Ultraschall_StreamDeck";
				break;
			case "Import chapter markers":
				this.settings.url = "/_/_ULTRASCHALL_INSERT_CHAPTERS";
				this.settings.icon = "action/images/Chapter_marker.svg"
				this.settings.title = "import";
				break;
			case "Export chapter markers":
				this.settings.url = "/_/_ULTRASCHALL_SAVE_CHAPTERS";
				this.settings.icon = "action/images/Chapter_marker.svg"
				this.settings.title = "export";
				break;
			case "Save chapter markers to project folder":
				this.settings.url = "/_/_ULTRASCHALL_SAVE_CHAPTERS_TO_PROJECT";
				this.settings.icon = "action/images/Chapter_marker.svg"
				this.settings.title = "save";
				break;
			case "Insert edit marker":
				if (this.settings.markeroffset === "") { this.settings.markeroffset = "0" };
				this.settings.markercolortext = "Icon color";
				if (this.settings.cursor === "") { this.settings.cursor = "Automatic depending on followmode" };
				this.settings.icon = "action/images/Edit_marker.svg"
				this.settings.title = "edit!";
				if (this.settings.markercolor === "" || markerchanged) {
					if (ExtraDefaultColor[this.settings.icon]) { this.settings.markercolor = ExtraDefaultColor[this.settings.icon]; }
				}
				this.settings.url = "/_/SET/EXTSTATE/ultradeck/markertype/edit_marker"
					+ ";SET/EXTSTATE/ultradeck/markeroffset/" + encodeURIComponent(this.settings.markeroffset)
					+ ";SET/EXTSTATE/ultradeck/cursor/" + encodeURIComponent(this.settings.cursor) + ";_Ultraschall_StreamDeck";
				break;
			case "Import planned markers from clipboard":
				this.settings.url = "/_/_Ultraschall_Import_Markers_As_Planned_From_Clipboard";
				this.settings.icon = "action/images/Chapter_marker.svg"
				this.settings.title = "import";
				break;
			case "Insert next planned marker":
				this.settings.url = "/_/_Ultraschall_Set_Next_Planned_Marker";
				this.settings.icon = "action/images/Chapter_marker.svg"
				this.settings.title = "next pl.";
				break;
			case "Insert next planned marker at play/rec position":
				this.settings.url = "/_/_Ultraschall_Set_Next_Planned_Marker_Play";
				this.settings.icon = "action/images/Chapter_marker.svg"
				this.settings.title = "next plp.";
				break;
			case "Insert custom marker":
				this.settings.icon = "action/images/Chapter_marker.svg"
				this.settings.title = "custom";
				if (this.settings.markertext === "") { this.settings.markertext = "enter custom text here..."; }
				if (this.settings.markercolor === "") { this.settings.markercolor = "#c000c0"; }
				if (this.settings.markeroffset === "") { this.settings.markeroffset = "0" };
				this.settings.markercolortext = "Marker color";
				if (this.settings.cursor === "") { this.settings.cursor = "Play cursor" };
				this.settings.url = "/_/SET/EXTSTATE/ultradeck/markertext/" + encodeURIComponent(this.settings.markertext)
					+ ";SET/EXTSTATE/ultradeck/markercolor/" + encodeURIComponent(this.settings.markercolor)
					+ ";SET/EXTSTATE/ultradeck/markertype/custom"
					+ ";SET/EXTSTATE/ultradeck/markeroffset/" + encodeURIComponent(this.settings.markeroffset)
					+ ";SET/EXTSTATE/ultradeck/cursor/" + encodeURIComponent(this.settings.cursor)
					+ ";_Ultraschall_StreamDeck";
				break;
			case "Go to next marker/project end":
				this.settings.url = "/_/_Ultraschall_Go_To_Next_Marker_Projectend";
				this.settings.icon = "action/images/next_marker.svg"
				this.settings.title = "next";
				break;
			case "Go to previous marker/project start":
				this.settings.url = "/_/_Ultraschall_Go_To_Previous_Marker_Projectstart";
				this.settings.icon = "action/images/prev_marker.svg"
				this.settings.title = "prev.";
				break;
			case "Delete last marker":
				this.settings.url = "/_/_Ultraschall_Delete_Last_Marker";
				this.settings.icon = "action/images/Chapter_marker.svg"
				this.settings.title = "del. last";
				break;
			case "Open marker dashboard":
				this.settings.url = "/_/_Ultraschall_Marker_Dashboard";
				this.settings.icon = "action/images/Marker_Dashboard.svg"
				this.settings.title = "markers";
				break;
		}

		$SD.api.setSettings(jsn.context, this.settings);
		var image = SetImageStyle(Icons[this.settings.icon], this.settings.iconstyle, this.settings.markercolor);
		$SD.api.setImage(jsn.context, 'data:image/svg+xml;base64,' + btoa(image));
		$SD.api.setTitle(jsn.context, this.settings.title);
	}
};
