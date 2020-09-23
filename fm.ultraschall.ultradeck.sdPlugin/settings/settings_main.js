// code copied from Elgato Philips Hue Plugin:
var globalSettings={};

// Get the url parameter
var url = new URL(window.location.href);

var context = url.searchParams.get("context");
var IP = url.searchParams.get("IP");
var PORT = url.searchParams.get("PORT");

console.log("URL,UUID: ", url, context, IP,PORT);

// Add event listener
document.addEventListener("escPressed", close_window);
document.addEventListener("save_button", close_window);

window.onload = function() {
    // Set actual values to input fields
    document.getElementById('ultraschall_ip').value = IP;
    document.getElementById('ultraschall_port').value = PORT;
    
    // Bind ESC key
    document.addEventListener('keydown', function (e) {
        var key = e.which || e.keyCode;
        if (key === 27) {
            var event = new CustomEvent("escPressed");
            document.dispatchEvent(event);
        }
    });
}

// save and close
//function save_settings() {
//    console.log("SAVE SETTINGS BUTTON PRESSED");
//    var event = new CustomEvent("save_button");
//    document.dispatchEvent(event);
//}

// Close the window
function close_window() {
    var ipadress=document.getElementById("ultraschall_ip").value;
    var port=document.getElementById("ultraschall_port").value;

    var detail = {
        'detail': {
            'ip': ipadress,
            'port': port
          }
      };
    event=new CustomEvent("saveGlobalSetup",detail);
    window.opener.document.dispatchEvent(event);
    document.removeEventListener("escPressed", close_window);
    document.removeEventListener("save_button", close_window);
    window.close();
};
