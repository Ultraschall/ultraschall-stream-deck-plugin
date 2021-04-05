const toggle = {
    settings:{},
    cache: {},

    onWillAppear: function (jsn) {
        //console.log("Huhu i bims ein toggle",jsn);
        this.settings = jsn.payload.settings;
        SLwebsocketerror=false;
        // set default values
        if (!this.settings.hasOwnProperty('toggletype')) { this.settings.toggletype="Toggle mute track"; }
        if (!this.settings.hasOwnProperty('lasttoggletype')) { this.settings.lasttoggletype="Toggle mute track"; }
        if (!this.settings.hasOwnProperty('toggletypetext')) { this.settings.toggletypetext="Toggle"; }
        if (!this.settings.hasOwnProperty('title')) {this.settings.title="1";}
        if (!this.settings.hasOwnProperty('tracknumber')) { this.settings.tracknumber="1"; }
        if (!this.settings.hasOwnProperty('markercolor' )) {this.settings.markercolor =defaulticoncolorOFF;}
        if (!this.settings.hasOwnProperty('markercolor2')) {this.settings.markercolor2=defaulticoncolorON;}
        if (!this.settings.hasOwnProperty('resetcolor' )) {this.settings.resetcolor =defaulticoncolorOFF;}
        if (!this.settings.hasOwnProperty('resetcolor2')) {this.settings.resetcolor2=defaulticoncolorON;}
        if (!this.settings.hasOwnProperty('markercolortext')) {this.settings.markercolortext="not muted";}
        if (!this.settings.hasOwnProperty('markercolortext2')) {this.settings.markercolortext2="muted";}
        if (!this.settings.hasOwnProperty('icon')) {this.settings.icon="action/images/muted.svg";}
        if (!this.settings.hasOwnProperty('iconstyle')) {this.settings.iconstyle="normal";}
        if (!this.settings.hasOwnProperty('url'))
        {
            this.settings.url="/_/SET/TRACK/"+this.settings.tracknumber+"/MUTE/-1";
        }

        var image=SetImageStyle(Icons[this.settings.icon], this.settings.iconstyle, this.settings.markercolor);
        $SD.api.setImage(jsn.context,image);
        $SD.api.setSettings(jsn.context, this.settings);
        $SD.api.setTitle(jsn.context, this.settings.title);

        // create Toggle object
        const ToggleButton=new ToggleButtonClass(jsn);
        ToggleButton.loop(jsn);

        // cache the current button
        this.cache[jsn.context] = ToggleButton;

        // refresh
        this.onDidReceiveSettings(jsn);
    },

    onWillDisappear: function (jsn) {
        let found = this.cache[jsn.context];
        if (found) {
            // remove the button object from the cache
            found.destroy();
            delete this.cache[jsn.context];
        }
    },
    
    onKeyDown: function (jsn) {
        var context=jsn.context;
        var settings = jsn.payload.settings;
        
        if (settings.toggletype=="Toggle Studiolink Standalone Mute") {
            if (SLwebsocketerror==false) {
                //console.log("key down + SL connection");
                ws=new WebSocket("ws://"+globalSettings.SLipadress+":"+globalSettings.SLport+"/ws_options");
                ws.onopen=function()
                {
                    if (settings.state==true && ws.readyState===1) {var sendcmd='{"key": "mute", "value": "false"}';}
                    if (settings.state==false && ws.readyState===1) {var sendcmd='{"key": "mute", "value": "true"}';}
                    ws.send(sendcmd);
                    ws.close();
                }
                
                ws.onerror=function()
                {
                    //console.log("SL ws error!!!!!");
                    var image=SetImageStyle(Icons[settings.icon], settings.iconstyle, settings.markercolor);
                    // add RedX:
                    image=image.replace(/\<\/svg\>/g, `${redX}</svg>`);
                    $SD.api.setImage(context, image);
                    $SD.api.setTitle(context, settings.title);
                    ws.close();
                };
                
                ws.onclose= function()
                {
                    console.log("on key down closed")
                }
            }
        } else {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", "http://"+globalSettings.ipadress+":"+globalSettings.port+settings.url , true);
            xhttp.send();

            let found = this.cache[jsn.context];
            if (found) { found.refresh(settings);}
        }
    },

    onDidReceiveSettings: function(jsn) {
        //console.log('%c%s', 'color: white; background: red; font-size: 15px;', '[action_toggle.js]onDidReceiveSettings:', jsn);
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
                    this.settings.markercolor =defaulticoncolorOFF;
                    this.settings.markercolor2=defaulticoncolorON;
                    this.settings.resetcolor =this.settings.markercolor;
                    this.settings.resetcolor2=this.settings.markercolor2;
                    this.settings.toggletypetext="Toggle";
                    this.settings.icon='action/images/muted.svg';
                    this.settings.iconstyle='normal';
                }
                this.settings.title=this.settings.tracknumber;
                this.settings.url="/_/SET/TRACK/"+this.settings.tracknumber+"/MUTE/-1";

                
                break;
            case "Toggle follow mode" :
                this.settings.title="follow";
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = defaulticoncolorON;
                    this.settings.markercolor2 = defaulticoncolorOFF;
                    this.settings.resetcolor =this.settings.markercolor;
                    this.settings.resetcolor2=this.settings.markercolor2;
                    this.settings.toggletypetext="Toggle";
                    this.settings.icon='action/images/Follow_mode.svg';
                    this.settings.iconstyle='normal';
                }
                this.settings.tracknumber="";
                this.settings.url="/_/_Ultraschall_Toggle_Follow";
                break;
            case "Toggle Magic Routing" :
                this.settings.title="magic r.";
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = defaulticoncolorON;
                    this.settings.markercolor2 = defaulticoncolorOFF;
                    this.settings.resetcolor =this.settings.markercolor;
                    this.settings.resetcolor2=this.settings.markercolor2;
                    this.settings.toggletypetext="Toggle";
                    this.settings.icon='action/images/MagicRouting.svg';
                    this.settings.iconstyle='normal';
                }
                this.settings.tracknumber="";
                this.settings.url="/_/_Ultraschall_Toggle_Magicrouting";
                break;
            case "Set preshow routing" :
                this.settings.title="preshow";
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = defaulticoncolorON;
                    this.settings.markercolor2 = defaulticoncolorOFF;
                    this.settings.resetcolor =this.settings.markercolor;
                    this.settings.resetcolor2=this.settings.markercolor2;
                    this.settings.toggletypetext="Set";
                    this.settings.icon='action/images/Preshow.svg';
                    this.settings.iconstyle='normal';
                }
                this.settings.tracknumber="";
                this.settings.url="/_/_Ultraschall_set_Matrix_Preshow";
                break;
            case "Set recording routing" :
                this.settings.title="recording";
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = defaulticoncolorON;
                    this.settings.markercolor2 = defaulticoncolorOFF;
                    this.settings.resetcolor =this.settings.markercolor;
                    this.settings.resetcolor2=this.settings.markercolor2;
                    this.settings.toggletypetext="Set";
                    this.settings.icon='action/images/Recording.svg';
                    this.settings.iconstyle='normal';
                }
                this.settings.tracknumber="";
                this.settings.url="/_/_Ultraschall_set_Matrix_Recording";
                break;
            case "Set editing routing" :
                this.settings.title="editing";
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = defaulticoncolorON;
                    this.settings.markercolor2 = defaulticoncolorOFF;
                    this.settings.resetcolor =this.settings.markercolor;
                    this.settings.resetcolor2=this.settings.markercolor2;
                    this.settings.toggletypetext="Set";
                    this.settings.icon='action/images/Editing.svg';
                    this.settings.iconstyle='normal';
                }
                this.settings.tracknumber="";
                this.settings.url="/_/_Ultraschall_set_Matrix_Editing";
                break;
            case "Toggle Studiolink OnAir" :
                this.settings.title="OnAir";
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = defaulticoncolorON;
                    this.settings.markercolor2 = defaulticoncolorOFF;
                    this.settings.resetcolor =this.settings.markercolor;
                    this.settings.resetcolor2=this.settings.markercolor2;
                    this.settings.toggletypetext="Set";
                    this.settings.icon='action/images/OnAir.svg';
                    this.settings.iconstyle='normal';
                }
                this.settings.tracknumber="";
                this.settings.url="/_/_Ultraschall_OnAir";
                break;
            case "Toggle Studiolink Standalone Mute" :
                this.settings.title="SL mute";
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = defaulticoncolorON;
                    this.settings.markercolor2 = defaulticoncolorOFF;
                    this.settings.resetcolor =this.settings.markercolor;
                    this.settings.resetcolor2=this.settings.markercolor2;
                    this.settings.toggletypetext="Toggle";
                    this.settings.icon='action/images/muted.svg';
                    this.settings.iconstyle='normal';
                }
                this.settings.tracknumber="";
                this.settings.url="ws://"+globalSettings.SLipadress+":"+globalSettings.SLport+"/ws_options";
                break;
            case "Set record view" :
                this.settings.title="record";
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = defaulticoncolorON;
                    this.settings.markercolor2 = defaulticoncolorOFF;
                    this.settings.resetcolor =this.settings.markercolor;
                    this.settings.resetcolor2=this.settings.markercolor2;
                    this.settings.toggletypetext="Set";
                    this.settings.icon='action/images/RecordView.svg';
                    this.settings.iconstyle='normal';
                }
                this.settings.tracknumber="";
                this.settings.url="/_/_Ultraschall_Set_View_Record";
                break;
            case "Set edit view" :
                this.settings.title="edit";
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = defaulticoncolorON;
                    this.settings.markercolor2 = defaulticoncolorOFF;
                    this.settings.resetcolor =this.settings.markercolor;
                    this.settings.resetcolor2=this.settings.markercolor2;
                    this.settings.toggletypetext="Set";
                    this.settings.icon='action/images/Editing.svg';
                    this.settings.iconstyle='normal';
                }
                this.settings.tracknumber="";
                this.settings.url="/_/_Ultraschall_Set_View_Edit";
                break;
            case "Set storyboard view" :
                this.settings.title="storyb.";
                if (togglechanged){
                    this.settings.markercolortext="On";
                    this.settings.markercolortext2="Off";
                    this.settings.markercolor  = defaulticoncolorON;
                    this.settings.markercolor2 = defaulticoncolorOFF;
                    this.settings.resetcolor =this.settings.markercolor;
                    this.settings.resetcolor2=this.settings.markercolor2;
                    this.settings.toggletypetext="Set";
                    this.settings.icon='action/images/StoryboardView.svg';
                    this.settings.iconstyle='normal';
                }
                this.settings.tracknumber="";
                this.settings.url="/_/_Ultraschall_Set_View_Story";
                break;
        }
        
        $SD.api.setSettings(jsn.context, this.settings);
        $SD.api.setTitle(jsn.context, this.settings.title);
        let found = this.cache[jsn.context];
        if (found) { found.refresh(this.settings); }

        //$SD.api.setImage(jsn.context,Icons['action/images/empty@2x.png']);
        var image=SetImageStyle(Icons[this.settings.icon], this.settings.iconstyle, this.settings.markercolor);
        $SD.api.setImage(jsn.context,image);
    },

    onSendToPlugin: function(jsn) {
        if (jsn.payload.hasOwnProperty('sdpi_collection')) {
            if (jsn.payload.sdpi_collection.key==="resetcolor") {
                var color1 = ExtraDefaultColor[this.settings.toggletype];
                if (color1==undefined) {color1 = this.settings.resetcolor;}
                this.settings.markercolor=color1;
            }
            if (jsn.payload.sdpi_collection.key==="resetcolor2") {
                var color2 = ExtraDefaultColor[this.settings.toggletype+"2"];
                if (color2==undefined) {color2 = this.settings.resetcolor2;}
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
    var jsn=jsonObj;
    var counter = 0;
    var count = 0;
    var settings=jsonObj.payload.settings;
    var ws3="";

    function checkstates(){
        if (globalSettings.hasOwnProperty('ipadress') && globalSettings.hasOwnProperty('port')) {
            if (toggletype==="Toggle mute track") {getMuteState();}
            if (toggletype==="Toggle follow mode") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_Toggle_Follow",Icons['action/images/Follow_mode.svg'],Icons['action/images/Follow_mode.svg']);}
            if (toggletype==="Toggle Magic Routing") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_Toggle_Magicrouting",Icons['action/images/MagicRouting.svg'],Icons['action/images/MagicRouting.svg']);}
            if (toggletype==="Set preshow routing") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_set_Matrix_Preshow",Icons['action/images/Preshow.svg'],Icons['action/images/Preshow.svg']);}
            if (toggletype==="Set recording routing") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_set_Matrix_Recording",Icons['action/images/Recording.svg'],Icons['action/images/Recording.svg']);}
            if (toggletype==="Set editing routing") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_set_Matrix_Editing",Icons['action/images/Editing.svg'],Icons['action/images/Editing.svg']);}
            if (toggletype==="Toggle Studiolink OnAir") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_OnAir",Icons['action/images/OnAir.svg'],Icons['action/images/OnAir.svg']);}
            if (toggletype==="Toggle Studiolink Standalone Mute") {getMuteStateSL();}
            if (toggletype==="Set record view") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_Set_View_Record",Icons['action/images/RecordView.svg'],Icons['action/images/RecordView.svg']);}
            if (toggletype==="Set edit view") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_Set_View_Edit",Icons['action/images/Editing.svg'],Icons['action/images/Editing.svg']);}
            if (toggletype==="Set storyboard view") {getActionState("http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/_Ultraschall_Set_View_Story",Icons['action/images/StoryboardView.svg'],Icons['action/images/StoryboardView.svg']);}
        }
    }

    function loop()
    {
        var timeinterval=50;
        if (toggletype==="Toggle Studiolink Standalone Mute") {timeinterval=1000;}
            if (counter === 0)
            {
                checkstates();
                counter = setInterval(checkstates, timeinterval);
            } else
            {
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
        if (!ws3=="") {
            ws3.close();
            ws3="";
        }
    }

    function getMuteStateSL()
    {
        console.log("readystate usw. ",ws3);
        if (ws3=="") {
            createsocketandgetstate();
        }

        if (ws3.readyState==3) {
            console.log("ws is ws state 3");
            ws3="";
        }

        $SD.on('didReceiveGlobalSettings', (jsn) =>
        {
            ws3.close();
            createsocketandgetstate()
        });
        
        function createsocketandgetstate()
        {
            if (globalSettings.hasOwnProperty('SLipadress') && globalSettings.hasOwnProperty('SLport') )
            {
                //console.log("create new websocket");
                ws3=new WebSocket("ws://"+globalSettings.SLipadress+":"+globalSettings.SLport+"/ws_options");
                   
                ws3.addEventListener('message', function (event) { 
                    result=event.data;
                    SLwebsocketerror=false;
                    //console.log("SL Data: ", result);

                    if (result.search('"mute":"false"') >-1 )
                    {
                        var image=Icons['action/images/unmuted.svg'];
                        var markercolor=settings.markercolor;
                        settings.state=false;
                    } else if (result.search('"mute":"true"')>-1)
                    {
                        var image=Icons['action/images/muted.svg'];
                        var markercolor=settings.markercolor2;
                        settings.state=true;
                    } else
                    {
                        console.log("nix gefunden");
                        var image=Icons['action/images/unmuted.svg'];
                        var markercolor=settings.markercolor;
                        settings.state=false;
                    }
                    image=SetImageStyle(image, settings.iconstyle, markercolor);
                    $SD.api.setImage(context,image);
                    $SD.api.setSettings(context, settings);
                });

                ws3.onerror=function()
                {
                    console.log("SL erroro3!!!!!");
                    SLwebsocketerror=true;
                    var image=SetImageStyle(Icons[settings.icon], settings.iconstyle, settings.markercolor);
                    // add RedX:
                    image=image.replace(/\<\/svg\>/g, `${redX}</svg>`);
                    $SD.api.setImage(context, image);
                    $SD.api.setTitle(context, settings.title);
                };

                ws3.onclose=function(){console.log("ws onclose");}
            }
        };
    }

    function getMuteState() {
        var xhttp = new XMLHttpRequest();
        var url="http://"+globalSettings.ipadress+":"+globalSettings.port+"/_/GET/TRACK/"+track+"/B_MUTE";
        //console.log("hhmmmm ",url);
    
        xhttp.open("GET", url , true);

        xhttp.onload = function () {
            if (xhttp.readyState === xhttp.DONE) {
                if (xhttp.status === 200) {
                    let resultText=xhttp.responseText;
                    //console.log("hhmmmm 2",resultText);
                    oldsettings=settings;
                    if (!resultText=="") 
                    {
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
                        var image=SetImageStyle(image, settings.iconstyle, markercolor);
                        $SD.api.setImage(context,image);
                    }
                    else 
                    {
                        var image=Icons['action/images/muted.svg'];
                        var image=SetImageStyle(image, settings.iconstyle, markercolor);
                        // add RedX:
                        image=image.replace(/\<\/svg\>/g, `${redX}</svg>`);
                        $SD.api.setImage(context,image);
                    }
                }
            }
        };

        xhttp.onerror=function()
        {
            var image=SetImageStyle(Icons[settings.icon], settings.iconstyle, settings.markercolor);
            // add RedX:
            image=image.replace(/\<\/svg\>/g, `${redX}</svg>`);
            $SD.api.setImage(jsn.context,image);
            $SD.api.setTitle(jsn.context, settings.title);
        };

        xhttp.send();
        //xhttp.abort();
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
                    var image=SetImageStyle(image, settings.iconstyle, markercolor);
                    $SD.api.setImage(context,image);
                    $SD.api.setSettings(context, settings);
                }
            }
        };
        xhttp.onerror=function()
        {
            var image=SetImageStyle(Icons[settings.icon], settings.iconstyle, settings.markercolor);
            // add RedX:
            image=image.replace(/\<\/svg\>/g, `${redX}</svg>`);
            $SD.api.setImage(jsn.context,image);
            $SD.api.setTitle(jsn.context, settings.title);
        };
        xhttp.send();
    }

    return {
        loop : loop,
        destroy : destroy,
        refresh : refresh
    };
}