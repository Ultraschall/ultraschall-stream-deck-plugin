$SD.on('connected', (jsonObj) => connected(jsonObj));
var defaulticoncolor="#d8d8d8"; 
var defaulticoncolorON="#fdcb00"; //#fdcb00=yellow
var defaulticoncolorOFF="#d8d8d8"; //#d8d8d8=light grey
var Icons={};
var uuid="";
var redX='<path d="M61.627,14.676l-6.489,6.489l6.489,6.489c0.487,0.486 0.487,1.279 0,1.776l-2.357,2.356c-0.486,0.487 -1.278,0.487 -1.775,0l-6.49,-6.489l-6.49,6.489c-0.486,0.487 -1.278,0.487 -1.775,0l-2.357,-2.356c-0.486,-0.486 -0.486,-1.279 -0,-1.776l6.489,-6.489l-6.489,-6.489c-0.486,-0.486 -0.486,-1.279 -0,-1.776l2.357,-2.357c0.486,-0.486 1.279,-0.486 1.775,0l6.49,6.49l6.49,-6.49c0.486,-0.486 1.279,-0.486 1.775,0l2.357,2.357c0.497,0.486 0.497,1.279 0,1.776Z" style="fill:#f00;fill-rule:nonzero;"/>';
var globalSettings={};
var SLwebsocketerror=false;

LoadPNGIconsToArray(['action/images/Ultraschall_logo@2x.png',
                     'action/images/empty@2x.png'
                  ]);

LoadSVGIconsToArray(['action/images/muted.svg',
                     'action/images/unmuted.svg',
                     'action/images/Chapter_marker_playpos.svg',
                     'action/images/Chapter_marker.svg',
                     'action/images/Edit_marker.svg',
                     'action/images/next_marker.svg',
                     'action/images/prev_marker.svg',
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
                     'action/images/Custom_action.svg',
                     'action/images/RecordView.svg',
                     'action/images/StoryboardView.svg',
                     'action/images/Marker_Dashboard.svg',
                     'action/images/Volume_up.svg',
                     'action/images/Volume_down.svg',
                     'action/images/Pause.svg',
                     'action/images/Pause2.svg',
                     'action/images/Play.svg',
                     'action/images/Play2.svg',
                     'action/images/Record.svg',
                     'action/images/Record2.svg',
                     'action/images/Stop.svg',
                     'action/images/Go_to_start_of_project.svg',
                     'action/images/Go_to_end_of_project.svg',
                     'action/images/Shuttle_Backward.svg',
                     'action/images/Soundboard.svg'
]);

var SoundboardTexts={};
SoundboardTexts['playstop'] = "play/\nstop";
SoundboardTexts['playpause'] = "play/\npause";
SoundboardTexts['play'] = "play";
SoundboardTexts['fadeinpause'] = "fadein/\npause";
SoundboardTexts['playfadeout'] = "play/\nfadeout";


var ExtraDefaultColor={};
ExtraDefaultColor['action/images/Edit_marker.svg'] = '#c81414'; // red
ExtraDefaultColor['action/images/Delete_all_markers.svg'] = '#ff0000'; // very red
ExtraDefaultColor['action/images/Timestamp_marker.svg'] = '#ffffff'; // white for timestamp marker

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

function SetImageStyle(image, style, color)
{
    //console.log("image= ",image)
    image=image.replace(/svg width="100%" height="100%"/g,'svg width="200%" height="200%"'); //hack for iphone app to get less pixelation
    if (style==="inverted")
    {
        image=image.replace(/#d8d8d8/g, 'KATZE2000');
        image=image.replace(/fill:none/g, 'fill:'+color);
        image=image.replace(/KATZE2000/g, '#2d2d2d');
    } else if (style==="normal")
    {
        image=image.replace(/#d8d8d8/g, color);
    }
    return (image);
}

function connected(jsn) {
    uuid=jsn.uuid;
    //console.log('%c%s','color: white; background: blue; font-size: 15px;','[app.js] connected:',jsn)
    $SD.api.getGlobalSettings(jsn.uuid);
    $SD.on('didReceiveGlobalSettings', (jsn) => {
        console.log("APP received GLOBAL Settings!!!!!",jsn);
        globalSettings=jsn.payload.settings;
        if (!globalSettings.hasOwnProperty('ipadress')) {globalSettings.ipadress="127.0.0.1";}
        if (!globalSettings.hasOwnProperty('port')) {globalSettings.port="8080";}
        if (!globalSettings.hasOwnProperty('SLipadress')) {globalSettings.ipadress="127.0.0.1";}
        if (!globalSettings.hasOwnProperty('SLport')) {globalSettings.port="62969";}
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
