/** ACTIONS */
const levels = {
    settings:{},
    
    onWillAppear: function (jsn) {
        console.log("huhu i bims eine Levels Action",jsn);
        this.settings = jsn.payload.settings;
        
        if (!this.settings.hasOwnProperty('tracknumber')) {this.settings.tracknumber="1";}
        if (!this.settings.hasOwnProperty('sendnumber')) {this.settings.sendnumber="";}
        if (!this.settings.hasOwnProperty('levelstype')) {this.settings.levelstype="Increase track level";}
        if (!this.settings.hasOwnProperty('url_DOWN')) {this.settings.url_DOWN="/_/SET/TRACK/1/VOL/+3";}
        if (!this.settings.hasOwnProperty('icon')) {this.settings.icon="action/images/Volume_up.svg";}
        if (!this.settings.hasOwnProperty('mytitle')) {this.settings.mytitle="vol + 1";}

        $SD.api.setSettings(jsn.context, this.settings); 
        $SD.api.setImage(jsn.context, 'data:image/svg+xml;base64,'+btoa(Icons[this.settings.icon]));
        $SD.api.setTitle(jsn.context, this.settings.mytitle);

        // refresh
        this.onDidReceiveSettings(jsn);
    },

    onKeyDown: function (jsn) {
        this.settings = jsn.payload.settings;
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://"+globalSettings.ipadress+":"+globalSettings.port+this.settings.url_DOWN , true);
        xhttp.send();
    },

    onKeyUp: function (jsn) {
    },

    onDidReceiveSettings: function(jsn) {
        console.log('%c%s', 'color: white; background: red; font-size: 15px;', 'Actio Markers.js onDidReceiveSettings:', jsn);
        this.settings = jsn.payload.settings;

        // set url for each action
        var levelstype=this.settings.levelstype;
        var url_DOWN="";
        var tracknumber=this.settings.tracknumber;
        var sendnumber=this.settings.sendnumber;
        if (sendnumber==="") {sendnumber="1";}

        switch(levelstype) {
            case "Increase track level" :
                url_DOWN="/_/SET/TRACK/"+tracknumber+"/VOL/+1";
                icon="action/images/Volume_up.svg";
                title="vol + "+tracknumber;
                sendnumber="";
                break;
            case "Decrease track level" :
                url_DOWN="/_/SET/TRACK/"+tracknumber+"/VOL/-1";
                icon="action/images/Volume_down.svg";
                title="vol - "+tracknumber;
                sendnumber="";
                break;
            case "Increase send level" :
                url_DOWN="/_/SET/TRACK/"+tracknumber+"/SEND/"+sendnumber+"/VOL/+1";
                icon="action/images/Volume_up.svg";
                title="+ send "+sendnumber+"\ntrack "+tracknumber+"\nlevel";
                break;
            case "Decrease send level" :
                url_DOWN="/_/SET/TRACK/"+tracknumber+"/SEND/"+sendnumber+"/VOL/-1";
                icon="action/images/Volume_down.svg";
                title="+ send "+sendnumber+"\ntrack "+tracknumber+"\nlevel";
                break;
        }

        this.settings.url_DOWN=url_DOWN;
        this.settings.icon=icon;
        this.settings.mytitle=title;
        this.settings.sendnumber=sendnumber;

        $SD.api.setSettings(jsn.context, this.settings); //save settings
        $SD.api.setImage(jsn.context, 'data:image/svg+xml;base64,'+btoa(Icons[icon]));
        
        
        $SD.api.setTitle(jsn.context, title);
        
        // set initial state
        //this.onKeyUp(jsn);
    }
};