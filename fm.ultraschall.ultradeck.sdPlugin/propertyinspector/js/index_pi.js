var onchangeevt = 'onchange'; // oninput or onchange;
let sdpiWrapper = document.querySelector('.sdpi-wrapper');
let settings;
var HTMLs={};

function readHTMLtoGlobal(filename) {
    var file = new XMLHttpRequest();
    file.open('GET', filename);
    file.onload = function() {HTMLs[filename]=file.responseText;}
    file.send();
}

readHTMLtoGlobal("toggle.html");
readHTMLtoGlobal("markers.html");
readHTMLtoGlobal("pushto.html");
readHTMLtoGlobal("levels.html");
readHTMLtoGlobal("transport.html");
readHTMLtoGlobal("misc.html");

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
}
wait(50);

function resetcolor(){console.log("RESET",settings);}
function resetcolor2(){console.log("RESET2",settings);}
function openGlobalSettings(){console.log("HUHU Global Settings",settings);}

$SD.on('connected', (jsn) => {
    console.log("connected",jsn,HTMLs);
    addDynamicStyles($SD.applicationInfo.colors, 'connectSocket');
    
    action=jsn.actionInfo.action;
    switch (action) {
        case "fm.ultraschall.ultradeck.toggle" :
            document.getElementById('placeholder').innerHTML = HTMLs["toggle.html"]; break;
        case "fm.ultraschall.ultradeck.markers" :
            document.getElementById('placeholder').innerHTML = HTMLs["markers.html"]; break;
        case "fm.ultraschall.ultradeck.pushto" :
            document.getElementById('placeholder').innerHTML = HTMLs["pushto.html"]; break;
        case "fm.ultraschall.ultradeck.levels" :
            document.getElementById('placeholder').innerHTML = HTMLs["levels.html"]; break;
        case "fm.ultraschall.ultradeck.transport" :
            document.getElementById('placeholder').innerHTML = HTMLs["transport.html"]; break;
        case "fm.ultraschall.ultradeck.misc" :
            document.getElementById('placeholder').innerHTML = HTMLs["misc.html"]; break;
    }
    
    prepareDOMElements();
    settings = Utils.getProp(jsn, 'actionInfo.payload.settings', false);
    
    if (settings) { updateUI(settings); }
});

$SD.on('sendToPropertyInspector', jsn => {
    console.log("PI on Sendtopi: ",jsn);
    const pl = jsn.payload;
    /**
     *  This is an example, how you could show an error to the user
     */
     if (pl.hasOwnProperty('error')) {
        sdpiWrapper.innerHTML = `<div class="sdpi-item">
            <details class="message caution">
            <summary class="${pl.hasOwnProperty('info') ? 'pointer' : ''}">${pl.error}</summary>
                ${pl.hasOwnProperty('info') ? pl.info : ''}
            </details>
        </div>`;
    } else {

        // do something
    }

    settings = Utils.getProp(jsn, 'payload.settings', false);
    if (settings) { updateUI(settings);}
});

const updateUI = (pl) => {
    console.log("updateUI");
    
    // hide or show Values if settings exist:
    var x=document.getElementById("sendnumbercontainer");
    if (x) {if (settings.sendnumber==="") {x.style.display="none"; } else { x.style.display="";}}

    var x=document.getElementById("tracknumbercontainer");
    if (x) {if (settings.tracknumber==="") {x.style.display="none"; } else { x.style.display="";}}
    
    x=document.getElementById("markertextcontainer");
    if (x) {if (settings.markertext==="") {x.style.display="none"; } else { x.style.display="";}}

    x=document.getElementById("markeroffsetcontainer");
    if (x) {if (settings.markeroffset==="") {x.style.display="none"; } else { x.style.display="";}}
    
    x=document.getElementById("cursorcontainer");
    if (x) {if (settings.cursor==="") {x.style.display="none"; } else { x.style.display="";}}
    
    x=document.getElementById("markercolorcontainer");
    if (x) {
        if (settings.markercolor==="") {
            x.style.display="none";
        } else {
            x.style.display="";
            var y=document.getElementById("markercolortext");
            if (settings.markercolortext!==undefined) {
                y.innerHTML=settings.markercolortext;
            }
        }
    }
    
    x=document.getElementById("markercolorcontainer2");
    if (x) {
        if (settings.markercolor==="") {
            x.style.display="none";
        } else {
            x.style.display="";
            var y=document.getElementById("markercolortext2");
            y.innerHTML=settings.markercolortext2;
        }
    }
    
    x=document.getElementById("toggletypetext");
    console.log("toggletypetext= " ,x);
    if (x) {
        x.innerHTML=settings.toggletypetext;
    }
    

    Object.keys(pl).map(e => {
        if (e && e != '') {
            const foundElement = document.querySelector(`#${e}`);
            console.log(`searching for: #${e}`, 'found:', foundElement);
            if (foundElement && foundElement.type !== 'file') {
                console.log("FOUND ELEMENT",pl,e,pl[e]);
                foundElement.value = pl[e];            
                const maxl = foundElement.getAttribute('maxlength') || 50;
                const labels = document.querySelectorAll(`[for='${foundElement.id}']`);
                if (labels.length) {
                    for (let x of labels) {
                        x.textContent = maxl ? `${foundElement.value.length}/${maxl}` : `${foundElement.value.length}`;
                    }
                }
            }
        }
   })
}

$SD.on('piDataChanged', (returnValue) => {
    console.log('%c%s', 'color: white; background: blue}; font-size: 15px;', 'piDataChanged');
    console.log(returnValue);
    
    if (returnValue.key === 'clickme') {
        postMessage = (w) => {
            w.postMessage(
                Object.assign({}, $SD.applicationInfo.application, {action: $SD.actionInfo.action})
                ,'*');
        }

        if (!window.xtWindow || window.xtWindow.closed) {
            window.xtWindow  = window.open('../externalWindow.html', 'External Window');
            setTimeout(() => postMessage(window.xtWindow), 200);
        } else {
           postMessage(window.xtWindow);
        }

    } else {

        /* SAVE THE VALUE TO SETTINGS */
        saveSettings(returnValue);

        /* SEND THE VALUES TO PLUGIN */
        sendValueToPlugin(returnValue, 'sdpi_collection');
    }
});

function saveSettings(sdpi_collection) {
console.log("saveSettings!",sdpi_collection);
    if (typeof sdpi_collection !== 'object') return;

    if (sdpi_collection.hasOwnProperty('key') && sdpi_collection.key != '') {
        if (sdpi_collection.value && sdpi_collection.value !== undefined) {
            console.log(sdpi_collection.key, " => ", sdpi_collection.value);
            settings[sdpi_collection.key] = sdpi_collection.value;
            console.log('setSettings....', settings);
            $SD.api.setSettings($SD.uuid, settings);
        }
    }
 }

function sendValueToPlugin(value, prop) {
    console.log("sendValueToPlugin", value, prop);
    if ($SD.connection && $SD.connection.readyState === 1) {
        const json = {
            action: $SD.actionInfo['action'],
            event: 'sendToPlugin',
            context: $SD.uuid,
            payload: {
                [prop]: value,
                targetContext: $SD.actionInfo['context']
            }
        };

        $SD.connection.send(JSON.stringify(json));
    }
}

function prepareDOMElements(baseElement) {
    console.log("prepareDOMElements");
    baseElement = baseElement || document;
    Array.from(baseElement.querySelectorAll('.sdpi-item-value')).forEach(
        (el, i) => {
            const elementsToClick = [
                'BUTTON',
                'OL',
                'UL',
                'TABLE',
                'METER',
                'PROGRESS',
                'CANVAS'
            ].includes(el.tagName);
            const evt = elementsToClick ? 'onclick' : onchangeevt || 'onchange';

            /** Look for <input><span> combinations, where we consider the span as label for the input
             * we don't use `labels` for that, because a range could have 2 labels.
             */
            const inputGroup = el.querySelectorAll('input + span');
            if (inputGroup.length === 2) {
                const offs = inputGroup[0].tagName === 'INPUT' ? 1 : 0;
                inputGroup[offs].textContent = inputGroup[1 - offs].value;
                inputGroup[1 - offs]['oninput'] = function() {
                    inputGroup[offs].textContent = inputGroup[1 - offs].value;
                };
            }
            /** We look for elements which have an 'clickable' attribute
             * we use these e.g. on an 'inputGroup' (<span><input type="range"><span>) to adjust the value of
             * the corresponding range-control
             */
            Array.from(el.querySelectorAll('.clickable')).forEach(
                (subel, subi) => {
                    subel['onclick'] = function(e) {
                        handleSdpiItemChange(e.target, subi);
                    };
                }
            );
            /** Just in case the found HTML element already has an input or change - event attached,
             * we clone it, and call it in the callback, right before the freshly attached event
            */
            const cloneEvt = el[evt];
            el[evt] = function(e) {
                if (cloneEvt) cloneEvt();
                handleSdpiItemChange(e.target, i);
            };
        }
    );

    /**
     * You could add a 'label' to a textares, e.g. to show the number of charactes already typed
     * or contained in the textarea. This helper updates this label for you.
     */
    baseElement.querySelectorAll('textarea').forEach((e) => {
        const maxl = e.getAttribute('maxlength');
        e.targets = baseElement.querySelectorAll(`[for='${e.id}']`);
        if (e.targets.length) {
            let fn = () => {
                for (let x of e.targets) {
                    x.textContent = maxl ? `${e.value.length}/${maxl}` : `${e.value.length}`;
                }
            };
            fn();
            e.onkeyup = fn;
        }
    });

    baseElement.querySelectorAll('[data-open-url').forEach(e => {
        const value = e.getAttribute('data-open-url');
        if (value) {
            e.onclick = () => {
                let path;
                if (value.indexOf('http') !== 0) {
                    path = document.location.href.split('/');
                    path.pop();
                    path.push(value.split('/').pop());
                    path = path.join('/');
                } else {
                    path = value;
                }
                $SD.api.openUrl($SD.uuid, path);
            };
        } else {
            console.log(`${value} is not a supported url`);
        }
    });
}

function handleSdpiItemChange(e, idx) {
    console.log('PI handleSdpiItemChange',e,idx);
    /** Following items are containers, so we won't handle clicks on them */

    if (['OL', 'UL', 'TABLE'].includes(e.tagName)) {
        return;
    }

    /** SPANS are used inside a control as 'labels'
     * If a SPAN element calls this function, it has a class of 'clickable' set and is thereby handled as
     * clickable label.
     */

    if (e.tagName === 'SPAN') {
        const inp = e.parentNode.querySelector('input');
        var tmpValue;

        // if there's no attribute set for the span, try to see, if there's a value in the textContent
        // and use it as value
        if (!e.hasAttribute('value')) {
               tmpValue = Number(e.textContent);
            if (typeof tmpValue === 'number' && tmpValue !== null) {
                e.setAttribute('value', 0+tmpValue); // this is ugly, but setting a value of 0 on a span doesn't do anything
                e.value = tmpValue;
            }
        } else {
            tmpValue = Number(e.getAttribute('value'));
        }

        if (inp && tmpValue !== undefined) {
            inp.value = tmpValue;
        } else return;
    }

    const selectedElements = [];
    const isList = ['LI', 'OL', 'UL', 'DL', 'TD'].includes(e.tagName);
    const sdpiItem = e.closest('.sdpi-item');
    const sdpiItemGroup = e.closest('.sdpi-item-group');
    let sdpiItemChildren = isList
        ? sdpiItem.querySelectorAll(e.tagName === 'LI' ? 'li' : 'td')
        : sdpiItem.querySelectorAll('.sdpi-item-child > input');

    if (isList) {
        const siv = e.closest('.sdpi-item-value');
        if (!siv.classList.contains('multi-select')) {
            for (let x of sdpiItemChildren) x.classList.remove('selected');
        }
        if (!siv.classList.contains('no-select')) {
            e.classList.toggle('selected');
        }
    }

    if (sdpiItemChildren.length && ['radio','checkbox'].includes(sdpiItemChildren[0].type)) {
        e.setAttribute('_value', e.checked); //'_value' has priority over .value
    }
    if (sdpiItemGroup && !sdpiItemChildren.length) {
        for (let x of ['input', 'meter', 'progress']) {
            sdpiItemChildren = sdpiItemGroup.querySelectorAll(x);
            if (sdpiItemChildren.length) break;
        }
    }

    if (e.selectedIndex) {
        idx = e.selectedIndex;
    } else {
        sdpiItemChildren.forEach((ec, i) => {
            if (ec.classList.contains('selected')) {
                selectedElements.push(ec.textContent);
            }
            if (ec === e) {
                idx = i;
                selectedElements.push(ec.value);
            }
        });
    }

    const returnValue = {
        key: e.id && e.id.charAt(0) !== '_' ? e.id : sdpiItem.id,
        value: isList
            ? e.textContent
            : e.hasAttribute('_value')
            ? e.getAttribute('_value')
            : e.value
            ? e.type === 'file'
                ? decodeURIComponent(e.value.replace(/^C:\\fakepath\\/, ''))
                : e.value
            : e.getAttribute('value'),
        group: sdpiItemGroup ? sdpiItemGroup.id : false,
        index: idx,
        selection: selectedElements,
        checked: e.checked
    };

    /** Just simulate the original file-selector:
     * If there's an element of class '.sdpi-file-info'
     * show the filename there
     */
    if (e.type === 'file') {
        const info = sdpiItem.querySelector('.sdpi-file-info');
        if (info) {
            const s = returnValue.value.split('/').pop();
            info.textContent =                s.length > 28
                    ? s.substr(0, 10)
                      + '...'
                      + s.substr(s.length - 10, s.length)
                    : s;
        }
    }

    $SD.emit('piDataChanged', returnValue);
}

/**
 * This is a quick and simple way to localize elements and labels in the Property
 * Inspector's UI without touching their values.
 * It uses a quick 'lox()' function, which reads the strings from a global
 * variable 'localizedStrings' (in 'common.js')
 */

// eslint-disable-next-line no-unused-vars
function localizeUI() {
    console.log('PI localizeUI');
    const el = document.querySelector('.sdpi-wrapper') || document;
    let t;
    Array.from(el.querySelectorAll('sdpi-item-label')).forEach(e => {
        t = e.textContent.lox();
        if (e !== t) {
            e.innerHTML = e.innerHTML.replace(e.textContent, t);
        }
    });
    Array.from(el.querySelectorAll('*:not(script)')).forEach(e => {
        if (
            e.childNodes
            && e.childNodes.length > 0
            && e.childNodes[0].nodeValue
            && typeof e.childNodes[0].nodeValue === 'string'
        ) {
            t = e.childNodes[0].nodeValue.lox();
            if (e.childNodes[0].nodeValue !== t) {
                e.childNodes[0].nodeValue = t;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("pi doc event listn");
    document.body.classList.add(navigator.userAgent.includes("Mac") ? 'mac' : 'win');
    prepareDOMElements();
    $SD.on('localizationLoaded', (language) => {
        //localizeUI();
    });
});

window.addEventListener('beforeunload', function(e) {
    e.preventDefault();
    sendValueToPlugin('propertyInspectorWillDisappear', 'property_inspector');
    // Don't set a returnValue to the event, otherwise Chromium with throw an error.  // e.returnValue = '';
});

function gotCallbackFromWindow(parameter) {
    console.log('gotCallbackFromWindow',parameter);
}
