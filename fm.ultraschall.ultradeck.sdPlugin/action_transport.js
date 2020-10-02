const transport = {
    settings:{},
    cache: {},

    onWillAppear: function (jsn) {
        console.log("Huhu i bims ein transport",jsn);
        this.settings = jsn.payload.settings;
        
        if (!this.settings.hasOwnProperty('transporttype')) {this.settings.transporttype="Play";}
        if (!this.settings.hasOwnProperty('url_DOWN')) {this.settings.url_DOWN="http://127.0.0.1:8080/_/1007";}
        if (!this.settings.hasOwnProperty('mytitle')) {this.settings.mytitle="Play";}
        if (!this.settings.hasOwnProperty('icon')) {this.settings.icon="action/images/play@2x.png";}
        if (!this.settings.hasOwnProperty('icon_playstate')) {
            this.settings.icon_playstate={  "0":"action/images/Play@2x.png",
                                            "1":"action/images/Play2@2x.png",
                                            "2":"action/images/Play2@2x.png",
                                            "5":"action/images/Play@2x.png",
                                            "6":"action/images/Play@2x.png",
                                         };
        }

        $SD.api.setSettings(jsn.context, this.settings);
        $SD.api.setImage(jsn.context,Icons[this.settings.icon_playstate[0]]);
        $SD.api.setTitle(jsn.context, this.settings.mytitle);

        // create button and start background loop function
        const TransportButton=new TransportButtonClass(jsn);
        TransportButton.loop();

        // cache the current button
        this.cache[jsn.context] = TransportButton;
    },

    onWillDisappear: function (jsn) {
        console.log("onWillDisappear", jsn);
        let found = this.cache[jsn.context];
        if (found) {
            // remove the button from the cache
            found.destroy();
            delete this.cache[jsn.context];
        }
    },

    onKeyDown: function (jsn) {
        this.settings = jsn.payload.settings;
        console.log("KeyDown Transport ", jsn);
        
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", this.settings.url_DOWN , true);
        xhttp.send();
    },

    onDidReceiveSettings: function(jsn) {
        //console.log('%c%s', 'color: white; background: red; font-size: 15px;', '[action_transport.js]onDidReceiveSettings:', jsn);
        this.settings = jsn.payload.settings;
        $SD.api.setSettings(jsn.context, this.settings);
        var url_DOWN="http://127.0.0.1:8080/_/";
        var icon="";
        var transporttype=this.settings.transporttype;
        var title="";
        
        console.log("TRANSPORTTYPE",transporttype);
        this.settings.icon_playstate=[];
        switch(transporttype) {
            case "Play" :
                url_DOWN=url_DOWN+"1007";
                this.settings.icon_playstate=  {"0":"action/images/Play@2x.png", "1":"action/images/Play2@2x.png", "2":"action/images/Play2@2x.png", "5":"action/images/Play@2x.png", "6":"action/images/Play@2x.png" };
                title="Play";
                break;
            case "Pause" :
                url_DOWN=url_DOWN+"1008";
                this.settings.icon_playstate=  {"0":"action/images/Pause@2x.png", "1":"action/images/Pause@2x.png", "2":"action/images/Pause2@2x.png", "5":"action/images/Pause@2x.png", "6":"action/images/Pause@2x.png" };
                title="Pause";
                break;
            case "Stop" :
                url_DOWN=url_DOWN+"1016";
                this.settings.icon_playstate=  {"0":"action/images/Stop@2x.png", "1":"action/images/Stop@2x.png", "2":"action/images/Stop@2x.png", "5":"action/images/Stop@2x.png", "6":"action/images/Stop@2x.png" };
                title="Stop";
                break;
            case "Go to start of project" :
                url_DOWN=url_DOWN+"_Ultraschall_Go_To_Start_Of_Project";
                this.settings.icon_playstate=  {"0":"action/images/Go_to_start_of_project@2x.png", "1":"action/images/Go_to_start_of_project@2x.png", "2":"action/images/Go_to_start_of_project@2x.png", "5":"action/images/Go_to_start_of_project@2x.png", "6":"action/images/Go_to_start_of_project@2x.png" };
                title="Go to start\nof project";
                break;
            case "Go to end of project" :
                url_DOWN=url_DOWN+"_Ultraschall_Go_To_End_Of_Project";
                this.settings.icon_playstate=  {"0":"action/images/Go_to_end_of_project@2x.png", "1":"action/images/Go_to_end_of_project@2x.png", "2":"action/images/Go_to_end_of_project@2x.png", "5":"action/images/Go_to_end_of_project@2x.png", "6":"action/images/Go_to_end_of_project@2x.png" };
                title="Go to end\nof project";
                break;
            case "Record" :
                url_DOWN=url_DOWN+"1013";
                this.settings.icon_playstate=  {"0":"action/images/Record.svg", "1":"action/images/Record.svg", 
                "2":"action/images/Record.svg", "5":"action/images/Record2.svg", 
                "6":"action/images/Record2.svg" };
                title="Record";
                break;
            case "Jump left to next item edge" :
                url_DOWN=url_DOWN+"_Ultraschall_Jump_Left_To_Next_Itemedge";
                this.settings.icon_playstate=  {"0":"action/images/Go_to_start_of_project@2x.png", "1":"action/images/Go_to_start_of_project@2x.png", "2":"action/images/Go_to_start_of_project@2x.png", "5":"action/images/Go_to_start_of_project@2x.png", "6":"action/images/Go_to_start_of_project@2x.png" };
                title="Jump left to next item edge";
                break;
            case "Jump right to next item edge" :
                url_DOWN=url_DOWN+"_Ultraschall_Jump_Right_To_Next_Itemedge";
                this.settings.icon_playstate=  {"0":"action/images/Go_to_end_of_project@2x.png", "1":"action/images/Go_to_end_of_project@2x.png", "2":"action/images/Go_to_end_of_project@2x.png", "5":"action/images/Go_to_end_of_project@2x.png", "6":"action/images/Go_to_end_of_project@2x.png" };
                title="Jump right to next item edge";
                break;
            case "Shuttle Backward" :
                url_DOWN=url_DOWN+"_Ultraschall_Shuttle_Backward";
                this.settings.icon_playstate=  {"0":"action/images/Shuttle_Backward@2x.png", 
                "1":"action/images/Shuttle_Backward@2x.png", "2":"action/images/Shuttle_Backward@2x.png",
                "5":"action/images/Shuttle_Backward@2x.png", "6":"action/images/Shuttle_Backward@2x.png" };
                title="Shuttle\nBackward";
                break;
            case "Shuttle Pause" :
                url_DOWN=url_DOWN+"_Ultraschall_Shuttle_Pause";
                this.settings.icon_playstate=  {"0":"action/images/Pause@2x.png", "1":"action/images/Pause@2x.png", "2":"action/images/Pause@2x.png", "5":"action/images/Pause@2x.png", "6":"action/images/Pause@2x.png" };
                title="Shuttle\nPause";
                break;
            case "Shuttle Forward" :
                url_DOWN=url_DOWN+"_Ultraschall_Shuttle_Forward";
                this.settings.icon_playstate=  {"0":"action/images/Play@2x.png", "1":"action/images/Play@2x.png", "2":"action/images/Play@2x.png", "5":"action/images/Play@2x.png", "6":"action/images/Play@2x.png" };
                title="Shuttle\nForward";
                break;
            case "Toggle Repeat" :
                url_DOWN=url_DOWN+"1068";
                this.settings.icon_playstate=  {"0":"action/images/Repeat.svg", "1":"action/images/Repeat.svg", "2":"action/images/Repeat.svg",
                 "5":"action/images/Repeat.svg", "6":"action/images/Repeat.svg", "R":"action/images/RepeatOn.svg" };
                title="Toggle\nRepeat";
                break;
                // playstate is 0 for stopped, 1 for playing, 2 for paused, 5 for recording, and 6 for record paused.
                // "R" is for Repeat On
        }
        console.log("icons: ",this.settings.icon_playstate);
        //this.settings.url_UP=url_UP;
        this.settings.url_DOWN=url_DOWN;
        this.settings.icon=icon;
        this.settings.mytitle=title;
        this.settings.selectedaction=this.settings.transporttype;

        $SD.api.setSettings(jsn.context, this.settings); //save settings
        $SD.api.setTitle(jsn.context, title);
        
        // find background loop object and call refresh
        let found = this.cache[jsn.context];
        console.log("FOUND BACKGROUND:",found);
        if (found) {
            // send new track to background loop
            found.refresh(this.settings);
        }
    },
};

function TransportButtonClass(jsonObj) {
    var jsn=jsonObj;
    var context = jsonObj.context;
    var counter = 0;
    var count = 0;
    var settings=jsonObj.payload.settings;
    var playstate_last="";
    var isRepeatOn_last="";
    

    function loop(){
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

    function refresh(jsn_refresh){
        console.log("refresh");
        playstate_last="";
        settings=jsn_refresh;
        destroy();
        counter===0;
        loop();
    }

    function destroy() {
        console.log("Destroy!!!!",counter,context);
        if (counter !== 0) {
            window.clearInterval(counter);
            counter = 0;
        }
    }

    function getTransportState(){
        console.log("getting transport state");

        var xhttp = new XMLHttpRequest();
        var url="http://127.0.0.1:8080/_/TRANSPORT";
        xhttp.open("GET", url , true);

        xhttp.onload = function () {
            if (xhttp.readyState === xhttp.DONE) {
                if (xhttp.status === 200) {
                    let resultText=xhttp.responseText;
                    resultText = resultText.replace(/(\r\n|\n|\r)/gm, "");
                    let resultArray = resultText.split('\t');
                    let playstate = resultArray[1];
                    let position_seconds = resultArray[2];
                    let isRepeatOn = resultArray[3];
                    let position_string = resultArray[4];
                    let position_string_beats = resultArray[5];
                    
                    if (playstate_last!==playstate || isRepeatOn_last!==isRepeatOn) { // update icon if playstate or repeat has changed
                        if (isRepeatOn==="1" &&  Icons[settings.icon_playstate["R"]]!==undefined) {
                            $SD.api.setImage(context,Icons[settings.icon_playstate["R"]]);
                        }
                        else{
                            $SD.api.setImage(context,Icons[settings.icon_playstate[playstate]]);
                        }
                    }
                    playstate_last=playstate;
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