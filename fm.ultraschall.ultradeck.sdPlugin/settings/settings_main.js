var globalSettings={};

// Get the url parameter
var url = new URL(window.location.href);

var context = url.searchParams.get("context");
var IP = url.searchParams.get("IP");
var PORT = url.searchParams.get("PORT");
var SLIP = url.searchParams.get("SLIP");
var SLPORT = url.searchParams.get("SLPORT");

// Add event listener
document.addEventListener("escPressed", close_window);
//document.addEventListener("save_button", close_window);

window.onload = function() {
    // Set actual values to input fields
    document.getElementById('ultraschall_ip').value = IP;
    document.getElementById('ultraschall_port').value = PORT;
    document.getElementById('StudioLink_ip').value = SLIP;
    document.getElementById('StudioLink_port').value = SLPORT;

    // Bind ESC key
    document.addEventListener('keydown', function (e) {
        var key = e.which || e.keyCode;
        if (key === 27) {
            var event = new CustomEvent("escPressed");
            document.dispatchEvent(event);
        }
    });
}

// save
function save_settings() {
    var ipadress=document.getElementById("ultraschall_ip").value;
    var port=document.getElementById("ultraschall_port").value;
    var SLipadress=document.getElementById("StudioLink_ip").value;
    var SLport=document.getElementById("StudioLink_port").value;
    var detail = {
        'detail': {
            'ip': ipadress,
            'port': port,
            'SLip': SLipadress,
            'SLport': SLport
        }
      };
    var event=new CustomEvent("saveGlobalSetup",detail);
    window.opener.document.dispatchEvent(event);
}

// Close the window
function close_window() {
    document.removeEventListener("escPressed", close_window);
    document.removeEventListener("save_button", close_window);
    window.close();
};
