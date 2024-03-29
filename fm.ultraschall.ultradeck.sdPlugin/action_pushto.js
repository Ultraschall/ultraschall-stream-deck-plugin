/** ACTIONS */
const pushto = {
  settings: {},

  onWillAppear: function (jsn) {
    console.log("huhu i bims eine PushTo Action", jsn);
    this.settings = jsn.payload.settings;

    if (!this.settings.hasOwnProperty('tracknumber')) { this.settings.tracknumber = "1"; }
    if (!this.settings.hasOwnProperty('pushtotype')) { this.settings.pushtotype = "Push to mute"; }

    if (!this.settings.hasOwnProperty('url_UP')) {
      this.settings.url_UP = "/_/"
        + "SET/EXTSTATE/ultradeck/mutetype/unmute;"
        + "SET/EXTSTATE/ultradeck/cursor/Play cursor;"
        + "SET/EXTSTATE/ultradeck/tracknumber/" + this.settings.tracknumber + ";"
        + "SET/EXTSTATE/ultradeck/down/0;"
        + "_Ultraschall_StreamDeck";
    }
    if (!this.settings.hasOwnProperty('url_DOWN')) {
      this.settings.url_DOWN = "/_/"
        + "SET/EXTSTATE/ultradeck/mutetype/mute;"
        + "SET/EXTSTATE/ultradeck/cursor/Play cursor;"
        + "SET/EXTSTATE/ultradeck/tracknumber/" + this.settings.tracknumber + ";"
        + "SET/EXTSTATE/ultradeck/down/1;"
        + "_Ultraschall_StreamDeck";
    }

    if (!this.settings.hasOwnProperty('icon')) { this.settings.icon = "action/images/muted.svg"; }
    if (!this.settings.hasOwnProperty('iconstyle')) { this.settings.iconstyle = "normal"; }
    if (!this.settings.hasOwnProperty('mytitle')) { this.settings.mytitle = "Push\nto\nmute\nTrack 1"; }
    if (!this.settings.hasOwnProperty('markercolor')) { this.settings.markercolor = defaulticoncolor; }

    var image = SetImageStyle(Icons[this.settings.icon], this.settings.iconstyle, this.settings.markercolor);
    $SD.api.setSettings(jsn.context, this.settings);
    $SD.api.setImage(jsn.context, 'data:image/svg+xml;base64,' + btoa(image));
    $SD.api.setTitle(jsn.context, this.settings.mytitle);
  },

  onKeyDown: function (jsn) {
    this.settings = jsn.payload.settings;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://" + globalSettings.ipadress + ":" + globalSettings.port + this.settings.url_DOWN, true);
    xhttp.send();
  },

  onKeyUp: function (jsn) {
    this.settings = jsn.payload.settings;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://" + globalSettings.ipadress + ":" + globalSettings.port + this.settings.url_UP, true);
    xhttp.send();
  },

  onSendToPlugin: function (jsn) {
    if (jsn.payload.hasOwnProperty('sdpi_collection')) {
      if (jsn.payload.sdpi_collection.key === "resetcolor") {
        this.settings.markercolor = defaulticoncolor;
        $SD.api.setSettings(jsn.context, this.settings);
        var image = Icons[this.settings.icon];
        image = image.replace('#d8d8d8', this.settings.markercolor);
        $SD.api.setImage(jsn.context, 'data:image/svg+xml;base64,' + btoa(image));
      }
    }
  },

  onDidReceiveSettings: function (jsn) {
    console.log('%c%s', 'color: white; background: red; font-size: 15px;', 'Actio Markers.js onDidReceiveSettings:', jsn);
    this.settings = jsn.payload.settings;
    var url_UP = "";
    var url_DOWN = "";
    var tracknumber = this.settings.tracknumber;
    var icon = "";

    switch (this.settings.pushtotype) {
      case "Push to mute":
        url_DOWN = "/_/"
          + "SET/EXTSTATE/ultradeck/mutetype/mute;"
          + "SET/EXTSTATE/ultradeck/cursor/Play cursor;"
          + "SET/EXTSTATE/ultradeck/tracknumber/" + this.settings.tracknumber + ";"
          + "SET/EXTSTATE/ultradeck/down/1;"
          + "_Ultraschall_StreamDeck";

        url_UP = "/_/"
          + "SET/EXTSTATE/ultradeck/mutetype/unmute;"
          + "SET/EXTSTATE/ultradeck/cursor/Play cursor;"
          + "SET/EXTSTATE/ultradeck/tracknumber/" + this.settings.tracknumber + ";"
          + "SET/EXTSTATE/ultradeck/down/0;"
          + "_Ultraschall_StreamDeck";

        icon = "action/images/muted.svg"
        title = "Push\nto\nmute\nTrack " + tracknumber;
        break;
      case "Push to talk":
        url_DOWN = "/_/"
          + "SET/EXTSTATE/ultradeck/mutetype/PTTunmute;"
          + "SET/EXTSTATE/ultradeck/cursor/Play cursor;"
          + "SET/EXTSTATE/ultradeck/tracknumber/" + this.settings.tracknumber + ";"
          + "SET/EXTSTATE/ultradeck/down/1;"
          + "_Ultraschall_StreamDeck";

        url_UP = "/_/"
          + "SET/EXTSTATE/ultradeck/mutetype/PTTmute;"
          + "SET/EXTSTATE/ultradeck/cursor/Play cursor;"
          + "SET/EXTSTATE/ultradeck/tracknumber/" + this.settings.tracknumber + ";"
          + "SET/EXTSTATE/ultradeck/down/0;"
          + "_Ultraschall_StreamDeck";
        icon = "action/images/unmuted.svg"
        title = "Push\nto\ntalk\nTrack " + tracknumber;
        break;
    }
    this.settings.url_UP = url_UP;
    this.settings.url_DOWN = url_DOWN;
    this.settings.icon = icon;
    this.settings.mytitle = title;

    $SD.api.setSettings(jsn.context, this.settings);
    var image = SetImageStyle(Icons[icon], this.settings.iconstyle, this.settings.markercolor);
    $SD.api.setImage(jsn.context, 'data:image/svg+xml;base64,' + btoa(image));
    $SD.api.setTitle(jsn.context, title);
    this.onKeyUp(jsn);
  }
};
