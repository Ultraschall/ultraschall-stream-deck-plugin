const misc = {
    settings:{},
    
    onWillAppear: function (jsn) {
        console.log("huhu i bims eine Misc Action",jsn);
        this.settings = jsn.payload.settings;
        
        if (!this.settings.hasOwnProperty('misctype')) {this.settings.misctype="Custom Action";}
        if (!this.settings.hasOwnProperty('customaction')) {this.settings.customaction="_Ultraschall_StartScreen";}
        if (!this.settings.hasOwnProperty('url')) {this.settings.url="/_/"+this.settings.customaction;}
        if (!this.settings.hasOwnProperty('icon')) {this.settings.icon="action/images/Custom_action.svg";}
        if (!this.settings.hasOwnProperty('iconstyle')) {this.settings.iconstyle="normal";}
        if (!this.settings.hasOwnProperty('mytitle')) {this.settings.mytitle="Custom\nAction";}
        if (!this.settings.hasOwnProperty('markercolor')) {this.settings.markercolor=defaulticoncolor;}
        if (!this.settings.hasOwnProperty('soundboardaction')) {this.settings.soundboardaction="";}
        if (!this.settings.hasOwnProperty('soundboardplayernumber')) {this.settings.soundboardplayernumber="";}

        var image=SetImageStyle(Icons[this.settings.icon], this.settings.iconstyle, this.settings.markercolor);
        $SD.api.setSettings(jsn.context, this.settings); 
        $SD.api.setImage(jsn.context,image);
        $SD.api.setTitle(jsn.context, this.settings.mytitle);

        //refresh
        this.onDidReceiveSettings(jsn);
    },

    onKeyDown: function (jsn) {
        this.settings = jsn.payload.settings;
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://"+globalSettings.ipadress+":"+globalSettings.port+this.settings.url , true);
        xhttp.send();  
    },

    onSendToPlugin: function(jsn) {
        if (jsn.payload.hasOwnProperty('sdpi_collection')) {
            if (jsn.payload.sdpi_collection.key==="resetcolor") {
                this.settings.markercolor=defaulticoncolor;
                $SD.api.setSettings(jsn.context, this.settings);
                var image=SetImageStyle(Icons[this.settings.icon], this.settings.iconstyle, this.settings.markercolor);
                $SD.api.setImage(jsn.context,image);
            }
        }
    },

    onDidReceiveSettings: function(jsn) {
        console.log('%c%s', 'color: white; background: red; font-size: 15px;', 'Action Misc.js onDidReceiveSettings:', jsn);
        this.settings = jsn.payload.settings;

        // set url for each action
        var misctype=this.settings.misctype;
        
        //this.settings.icon="";
        
        switch(misctype) {
            case "Play Ultramind" :
                this.settings.url="/_/_Ultraschall_Mastermind";
                this.settings.icon="action/images/Game.svg"
                this.settings.mytitle="Play\nUltra-\nmind";
                this.settings.customaction="";
                break;
            case "Play Moonlander" :
                this.settings.url="/_/_Ultraschall_Moonlander";
                this.settings.icon="action/images/Game.svg"
                this.settings.mytitle="Play\nMoon-\nlander";
                this.settings.customaction="";
                break;
            case "Custom Action" :
                if (!this.settings.hasOwnProperty('customaction')||this.settings.customaction==="") {this.settings.customaction="_Ultraschall_StartScreen";}
                this.settings.url="/_/"+this.settings.customaction;
                this.settings.icon="action/images/Custom_action.svg"
                this.settings.mytitle="Custom\nAction";
                break;
            case "SL Toggle Mute" :
                this.settings.url="ws://"+globalSettings.SLipadress+":"+globalSettings.SLport+"/ws_options";
                this.settings.icon="action/images/Custom_action.svg"
                this.settings.mytitle="SL\nTogle\nMute";
                this.settings.customaction="";
                console.log("SL Toggle Mute",this.settings);
                break;
            case "Soundboard" :
                if (!this.settings.hasOwnProperty('soundboardaction')||this.settings.customaction==="") 
                {
                    this.settings.soundboardaction="Play/Pause";
                }
                this.settings.url="/_/"+this.settings.customaction;
                this.settings.icon="action/images/Custom_action.svg"
                this.settings.mytitle="Custom\nAction";
                break;    
        }
        
        // change color inside image SVG Data:
        $SD.api.setSettings(jsn.context, this.settings);
        var image=SetImageStyle(Icons[this.settings.icon], this.settings.iconstyle, this.settings.markercolor);
        $SD.api.setImage(jsn.context, image);
        $SD.api.setTitle(jsn.context, this.settings.mytitle);
    }
};