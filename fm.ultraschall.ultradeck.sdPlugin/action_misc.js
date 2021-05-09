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
        console.log("hier",this.settings.url);
        xhttp.open("GET", "http://"+globalSettings.ipadress+":"+globalSettings.port+this.settings.url , true);
        xhttp.send();  
    },

    onSendToPlugin: function(jsn) {
        if (jsn.payload.hasOwnProperty('sdpi_collection')) {
            if (jsn.payload.sdpi_collection.key==="resetcolor") {
                this.settings.markercolor=defaulticoncolor;
                if (ExtraDefaultColor[this.settings.icon]) {this.settings.markercolor=ExtraDefaultColor[this.settings.icon];}
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
                this.settings.mytitle="Ultram.";
                this.settings.customaction="";
                this.settings.soundboardaction="";
                this.settings.soundboardplayernumber="";
                break;
            case "Play Moonlander" :
                this.settings.url="/_/_Ultraschall_Moonlander";
                this.settings.icon="action/images/Game.svg"
                this.settings.mytitle="Moonl.";
                this.settings.customaction="";
                this.settings.soundboardaction="";
                this.settings.soundboardplayernumber="";
                break;
            case "Custom Action" :
                if (!this.settings.hasOwnProperty('customaction') || this.settings.customaction==="") {
                    this.settings.customaction="_Ultraschall_StartScreen";
                }
                this.settings.url="/_/"+this.settings.customaction;
                this.settings.icon="action/images/Custom_action.svg"
                this.settings.mytitle="custom";
                this.settings.soundboardaction="";
                this.settings.soundboardplayernumber="";
                break;
            case "SL Toggle Mute" :
                this.settings.url="ws://"+globalSettings.SLipadress+":"+globalSettings.SLport+"/ws_options";
                this.settings.icon="action/images/Custom_action.svg"
                this.settings.mytitle="SL un/mute";
                this.settings.customaction="";
                this.settings.soundboardaction="";
                this.settings.soundboardplayernumber="";
                console.log("SL Toggle Mute",this.settings);
                break;
            case "Soundboard" :
                this.settings.icon="action/images/Soundboard.svg";
                if (!this.settings.hasOwnProperty('soundboardaction') || this.settings.soundboardaction==="") 
                {
                    this.settings.soundboardaction="playstop";
                    this.settings.soundboardplayernumber="1";
                    this.settings.markercolor=ExtraDefaultColor[this.settings.icon];
                }
                this.settings.url="/_/"
                    + "SET/EXTSTATE/ultradeck/soundboardaction/"+encodeURIComponent(this.settings.soundboardaction)
                    + ";SET/EXTSTATE/ultradeck/soundboardplayernumber/"+encodeURIComponent(this.settings.soundboardplayernumber)
                    + ";_Ultraschall_StreamDeck";
                this.settings.mytitle=SoundboardTexts[this.settings.soundboardaction]+"\n"+this.settings.soundboardplayernumber;
                this.settings.customaction="";
                break;
            case "Split item at edit cursor" :
                this.settings.icon="action/images/Split_item.svg";
                this.settings.url="/_/40759";
                this.settings.mytitle="split";
                this.settings.customaction="";
                this.settings.soundboardaction="";
                this.settings.soundboardplayernumber="";
                break;
            case "Ripple cut" :
                this.settings.icon="action/images/Ripple_cut.svg";
                this.settings.url="/_/_Ultraschall_Ripple_Cut";
                this.settings.mytitle="rpl. cut";
                this.settings.customaction="";
                this.settings.soundboardaction="";
                this.settings.soundboardplayernumber="";
                break;    
        }

        // change color inside image SVG Data:
        $SD.api.setSettings(jsn.context, this.settings);
        var image=SetImageStyle(Icons[this.settings.icon], this.settings.iconstyle, this.settings.markercolor);
        $SD.api.setImage(jsn.context, image);
        $SD.api.setTitle(jsn.context, this.settings.mytitle);
    }
};
