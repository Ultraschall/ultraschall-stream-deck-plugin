const misc = {
    settings:{},
    
    onWillAppear: function (jsn) {
        console.log("huhu i bims eine Misc Action",jsn);
        this.settings = jsn.payload.settings;
        
        if (!this.settings.hasOwnProperty('misctype')) {this.settings.misctype="Custom Action";}
        if (!this.settings.hasOwnProperty('customaction')) {this.settings.customaction="_Ultraschall_StartScreen";}
        if (!this.settings.hasOwnProperty('url')) {this.settings.url="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/"+this.settings.customaction;}
        if (!this.settings.hasOwnProperty('icon')) {this.settings.icon="action/images/Custom_action.svg";}
        if (!this.settings.hasOwnProperty('iconstyle')) {this.settings.iconstyle="normal";}
        if (!this.settings.hasOwnProperty('mytitle')) {this.settings.mytitle="Custom\nAction";}
        if (!this.settings.hasOwnProperty('markercolor')) {this.settings.markercolor=defaulticoncolor;}

        // set icon color
        var image=Icons[this.settings.icon];
        if (this.settings.iconstyle==="inverted") {
            image=image.replace(/#d8d8d8/g, 'KATZE2000');
            image=image.replace(/fill:none/g, 'fill:'+this.settings.markercolor);
            image=image.replace(/KATZE2000/g, '#2d2d2d');
        } else if (this.settings.iconstyle==="normal"){
            image=image.replace(/#d8d8d8/g, this.settings.markercolor);
        }

        $SD.api.setSettings(jsn.context, this.settings); 
        $SD.api.setImage(jsn.context,image);
        $SD.api.setTitle(jsn.context, this.settings.mytitle);
    },

    onKeyDown: function (jsn) {
        this.settings = jsn.payload.settings;
        console.log("KeyDown Misc ", jsn);
        
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", this.settings.url , true);
        xhttp.send();
    },

    onSendToPlugin: function(jsn) {
        if (jsn.payload.hasOwnProperty('sdpi_collection')) {
            if (jsn.payload.sdpi_collection.key==="resetcolor") {
                this.settings.markercolor=defaulticoncolor;
                $SD.api.setSettings(jsn.context, this.settings);
                var image=Icons[this.settings.icon];
                if (this.settings.iconstyle==="inverted") {
                    image=image.replace(/#d8d8d8/g, 'KATZE2000');
                    image=image.replace(/fill:none/g, 'fill:'+this.settings.markercolor);
                    image=image.replace(/KATZE2000/g, '#2d2d2d');
                } else if (this.settings.iconstyle==="normal"){
                    image=image.replace(/#d8d8d8/g, this.settings.markercolor);
                }
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
                this.settings.url="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/_Ultraschall_Mastermind";
                this.settings.icon="action/images/Game.svg"
                this.settings.mytitle="Play\nUltra-\nmind";
                this.settings.customaction="";
                break;
            case "Play Moonlander" :
                this.settings.url="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/_Ultraschall_Moonlander";
                this.settings.icon="action/images/Game.svg"
                this.settings.mytitle="Play\nMoon-\nlander";
                this.settings.customaction="";
                break;
            case "Custom Action" :
                if (!this.settings.hasOwnProperty('customaction')||this.settings.customaction==="") {this.settings.customaction="_Ultraschall_StartScreen";}
                this.settings.url="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/"+this.settings.customaction;
                this.settings.icon="action/images/Custom_action.svg"
                this.settings.mytitle="Custom\nAction";
                console.log("custom action 2000 ",this.settings);
                break;
        }
        
        // change color inside image SVG Data:
        $SD.api.setSettings(jsn.context, this.settings); //save settings
        var image=Icons[this.settings.icon];
        if (this.settings.iconstyle==="inverted") {
            image=image.replace(/#d8d8d8/g, 'KATZE2000');
            image=image.replace(/fill:none/g, 'fill:'+this.settings.markercolor);
            image=image.replace(/KATZE2000/g, '#2d2d2d');
        } else if (this.settings.iconstyle==="normal"){
            image=image.replace(/#d8d8d8/g, this.settings.markercolor);
        }
        $SD.api.setImage(jsn.context, image);
        $SD.api.setTitle(jsn.context, this.settings.mytitle);
    }
};