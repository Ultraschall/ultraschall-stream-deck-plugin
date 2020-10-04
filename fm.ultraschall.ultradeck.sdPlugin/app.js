$SD.on('connected', (jsonObj) => connected(jsonObj));
var defaulticoncolor="#d8d8d8";
var defaulticoncolorON="#fdcb00";
var Icons={};
var uuid="";
var globalSettings={};

LoadPNGIconsToArray(['action/images/Chapter_marker@2x.png',
                     'action/images/Edit_marker@2x.png',
                     'action/images/Ultraschall_logo@2x.png',
                     'action/images/Volume_down@2x.png',
                     'action/images/Volume_up@2x.png',
                     'action/images/Pause@2x.png',
                     'action/images/Pause2@2x.png',
                     'action/images/Play@2x.png',
                     'action/images/Play2@2x.png',
                     'action/images/Record@2x.png',
                     'action/images/Record2@2x.png',
                     'action/images/Stop@2x.png',
                     'action/images/Go_to_start_of_project@2x.png',
                     'action/images/Go_to_end_of_project@2x.png',
                     'action/images/Shuttle_Backward@2x.png',
                     'action/images/empty@2x.png'
                  ]);

LoadSVGIconsToArray(['action/images/muted.svg',
                     'action/images/unmuted.svg',
                     'action/images/Chapter_marker_playpos.svg',
                     'action/images/Chapter_marker.svg',
                     'action/images/Edit_marker.svg',
                     'action/images/next_marker.svg',
                     'action/images/prev_marker.svg',
                     'action/images/Delete_all_markers.svg',
                     'action/images/Follow_mode.svg',
                     'action/images/MagicRouting.svg',
                     'action/images/Preshow.svg',
                     'action/images/Recording.svg',
                     'action/images/Editing.svg',
                     'action/images/OnAir.svg',
                     'action/images/Record.svg',
                     'action/images/Record2.svg',
                     'action/images/Repeat.svg',
                     'action/images/RepeatOn.svg',
                     'action/images/Game.svg',
                     'action/images/Timestamp_marker.svg',
                     'action/images/Custom_action.svg'
]);

var ExtraDefaultColor={};
ExtraDefaultColor['action/images/Edit_marker.svg'] = '#c81414'; // red
ExtraDefaultColor['action/images/Delete_all_markers.svg'] = '#ff0000'; // very red
ExtraDefaultColor['action/images/Timestamp_marker.svg'] = '#ffffff'; // white for timestamp marker
ExtraDefaultColor['Toggle follow mode'] = "#fdcb00"; // yellow
ExtraDefaultColor['Toggle Magic Routing'] = "#fdcb00"; // yellow
ExtraDefaultColor['Set preshow routing'] = "#fdcb00"; // yellow
ExtraDefaultColor['Set recording routing'] = "#fdcb00"; // yellow
ExtraDefaultColor['Set editing routing'] = "#fdcb00"; // yellow
ExtraDefaultColor['Toggle Studiolink OnAir'] = "#fdcb00"; // yellow

function LoadPNGIconsToArray(IconsURLArray){
    const aUrl = !Array.isArray(IconsURLArray) ? [IconsURLArray] : IconsURLArray;
    for (let url of aUrl) {
        _.loadImage(url, callbackfunc);
        function callbackfunc(imagedatastring){
            Icons[url]=imagedatastring;
        }
    };
}

function loadSVG(filename) {
    var file = new XMLHttpRequest();
    file.open('GET', filename);
    file.onload = function() {
        let image=file.responseText.match(/<svg.*/gi);
        image=image[0];
        Icons[filename]='data:image/svg+xml;charset=utf8,'+image;
    }
    file.send();
}

function LoadSVGIconsToArray(IconsURLArray){
    const aUrl = !Array.isArray(IconsURLArray) ? [IconsURLArray] : IconsURLArray;
    for (let url of aUrl) {
        loadSVG(url);
    };
}

function connected(jsn) {
    uuid=jsn.uuid;
    console.log('%c%s','color: white; background: blue; font-size: 15px;','[app.js] connected:',jsn)
    $SD.api.getGlobalSettings(jsn.uuid);
    $SD.on('didReceiveGlobalSettings', (jsn) => {
        console.log("APP received GLOBAL Settings!!!!!",jsn);
        globalSettings=jsn.payload.settings;
        if (!globalSettings.hasOwnProperty('ipadress')) {globalSettings.ipadress="127.0.0.1";}
        if (!globalSettings.hasOwnProperty('port')) {globalSettings.port="8080";}
        $SD.api.setGlobalSettings(uuid, globalSettings);
    });

    $SD.on('fm.ultraschall.ultradeck.toggle.willAppear', (jsonObj) => toggle.onWillAppear(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.toggle.willDisappear', (jsonObj) => toggle.onWillDisappear(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.toggle.keyDown', (jsonObj) => toggle.onKeyDown(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.toggle.didReceiveSettings', (jsonObj) => toggle.onDidReceiveSettings(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.toggle.sendToPlugin', (jsonObj) => toggle.onSendToPlugin(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.toggle.titleParametersDidChange', (jsonObj) => toggle.titleParametersDidChange(jsonObj));

    $SD.on('fm.ultraschall.ultradeck.markers.willAppear', (jsonObj) => markers.onWillAppear(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.markers.keyDown', (jsonObj) => markers.onKeyDown(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.markers.didReceiveSettings', (jsonObj) => markers.onDidReceiveSettings(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.markers.titleParametersDidChange', (jsonObj) => markers.titleParametersDidChange(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.markers.sendToPlugin', (jsonObj) => markers.onSendToPlugin(jsonObj));

    $SD.on('fm.ultraschall.ultradeck.pushto.willAppear', (jsonObj) => pushto.onWillAppear(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.pushto.keyDown', (jsonObj) => pushto.onKeyDown(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.pushto.keyUp', (jsonObj) => pushto.onKeyUp(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.pushto.didReceiveSettings', (jsonObj) => pushto.onDidReceiveSettings(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.pushto.sendToPlugin', (jsonObj) => pushto.onSendToPlugin(jsonObj));
 
    $SD.on('fm.ultraschall.ultradeck.levels.willAppear', (jsonObj) => levels.onWillAppear(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.levels.keyDown', (jsonObj) => levels.onKeyDown(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.levels.didReceiveSettings', (jsonObj) => levels.onDidReceiveSettings(jsonObj));

    $SD.on('fm.ultraschall.ultradeck.transport.willAppear', (jsonObj) => transport.onWillAppear(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.transport.willDisappear', (jsonObj) => transport.onWillDisappear(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.transport.keyDown', (jsonObj) => transport.onKeyDown(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.transport.didReceiveSettings', (jsonObj) => transport.onDidReceiveSettings(jsonObj));

    $SD.on('fm.ultraschall.ultradeck.misc.willAppear', (jsonObj) => misc.onWillAppear(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.misc.keyDown', (jsonObj) => misc.onKeyDown(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.misc.didReceiveSettings', (jsonObj) => misc.onDidReceiveSettings(jsonObj));
    $SD.on('fm.ultraschall.ultradeck.misc.sendToPlugin', (jsonObj) => misc.onSendToPlugin(jsonObj));
};
