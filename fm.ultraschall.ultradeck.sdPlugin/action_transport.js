const transport = {
  settings: {},
  cache: {},

  onWillAppear: function (jsn) {
    console.log("Huhu i bims ein transport", jsn);
    this.settings = jsn.payload.settings;

    if (!this.settings.hasOwnProperty('transporttype')) { this.settings.transporttype = "Play"; }
    if (!this.settings.hasOwnProperty('url_DOWN')) { this.settings.url_DOWN = "1007"; }
    if (!this.settings.hasOwnProperty('mytitle')) { this.settings.mytitle = "play"; }
    if (!this.settings.hasOwnProperty('icon')) { this.settings.icon = "action/images/play.svg"; }
    if (!this.settings.hasOwnProperty('icon_playstate')) {
      this.settings.icon_playstate = {
        "0": "action/images/Play.svg",
        "1": "action/images/Play2.svg",
        "2": "action/images/Play2.svg",
        "5": "action/images/Play.svg",
        "6": "action/images/Play.svg",
      };
    }

    $SD.api.setSettings(jsn.context, this.settings);
    $SD.api.setImage(context, 'data:image/svg+xml;base64,' + btoa(Icons[this.settings.icon_playstate[0]]));
    $SD.api.setTitle(jsn.context, this.settings.mytitle);

    const TransportButton = new TransportButtonClass(jsn);
    TransportButton.loop();
    this.cache[jsn.context] = TransportButton;
    this.onDidReceiveSettings(jsn);
  },

  onWillDisappear: function (jsn) {
    let found = this.cache[jsn.context];
    if (found) {
      found.destroy();
      delete this.cache[jsn.context];
    }
  },

  onKeyDown: function (jsn) {
    this.settings = jsn.payload.settings;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://" + globalSettings.ipadress + ":" + globalSettings.port + "/_/" + this.settings.url_DOWN, true);
    xhttp.send();
  },

  onDidReceiveSettings: function (jsn) {
    console.log('%c%s', 'color: white; background: red; font-size: 15px;', '[action_transport.js]onDidReceiveSettings:', jsn);
    this.settings = jsn.payload.settings;
    $SD.api.setSettings(jsn.context, this.settings);
    var url_DOWN = "";
    var icon = "";
    var transporttype = this.settings.transporttype;
    var title = "";

    this.settings.icon_playstate = [];
    switch (transporttype) {
      case "Play":
        url_DOWN = "1007";
        this.settings.icon_playstate = { "0": "action/images/Play.svg", "1": "action/images/Play2.svg", "2": "action/images/Play2.svg", "5": "action/images/Play.svg", "6": "action/images/Play.svg" };
        title = "play";
        break;
      case "Pause":
        url_DOWN = "1008";
        this.settings.icon_playstate = { "0": "action/images/Pause.svg", "1": "action/images/Pause.svg", "2": "action/images/Pause2.svg", "5": "action/images/Pause.svg", "6": "action/images/Pause.svg" };
        title = "pause";
        break;
      case "Stop":
        url_DOWN = "1016";
        this.settings.icon_playstate = { "0": "action/images/Stop.svg", "1": "action/images/Stop.svg", "2": "action/images/Stop.svg", "5": "action/images/Stop.svg", "6": "action/images/Stop.svg" };
        title = "stop";
        break;
      case "Go to start of project":
        url_DOWN = "_Ultraschall_Go_To_Start_Of_Project";
        this.settings.icon_playstate = { "0": "action/images/Go_to_start_of_project.svg", "1": "action/images/Go_to_start_of_project.svg", "2": "action/images/Go_to_start_of_project.svg", "5": "action/images/Go_to_start_of_project.svg", "6": "action/images/Go_to_start_of_project.svg" };
        title = "start";
        break;
      case "Go to end of project":
        url_DOWN = "_Ultraschall_Go_To_End_Of_Project";
        this.settings.icon_playstate = { "0": "action/images/Go_to_end_of_project.svg", "1": "action/images/Go_to_end_of_project.svg", "2": "action/images/Go_to_end_of_project.svg", "5": "action/images/Go_to_end_of_project.svg", "6": "action/images/Go_to_end_of_project.svg" };
        title = "end";
        break;
      case "Record":
        url_DOWN = "1013";
        this.settings.icon_playstate = {
          "0": "action/images/Record.svg", "1": "action/images/Record.svg",
          "2": "action/images/Record.svg", "5": "action/images/Record2.svg",
          "6": "action/images/Record2.svg"
        };
        title = "record";
        break;
      case "Jump left to next item edge":
        url_DOWN = "_Ultraschall_Jump_Left_To_Next_Itemedge";
        this.settings.icon_playstate = { "0": "action/images/Go_to_start_of_project.svg", "1": "action/images/Go_to_start_of_project.svg", "2": "action/images/Go_to_start_of_project.svg", "5": "action/images/Go_to_start_of_project.svg", "6": "action/images/Go_to_start_of_project.svg" };
        title = "left";
        break;
      case "Jump right to next item edge":
        url_DOWN = "_Ultraschall_Jump_Right_To_Next_Itemedge";
        this.settings.icon_playstate = { "0": "action/images/Go_to_end_of_project.svg", "1": "action/images/Go_to_end_of_project.svg", "2": "action/images/Go_to_end_of_project.svg", "5": "action/images/Go_to_end_of_project.svg", "6": "action/images/Go_to_end_of_project.svg" };
        title = "right";
        break;
      case "Shuttle Backward":
        url_DOWN = "_Ultraschall_Shuttle_Backward";
        this.settings.icon_playstate = {
          "0": "action/images/Shuttle_Backward.svg",
          "1": "action/images/Shuttle_Backward.svg", "2": "action/images/Shuttle_Backward.svg",
          "5": "action/images/Shuttle_Backward.svg", "6": "action/images/Shuttle_Backward.svg"
        };
        title = "backward";
        break;
      case "Shuttle Pause":
        url_DOWN = "_Ultraschall_Shuttle_Pause";
        this.settings.icon_playstate = { "0": "action/images/Pause.svg", "1": "action/images/Pause.svg", "2": "action/images/Pause.svg", "5": "action/images/Pause.svg", "6": "action/images/Pause.svg" };
        title = "pause";
        break;
      case "Shuttle Forward":
        url_DOWN = "_Ultraschall_Shuttle_Forward";
        this.settings.icon_playstate = { "0": "action/images/Play.svg", "1": "action/images/Play.svg", "2": "action/images/Play.svg", "5": "action/images/Play.svg", "6": "action/images/Play.svg" };
        title = "forward";
        break;
      case "Toggle Repeat":
        url_DOWN = "1068";
        this.settings.icon_playstate = {
          "0": "action/images/Repeat.svg", "1": "action/images/Repeat.svg", "2": "action/images/Repeat.svg",
          "5": "action/images/Repeat.svg", "6": "action/images/Repeat.svg", "R": "action/images/RepeatOn.svg"
        };
        title = "repeat";
        break;
      // playstate is 0 for stopped, 1 for playing, 2 for paused, 5 for recording, and 6 for record paused.
      // "R" is for Repeat On
    }
    this.settings.url_DOWN = url_DOWN;
    this.settings.icon = icon;
    this.settings.mytitle = title;
    this.settings.selectedaction = this.settings.transporttype;
    $SD.api.setSettings(jsn.context, this.settings);
    $SD.api.setTitle(jsn.context, title);

    let found = this.cache[jsn.context];
    if (found) {
      found.refresh(this.settings);
    }
  },
};

function TransportButtonClass(jsonObj) {
  var jsn = jsonObj;
  var context = jsonObj.context;
  var counter = 0;
  var count = 0;
  var settings = jsonObj.payload.settings;
  var playstate_last = "";
  var isRepeatOn_last = "";

  function loop() {
    if (counter === 0) {
      getTransportState();
      counter = setInterval(function (sx) {
        getTransportState();
      }, 50);

    }
    else {
      window.clearInterval(counter);
      counter = 0;
    }
  }

  function refresh(jsn_refresh) {
    playstate_last = "";
    settings = jsn_refresh;
    destroy();
    counter === 0;
    loop();
  }

  function destroy() {
    if (counter !== 0) {
      window.clearInterval(counter);
      counter = 0;
    }
  }

  function getTransportState() {
    if (globalSettings.hasOwnProperty('ipadress')) {
      var xhttp = new XMLHttpRequest();
      var url = "http://" + globalSettings.ipadress + ":" + globalSettings.port + "/_/TRANSPORT";
      xhttp.open("GET", url, true);

      xhttp.onload = function () {
        if (xhttp.readyState === xhttp.DONE) {
          if (xhttp.status === 200) {
            let resultText = xhttp.responseText;
            resultText = resultText.replace(/(\r\n|\n|\r)/gm, "");
            let resultArray = resultText.split('\t');
            let playstate = resultArray[1];
            let position_seconds = resultArray[2];
            let isRepeatOn = resultArray[3];
            let position_string = resultArray[4];
            let position_string_beats = resultArray[5];

            if (playstate_last !== playstate || isRepeatOn_last !== isRepeatOn) {
              if (isRepeatOn === "1" && Icons[settings.icon_playstate["R"]] !== undefined) {
                $SD.api.setImage(context, 'data:image/svg+xml;base64,' + btoa(Icons[settings.icon_playstate["R"]]));
              }
              else {
                $SD.api.setImage(context, 'data:image/svg+xml;base64,' + btoa(Icons[settings.icon_playstate[playstate]]));
              }
            }
            playstate_last = playstate;
          }
        }
      };
      xhttp.send();
    }
  }

  return {
    loop: loop,
    destroy: destroy,
    refresh: refresh
  };
}
