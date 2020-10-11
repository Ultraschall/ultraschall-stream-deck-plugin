/** ACTIONS */
const levels = {
    settings:{},
    
    onWillAppear: function (jsn) {
        console.log("huhu i bims eine Levels Action",jsn);
        this.settings = jsn.payload.settings;
        
        if (!this.settings.hasOwnProperty('tracknumber')) {this.settings.tracknumber="1";}
        if (!this.settings.hasOwnProperty('sendnumber')) {this.settings.sendnumber="";}
        if (!this.settings.hasOwnProperty('levelstype')) {this.settings.levelstype="Increase track level";}
        if (!this.settings.hasOwnProperty('url_DOWN')) {this.settings.url_DOWN="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/SET/TRACK/1/VOL/+3";}
        if (!this.settings.hasOwnProperty('icon')) {this.settings.icon="action/images/Volume_up@2x.png";}
        if (!this.settings.hasOwnProperty('mytitle')) {this.settings.mytitle="Increase\nLevel\nTrack 1";}

        $SD.api.setSettings(jsn.context, this.settings); 
        $SD.api.setImage(jsn.context,Icons[this.settings.icon]);
        $SD.api.setTitle(jsn.context, this.settings.mytitle);
    },

    onKeyDown: function (jsn) {
        this.settings = jsn.payload.settings;
        console.log("KeyDown Levels", jsn);
        
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", this.settings.url_DOWN , true);
        xhttp.send();
    },

    onKeyUp: function (jsn) {
        // this.settings = jsn.payload.settings;
        // console.log("KeyUp Levels", jsn);
        
        // var xhttp = new XMLHttpRequest();
        // xhttp.open("GET", this.settings.url_UP , true);
        // xhttp.send();
    },

    onDidReceiveSettings: function(jsn) {
        console.log('%c%s', 'color: white; background: red; font-size: 15px;', 'Actio Markers.js onDidReceiveSettings:', jsn);
        this.settings = jsn.payload.settings;

        // set url for each action
        var levelstype=this.settings.levelstype;
        var url_DOWN="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/";
        var tracknumber=this.settings.tracknumber;
        var sendnumber=this.settings.sendnumber;
        if (sendnumber==="") {sendnumber="1";}

        console.log("levelstype=",levelstype);
        
        switch(levelstype) {
            case "Increase track level" :
                url_DOWN=url_DOWN+"SET/TRACK/"+tracknumber+"/VOL/+1";
                icon="action/images/Volume_up@2x.png";
                console.log("ICON=",icon);
                title="Increase\ntrack "+tracknumber+"\nlevel";
                sendnumber="";
                break;
            case "Decrease track level" :
                url_DOWN=url_DOWN+"SET/TRACK/"+tracknumber+"/VOL/-1";
                icon="action/images/Volume_down@2x.png";
                title="Decrease\ntrack "+tracknumber+"\nlevel";
                sendnumber="";
                break;
            case "Set track level to 0dB" :
                url_DOWN=url_DOWN+"SET/TRACK/"+tracknumber+"/VOL/1";
                icon="action/images/Volume_down@2x.png";
                title="Set\nlevel\nto 0dB\ntrack "+tracknumber;
                sendnumber="";
                break;
            case "Increase send level" :
                url_DOWN=url_DOWN+"SET/TRACK/"+tracknumber+"/SEND/"+sendnumber+"/VOL/+1";
                icon="action/images/Volume_up@2x.png";
                console.log("ICON=",icon);
                title="Increase\nsend "+sendnumber+"\ntrack "+tracknumber+"\nlevel";
                break;
        }

        this.settings.url_DOWN=url_DOWN;
        this.settings.icon=icon;
        this.settings.mytitle=title;
        this.settings.sendnumber=sendnumber;

        $SD.api.setSettings(jsn.context, this.settings); //save settings
        $SD.api.setImage(jsn.context,Icons[icon]);
        $SD.api.setTitle(jsn.context, title);
        
        // set initial state
        //this.onKeyUp(jsn);
    }
};