const markers = {
    settings:{},
    
    onWillAppear: function (jsn) {
        console.log("huhu i bims eine Marker Action",jsn);
        this.settings = jsn.payload.settings;

        // set defaults, if nothing is set
        if (!this.settings.hasOwnProperty('markertype')) {this.settings.markertype="Insert chapter marker";}
        if (!this.settings.hasOwnProperty('url')) {this.settings.url="/_/_Ultraschall_Set_Marker";}
        if (!this.settings.hasOwnProperty('icon')) {this.settings.icon="action/images/Chapter_marker.svg";}
        if (!this.settings.hasOwnProperty('title')) {this.settings.title="Insert\nchapter\nmarker";}
        if (!this.settings.hasOwnProperty('markercolor')) {this.settings.markercolor=defaulticoncolor;}
        if (!this.settings.hasOwnProperty('markercolortext')) {this.settings.markercolortext="Icon color";}
        if (!this.settings.hasOwnProperty('markertext')) {this.settings.markertext="";}
        if (!this.settings.hasOwnProperty('cursor')) {this.settings.cursor="Play cursor";}
        if (!this.settings.hasOwnProperty('markeroffset')) {this.settings.markeroffset="0";}

        this.settings.lastmarkertype=this.settings.markertype;

        $SD.api.setSettings(jsn.context, this.settings);

        //set icon
        if (ExtraDefaultColor[this.settings.icon]) {this.settings.markercolor=ExtraDefaultColor[this.settings.icon];}
        console.log("FARBE ist nun ", this.settings.markercolor);
        var image=Icons[this.settings.icon];
        image=image.replace('#d8d8d8', this.settings.markercolor);
        $SD.api.setImage(jsn.context,image);
        $SD.api.setTitle(jsn.context, this.settings.title);
    },

    onKeyDown: function (jsn) {
        this.settings = jsn.payload.settings;
        console.log("KeyDown marker ", jsn);
        var xhttp = new XMLHttpRequest();
        var request_url="http://"+globalSettings.ipadress+":"+globalSettings.port+this.settings.url;
        console.log("request_url=",request_url);
        xhttp.open("GET", request_url , true);
        xhttp.send();
    },

    onSendToPlugin: function(jsn) {
        console.log("onSendToPlugin",jsn);
        if (jsn.payload.hasOwnProperty('sdpi_collection')) {
            if (jsn.payload.sdpi_collection.key==="resetcolor") {
                this.resetIconColor(jsn);
            }
            //if (jsn.payload.sdpi_collection.key==="GlobalSettingsButton") {
                //console.log("OPEN WINDOW",jsn.context);
                //window.open("settings/index.html?context=" + jsn.context);
                //parameters for global settings page:
                //window.open("settings/index.html?language=" + inLanguage + "&streamDeckVersion=" + inStreamDeckVersion + "&pluginVersion=" + inPluginVersion);
            //}
        }
    }, 

    resetIconColor: function(jsn){
        console.log("resetIconColor",jsn,this.markercolor)
        this.settings.markercolor=defaulticoncolor;
        if (ExtraDefaultColor[this.settings.icon]) {
            this.settings.markercolor=ExtraDefaultColor[this.settings.icon];
        }
        var image=Icons[this.settings.icon];
        image=image.replace('#d8d8d8', this.settings.markercolor);
        $SD.api.setImage(jsn.context,image);
        $SD.api.setSettings(jsn.context, this.settings);
    },

    titleParametersDidChange: function(jsn){ //redraw image and title
        //console.log("TitleChanged",this.settings.markercolor, jsn)
        if (jsn.payload.settings.hasOwnProperty('markercolor')) {this.settings = jsn.payload.settings;}
        $SD.api.setImage(jsn.context,Icons['action/images/empty@2x.png']); //dirty hack, clear icon and then set new icon
        var image=Icons[this.settings.icon];
        image=image.replace('#d8d8d8', this.settings.markercolor);
        $SD.api.setImage(jsn.context,image);
        $SD.api.setTitle(jsn.context, this.settings.title);
    },
    
    onDidReceiveSettings: function(jsn) {
        console.log('%c%s', 'color: white; background: red; font-size: 15px;', 'Actio Markers.js onDidReceiveSettings:', jsn);
        this.settings = jsn.payload.settings;
        console.log("%s - %s",this.settings.markertype,this.settings.lastmarkertype);
        if (this.settings.markertype===this.settings.lastmarkertype) { // no markertype change
            // do something
            var markerchanged=false;
        } else { //markertype changed, reset values       
            // default values
            var markerchanged=true;
            this.settings.markercolortext="Icon color";
            this.settings.markercolor=defaulticoncolor;
            this.settings.markertext="";
            this.settings.markeroffset="";
            this.settings.cursor="";
            this.settings.lastmarkertype=this.settings.markertype;
        }

        console.log("markerchanged",markerchanged);

        switch(this.settings.markertype) {
            case "Insert chapter marker" :
                if (this.settings.markeroffset==="") {this.settings.markeroffset="0"};
                this.settings.markercolortext="Icon color";
                if (this.settings.cursor==="") {this.settings.cursor="Automatic depending on followmode"};
                this.settings.url="/_/SET/EXTSTATE/ultradeck/markertype/chapter" + ";SET/EXTSTATE/ultradeck/markeroffset/"+encodeURIComponent(this.settings.markeroffset) + ";SET/EXTSTATE/ultradeck/cursor/"+encodeURIComponent(this.settings.cursor) + ";_Ultraschall_StreamDeck";
                this.settings.icon="action/images/Chapter_marker.svg"
                this.settings.title="Insert\nchapter\nmarker";
                break;
            case "Insert chapter marker and edit name" :
                if (this.settings.markeroffset==="") {this.settings.markeroffset="0"};
                this.settings.markercolortext="Icon color";
                if (this.settings.cursor==="") {this.settings.cursor="Automatic depending on followmode"};
                this.settings.url="/_/SET/EXTSTATE/ultradeck/markertype/chapter_enter_name" + ";SET/EXTSTATE/ultradeck/markeroffset/"+encodeURIComponent(this.settings.markeroffset) + ";SET/EXTSTATE/ultradeck/cursor/"+encodeURIComponent(this.settings.cursor) + ";_Ultraschall_StreamDeck";
                this.settings.icon="action/images/Chapter_marker.svg"
                this.settings.title="Insert\nnamed\nchapter\nmarker";
                break;
            case "Insert marker with time stamp (ISO 8601)" :
                console.log("HUHU TIMESTAMP", this.settings);
                if (this.settings.markeroffset==="") {this.settings.markeroffset="0"};
                this.settings.markercolortext="Marker color";
                if (this.settings.cursor==="") {this.settings.cursor="Automatic depending on followmode"};
                this.settings.icon="action/images/Timestamp_marker.svg"
                this.settings.title="Insert\nchapter\nmarker\nwith\ntime stamp\n(ISO 8601)";
                if (this.settings.markercolor==="" || markerchanged) {
                    if (ExtraDefaultColor[this.settings.icon]) {
                        console.log("ICH BIN HIER");
                        this.settings.markercolor=ExtraDefaultColor[this.settings.icon];
                    }
                }
                this.settings.url="/_/SET/EXTSTATE/ultradeck/markertype/marker_with_timestamp"
                + ";SET/EXTSTATE/ultradeck/markercolor/"+encodeURIComponent(this.settings.markercolor)
                + ";SET/EXTSTATE/ultradeck/markeroffset/"+encodeURIComponent(this.settings.markeroffset)
                + ";SET/EXTSTATE/ultradeck/cursor/"+encodeURIComponent(this.settings.cursor)
                + ";_Ultraschall_StreamDeck";
                break;
            case "Import chapter markers" :
                this.settings.url="/_/_ULTRASCHALL_INSERT_CHAPTERS";
                this.settings.icon="action/images/Chapter_marker.svg"
                this.settings.title="Import\nchapter\nmarkers";
                break;
            case "Export chapter markers" :
                this.settings.url="/_/_ULTRASCHALL_SAVE_CHAPTERS";
                this.settings.icon="action/images/Chapter_marker.svg"
                this.settings.title="Export\nchapter\nmarkers";
                break;
            case "Save chapter markers to project folder" :
                this.settings.url="/_/_ULTRASCHALL_SAVE_CHAPTERS_TO_PROJECT";
                this.settings.icon="action/images/Chapter_marker.svg"
                this.settings.title="Save\nchapter\nmarkers\nto project\nfolder";
                break;
            case "Insert chapter markers at the start of every selected item" :
                this.settings.url="/_/_XENAKIOS_CRTMARKERSFROMITEMS1";
                this.settings.icon="action/images/Chapter_marker.svg"
                this.settings.title="Insert\nmarkers\nat the start of\nevery\nselected item";
                break;
            case "Insert edit marker" :
                this.settings.url="/_/_Ultraschall_Set_Edit";
                this.settings.icon="action/images/Edit_marker.svg"
                this.settings.title="Insert\nedit\nmarker";
                if (this.settings.markercolor==="" || markerchanged) {
                    if (ExtraDefaultColor[this.settings.icon]) {this.settings.markercolor=ExtraDefaultColor[this.settings.icon];}
                }
                break;
            case "Insert edit marker at play/rec position" :
                this.settings.url="/_/_Ultraschall_Set_Edit_Play";
                this.settings.icon="action/images/Edit_marker.svg"
                this.settings.title="Insert\nedit marker\nat play/rec\nposition";
                if (this.settings.markercolor==="" || markerchanged) {
                    if (ExtraDefaultColor[this.settings.icon]) {this.settings.markercolor=ExtraDefaultColor[this.settings.icon];}
                }
                break;
            case "Import planned markers from clipboard" :
                this.settings.url="/_/_Ultraschall_Import_Markers_As_Planned_From_Clipboard";
                this.settings.icon="action/images/Chapter_marker.svg"
                this.settings.title="Import\nplanned\nmarkers\nfrom\nclipboard";
                break;
            case "Insert next planned marker" :
                this.settings.url="/_/_Ultraschall_Set_Next_Planned_Marker";
                this.settings.icon="action/images/Chapter_marker.svg"
                this.settings.title="Insert\nnext\nplanned\nmarker";
                break;
            case "Insert next planned marker at play/rec position" :
                this.settings.url="/_/_Ultraschall_Set_Next_Planned_Marker_Play";
                this.settings.icon="action/images/Chapter_marker.svg"
                this.settings.title="Insert\nnext\nplanned\nmarker\nat play/rec\nposition";
                break;
            case "Insert custom marker" :
                this.settings.icon="action/images/Chapter_marker.svg"
                this.settings.title="Insert\ncustom \nmarker";
                if (this.settings.markertext==="") {this.settings.markertext="enter custom text here...";}
                if (this.settings.markercolor==="") {this.settings.markercolor="#c000c0";}
                if (this.settings.markeroffset==="") {this.settings.markeroffset="0"};
                this.settings.markercolortext="Marker color";
                if (this.settings.cursor==="") {this.settings.cursor="Play cursor"};
                console.log("CURSOR=",this.settings.cursor);
                this.settings.url="/_/SET/EXTSTATE/ultradeck/markertext/"+encodeURIComponent(this.settings.markertext)
                    +";SET/EXTSTATE/ultradeck/markercolor/"+encodeURIComponent(this.settings.markercolor)
                    +";SET/EXTSTATE/ultradeck/markertype/custom"
                    +";SET/EXTSTATE/ultradeck/markeroffset/"+encodeURIComponent(this.settings.markeroffset)
                    +";SET/EXTSTATE/ultradeck/cursor/"+encodeURIComponent(this.settings.cursor)
                    +";_Ultraschall_StreamDeck";
                break;
            case "Go to next marker/project end" :
                this.settings.url="/_/_Ultraschall_Go_To_Next_Marker_Projectend";
                this.settings.icon="action/images/next_marker.svg"
                this.settings.title="Go to next\nmarker or\nproject end";
                break;
            case "Go to previous marker/project start" :
                this.settings.url="/_/_Ultraschall_Go_To_Previous_Marker_Projectstart";
                this.settings.icon="action/images/prev_marker.svg"
                this.settings.title="Go to prev.\nmarker or\nproject start";
                break;
            case "Delete last marker" :
                this.settings.url="/_/_Ultraschall_Delete_Last_Marker";
                this.settings.icon="action/images/Chapter_marker.svg"
                this.settings.title="Delete\nlast\nmarker";
                break;
            case "Open marker dashboard" :
                this.settings.url="/_/_Ultraschall_Marker_Dashboard";
                this.settings.icon="action/images/Chapter_marker.svg"
                this.settings.title="Open\nmarker\ndashboard";
                break;
            case "DELETE ALL MARKERS" :
                this.settings.url="/_/_SWSMARKERLIST9";
                this.settings.icon="action/images/Delete_all_markers.svg"
                this.settings.title="DELETE\nALL\nMARKERS";
                if (this.settings.markercolor==="" || markerchanged) {
                    if (ExtraDefaultColor[this.settings.icon]) {this.settings.markercolor=ExtraDefaultColor[this.settings.icon];}
                }
                break;
        }
        
        $SD.api.setSettings(jsn.context, this.settings); //save settings
        $SD.api.setTitle(jsn.context, this.settings.title);
        this.titleParametersDidChange(jsn); //refresh icon and title
    }
};