const toggle = {
    settings:{},
    cache: {},

    onWillAppear: function (jsn) {
        console.log("Huhu i bims ein toggle",jsn);
        this.settings = jsn.payload.settings;

        // set default values
        if (!this.settings.hasOwnProperty('toggletype')) { this.settings.toggletype="Toggle mute track"; }
        if (!this.settings.hasOwnProperty('lasttoggletype')) { this.settings.lasttoggletype="Toggle mute track"; }
        if (!this.settings.hasOwnProperty('toggletypetext')) { this.settings.toggletypetext="Toggle"; }
        if (!this.settings.hasOwnProperty('title')) {this.settings.title="1";}
        if (!this.settings.hasOwnProperty('tracknumber')) { this.settings.tracknumber="1"; }
        if (!this.settings.hasOwnProperty('markercolor' )) {this.settings.markercolor =defaulticoncolor;}
        if (!this.settings.hasOwnProperty('markercolor2')) {this.settings.markercolor2=defaulticoncolor;}
        if (!this.settings.hasOwnProperty('markercolortext')) {this.settings.markercolortext="not muted";}
        if (!this.settings.hasOwnProperty('markercolortext2')) {this.settings.markercolortext2="muted";}
        if (!this.settings.hasOwnProperty('icon')) {this.settings.icon="action/images/muted.svg";}
        if (!this.settings.hasOwnProperty('iconstyle')) {this.settings.iconstyle="normal";}
        if (!this.settings.hasOwnProperty('url')) {this.settings.url="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/SET/TRACK/"+this.settings.tracknumber+"/MUTE/-1";}

        // set icon color
        
        var image=Icons[this.settings.icon];
        
        if (this.settings.iconstyle==="inverted") {
            image=image.replace(/#d8d8d8/g, 'KATZE2000');
            image=image.replace(/fill:none/g, 'fill:'+this.settings.markercolor);
            image=image.replace(/KATZE2000/g, '#2d2d2d');
        } else if (this.settings.iconstyle==="normal"){
            image=image.replace(/#d8d8d8/g, this.settings.markercolor);
        }

        $SD.api.setImage(jsn.context,image);
        $SD.api.setSettings(jsn.context, this.settings);
        $SD.api.setTitle(jsn.context, this.settings.title);

        // create Toggle object
        const ToggleButton=new ToggleButtonClass(jsn);
        ToggleButton.loop();

        // cache the current button
        this.cache[jsn.context] = ToggleButton;
    },

    onWillDisappear: function (jsn) {
        console.log("onWillDisappear");
        let found = this.cache[jsn.context];
        if (found) {
            // remove the button object from the cache
            found.destroy();
            delete this.cache[jsn.context];
        }
    },
    
    titleParametersDidChange: function(jsn){
        // force redraw of icon to show correct title
        console.log("titleParametersDidChange",jsn)
        $SD.api.setImage(jsn.context,Icons['action/images/empty@2x.png']);
        $SD.api.setImage(jsn.context,Icons[this.settings.icon]);
    },

    onKeyDown: function (jsn) {
        this.settings = jsn.payload.settings;
        console.log("KeyDown toggle ");
        
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", this.settings.url , true);
        xhttp.send();

        let found = this.cache[jsn.context];
        if (found) { found.refresh(this.settings);}
    },

    onDidReceiveSettings: function(jsn) {
        console.log('%c%s', 'color: white; background: red; font-size: 15px;', '[action_toggle.js]onDidReceiveSettings:', jsn);
        this.settings = jsn.payload.settings;
        
        if (this.settings.toggletype===this.settings.lasttoggletype) { // no toggletype change
            var togglechanged=false;
        } else {       
            var togglechanged=true;
            this.settings.lasttoggletype=this.settings.toggletype;
        }

        switch(this.settings.toggletype) {
            case "Toggle mute track" :
                if (togglechanged){
                    this.settings.tracknumber="1";
                    this.settings.markercolortext="not muted";
                    this.settings.markercolortext2="muted";
                    this.settings.markercolor =defaulticoncolor;
                    this.settings.markercolor2=defaulticoncolor;
                    this.settings.toggletypetext="Toggle";
                    this.settings.icon='action/images/muted.svg';
                }
                this.settings.title=this.settings.tracknumber;
                this.settings.url="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/SET/TRACK/"+this.settings.tracknumber+"/MUTE/-1";
                break;
            case "Toggle follow mode" :
                this.settings.title="Follow\nmode\nToggle\n ";
                console.log("FOLLOW!!!!!!!!!!",this.settings.title);
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = ExtraDefaultColor['Toggle follow mode'];
                    this.settings.markercolor2 = defaulticoncolor;
                    this.settings.toggletypetext="Toggle";
                    this.settings.icon='action/images/Follow_mode.svg';
                }
                this.settings.tracknumber="";
                this.settings.url="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/_Ultraschall_Toggle_Follow";
                break;
            case "Toggle Magic Routing" :
                this.settings.title="Magic\nRouting\nToggle\n ";
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = ExtraDefaultColor['Toggle Magic Routing'];
                    this.settings.markercolor2 = defaulticoncolor;
                    this.settings.toggletypetext="Toggle";
                    this.settings.icon='action/images/MagicRouting.svg';
                }
                this.settings.tracknumber="";
                this.settings.url="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/_Ultraschall_Toggle_Magicrouting";
                break;
            case "Set preshow routing" :
                this.settings.title="Set\npreshow\nrouting\n ";
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = ExtraDefaultColor['Set preshow routing'];
                    this.settings.markercolor2 = defaulticoncolor;
                    this.settings.toggletypetext="Set";
                    this.settings.icon='action/images/Preshow.svg';
                }
                this.settings.tracknumber="";
                this.settings.url="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/_Ultraschall_set_Matrix_Preshow";
                break;
            case "Set recording routing" :
                this.settings.title="Set\nrecording\nrouting\n ";
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = ExtraDefaultColor['Set recording routing'];
                    this.settings.markercolor2 = defaulticoncolor;
                    this.settings.toggletypetext="Set";
                    this.settings.icon='action/images/Recording.svg';
                }
                this.settings.tracknumber="";
                this.settings.url="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/_Ultraschall_set_Matrix_Recording";
                break;
            case "Set editing routing" :
                this.settings.title="Set\nrecording\nrouting\n ";
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = ExtraDefaultColor['Set editing routing'];
                    this.settings.markercolor2 = defaulticoncolor;
                    this.settings.toggletypetext="Set";
                    this.settings.icon='action/images/Editing.svg';
                }
                this.settings.tracknumber="";
                this.settings.url="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/_Ultraschall_set_Matrix_Editing";
                break;
                case "Toggle Studiolink OnAir" :
                    this.settings.title="Toggle\nStudiolink\nOnAir\n ";
                    if (togglechanged){
                        this.settings.markercolortext="On";
                        this.settings.markercolortext2="Off";
                        this.settings.markercolor  = ExtraDefaultColor['Toggle Studiolink OnAir'];
                        this.settings.markercolor2 = defaulticoncolor;
                        this.settings.toggletypetext="Set";
                        this.settings.icon='action/images/OnAir.svg';
                    }
                    this.settings.tracknumber="";
                    this.settings.url="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/_Ultraschall_OnAir";
                    break;
        }
        
        $SD.api.setSettings(jsn.context, this.settings);
        $SD.api.setTitle(jsn.context, this.settings.title);
        let found = this.cache[jsn.context];
        if (found) { found.refresh(this.settings); }
        this.titleParametersDidChange(jsn);
    },

    onSendToPlugin: function(jsn) {
        // TODO standard farben fuer toggles ablegen fuer reset
        if (jsn.payload.hasOwnProperty('sdpi_collection')) {
            if (jsn.payload.sdpi_collection.key==="resetcolor") {
                var color1 = ExtraDefaultColor[this.settings.toggletype];
                if (color1==undefined) {color1 = defaulticoncolor;}
                this.settings.markercolor=color1;
            }
            if (jsn.payload.sdpi_collection.key==="resetcolor2") {
                var color2 = ExtraDefaultColor[this.settings.toggletype+"2"];
                if (color1==undefined) {color2 = defaulticoncolor;}
                this.settings.markercolor2=color2;
            }
            $SD.api.setSettings(jsn.context, this.settings);
            let found = this.cache[jsn.context];
            if (found) { found.refresh(this.settings); }
        }
    }
};

function ToggleButtonClass(jsonObj) {
    var toggletype = jsonObj.payload.settings.toggletype;
    var context = jsonObj.context;
    var track = jsonObj.payload.settings.tracknumber;
    var counter = 0;
    var count = 0;
    var settings=jsonObj.payload.settings;

    function checkstates(){
        if (globalSettings.hasOwnProperty('ipadress') && globalSettings.hasOwnProperty('port')) {
            if (toggletype==="Toggle mute track") {getMuteState();}
            if (toggletype==="Toggle follow mode") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_Toggle_Follow",Icons['action/images/Follow_mode.svg'],Icons['action/images/Follow_mode.svg']);}
            if (toggletype==="Toggle Magic Routing") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_Toggle_Magicrouting",Icons['action/images/MagicRouting.svg'],Icons['action/images/MagicRouting.svg']);}
            if (toggletype==="Set preshow routing") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_set_Matrix_Preshow",Icons['action/images/Preshow.svg'],Icons['action/images/Preshow.svg']);}
            if (toggletype==="Set recording routing") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_set_Matrix_Recording",Icons['action/images/Recording.svg'],Icons['action/images/Recording.svg']);}
            if (toggletype==="Set editing routing") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_set_Matrix_Editing",Icons['action/images/Editing.svg'],Icons['action/images/Editing.svg']);}
            if (toggletype==="Toggle Studiolink OnAir") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_OnAir",Icons['action/images/OnAir.svg'],Icons['action/images/OnAir.svg']);}
        }
    }

    function loop(){
        if (counter === 0) {
            checkstates();
            counter = setInterval(checkstates, 50);
            }
            else {
                window.clearInterval(counter);
                counter = 0;
            }
    }

    function refresh(jsn_refresh){
        playstate_last="";
        settings=jsn_refresh;
        track=settings.tracknumber;
        toggletype = settings.toggletype;
        destroy();
        loop();
    }

    function destroy() {
        if (counter !== 0) {
            window.clearInterval(counter);
            counter = 0;
        }
    }

    function getMuteState(){
        //console.log("getMuteState");
        var xhttp = new XMLHttpRequest();
        var url="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/TRACK/"+track+"/B_MUTE";
        xhttp.open("GET", url , true);

        xhttp.onload = function () {
            if (xhttp.readyState === xhttp.DONE) {
                if (xhttp.status === 200) {
                    let resultText=xhttp.responseText;
                    let resultArray = resultText.split('\t');
                    let resultState = resultArray[1];
                    resultState=resultState.replace(/(\r\n|\n|\r)/gm, "");

                    if (resultState==="0") {
                        var image=Icons['action/images/unmuted.svg'];
                        var markercolor=settings.markercolor;
                    }
                    else {
                        var image=Icons['action/images/muted.svg'];
                        var markercolor=settings.markercolor2;
                    };

                    if (settings.iconstyle==="inverted") {
                        image=image.replace(/#d8d8d8/g, 'KATZE2000');
                        image=image.replace(/fill:none/g, 'fill:'+markercolor);
                        image=image.replace(/KATZE2000/g, '#2d2d2d');
                    } else if (settings.iconstyle==="normal"){
                        image=image.replace(/#d8d8d8/g, markercolor);
                    }
                    $SD.api.setImage(context,image);
                    $SD.api.setSettings(context, settings);
                }
            }
        };
        xhttp.send();
    }

    function getActionState(url,icon1,icon2){
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", url , true);

        xhttp.onload = function () {
            if (xhttp.readyState === xhttp.DONE) {
                if (xhttp.status === 200) {
                    let resultText=xhttp.responseText;
                    let resultArray = resultText.split('\t');
                    let resultState = resultArray[2];
                    resultState=resultState.replace(/(\r\n|\n|\r)/gm, "");
                    
                    if (resultState==="1") {
                        var image=icon1;
                        var markercolor=settings.markercolor;
                    }
                    else {
                        var image=icon2;
                        var markercolor=settings.markercolor2;
                    };

                    if (settings.iconstyle==="inverted") {
                        image=image.replace(/#d8d8d8/g, 'KATZE2000');
                        image=image.replace(/fill:none/g, 'fill:'+markercolor);
                        image=image.replace(/KATZE2000/g, '#2d2d2d');
                    } else if (settings.iconstyle==="normal"){
                        image=image.replace(/#d8d8d8/g, markercolor);
                    }
                    $SD.api.setImage(context,image);
                    $SD.api.setSettings(context, settings);
                }
            }
        };
        xhttp.send();
    }

    return {
        loop : loop,
        destroy : destroy,
        refresh : refresh
    };
}