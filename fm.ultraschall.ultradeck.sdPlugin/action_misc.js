const misc = {
    settings:{},
    
    onWillAppear: function (jsn) {
        console.log("huhu i bims eine Misc Action",jsn);
        this.settings = jsn.payload.settings;
        
        if (!this.settings.hasOwnProperty('misctype')) {this.settings.misctype="Play Ultramind";}
        if (!this.settings.hasOwnProperty('url')) {this.settings.url="http://127.0.0.1:8080/_/_Ultraschall_Mastermind";}
        if (!this.settings.hasOwnProperty('icon')) {this.settings.icon="action/images/Game.svg";}
        if (!this.settings.hasOwnProperty('mytitle')) {this.settings.mytitle="Play\nUltra-\nmind";}
        if (!this.settings.hasOwnProperty('markercolor')) {this.settings.markercolor=defaulticoncolor;}
        
        // set icon color
        var image=Icons[this.settings.icon];
        image=image.replace('#d8d8d8', this.settings.markercolor);

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
                image=image.replace('#d8d8d8', this.settings.markercolor);
                $SD.api.setImage(jsn.context,image);
            }
        }
    },

    onDidReceiveSettings: function(jsn) {
        console.log('%c%s', 'color: white; background: red; font-size: 15px;', 'Action Misc.js onDidReceiveSettings:', jsn);
        this.settings = jsn.payload.settings;

        // set url for each action
        var misctype=this.settings.misctype;

        var icon="";
        
        switch(misctype) {
            case "Play Ultramind" :
                var url="http://127.0.0.1:8080/_/_Ultraschall_Mastermind";
                icon="action/images/Game.svg"
                title="Play\nUltra-\nmind";
                break;
            case "Play Moonlander" :
                var url="http://127.0.0.1:8080/_/_Ultraschall_Moonlander";
                icon="action/images/Game.svg"
                title="Play\nMoon-\nlander";
                break;
        }
        this.settings.url=url;
        this.settings.icon=icon;
        this.settings.mytitle=title;
        
        // change color inside image SVG Data:
        
        $SD.api.setSettings(jsn.context, this.settings); //save settings
        var image=Icons[icon];
        image=image.replace('#d8d8d8', this.settings.markercolor);
        $SD.api.setImage(jsn.context,image);
        $SD.api.setTitle(jsn.context, title);
        
        // set initial state
        this.onKeyUp(jsn);
    }
};