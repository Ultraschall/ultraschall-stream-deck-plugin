-- add this line to reaper-kb.ini:
-- SCR 4 0 Ultraschall_StreamDeck "Extras: Ultraschall: Streamdeck" ultraschall_streamdeck.lua

-- load Ultraschall API
dofile(reaper.GetResourcePath().."/UserPlugins/ultraschall_api.lua")

-- get ExtStates submittetd from StreamDeck Plugin and act accordingly
mutetype=reaper.GetExtState("ultradeck", "mutetype")
    if (mutetype==nil) then mutetype="" end
tracknumber=reaper.GetExtState("ultradeck", "tracknumber")
    if (tracknumber=="" or tracknumber==nil) then tracknumber="1" end
    tracknumber=tonumber(tracknumber)
markertype=reaper.GetExtState("ultradeck", "markertype")
markertext=reaper.GetExtState("ultradeck", "markertext")
markercolor=reaper.GetExtState("ultradeck", "markercolor")
    if (markercolor=="") then markercolor=0 end
markeroffset=reaper.GetExtState("ultradeck", "markeroffset") or "0,0"
    markeroffset=string.gsub(markeroffset , "," , "." )
    markeroffset=tonumber( markeroffset ) or 0
cursor=reaper.GetExtState("ultradeck", "cursor")
    if cursor==nil or cursor=="" then cursor= "Automatic depending on followmode" end
down=reaper.GetExtState("ultradeck", "down")
    if down==nil or down=="" then down="1" end
soundboardaction=reaper.GetExtState("ultradeck", "soundboardaction")
soundboardplayernumber=reaper.GetExtState("ultradeck", "soundboardplayernumber")
    if soundboardaction==nil then soundboardaction="" end
    if soundboardplayer==nil then soundboardplayer="" end
    if soundboardplayernumber==""then soundboardplayernumber="0" end
    soundboardplayernumber=tonumber(soundboardplayernumber)
    if soundboardplayernumber==0 then soundboardplayernumber=1 end

function debugStreamdeckPlugin(dbg)
    if dbg then
        print("------------------")
        print("Mutetype= "..mutetype)
        print("tracknumber= "..tracknumber)
        print("markertype= "..markertype)
        print("markertext= "..markertext)
        print("markercolor= "..markercolor)
        print("markeroffset= "..markeroffset)
        print("cursor= "..cursor)
        print("down= "..down)
        print("soundboardaction= "..soundboardaction)
        print("soundboardplayernumber= "..soundboardplayernumber)
        print("------------------")
    end
end

debugStreamdeckPlugin(false)

function convert_color_hex2rgb(inputcolor)
    if string.len(inputcolor)==7 then
        r=tonumber(string.sub(markercolor, 2, 3), 16)
        g=tonumber(string.sub(markercolor, 4, 5), 16)
        b=tonumber(string.sub(markercolor, 6, 7), 16)
        return reaper.ColorToNative(r, g, b) | 0x1000000
    else
        return 0
    end
end

function get_cursor_position_at_selected_cursor_type(cursortype)
    local pos=0
    if cursortype=="Automatic depending on followmode" then
        followstate=ultraschall.GetUSExternalState("ultraschall_follow", "state")
        if reaper.GetPlayState() == 0 or reaper.GetPlayState() == 2 then -- 0 = Stop, 2 = Pause
            pos = reaper.GetCursorPosition() -- Position of edit-cursor
        else
            if followstate~="0" then -- follow mode is active
                pos= reaper.GetPlayPosition() -- Position of play-cursor
            else
                pos= reaper.GetCursorPosition() -- Position of edit-cursor
            end
        end
    elseif cursortype== "Edit cursor" then
        pos= reaper.GetCursorPosition() -- Position of edit-cursor
    elseif cursortype=="Play cursor" then
        pos= reaper.GetPlayPosition() -- Position of play-cursor
    end
    return pos
end

-- main:

-- mute
if (mutetype~="") and ((reaper.GetPlayState() &1) == 1) then -- only if playing/recording
    ultraschall.ActivateMute(tracknumber, true) -- activate/show mute track
    trackid = reaper.GetTrack(0,tracknumber-1) -- GetTrack count is zero based
    current_position=get_cursor_position_at_selected_cursor_type(cursor)

    if down=="1" then ultraschall.SetTrackAutomodeState(tracknumber, 3) end -- set to record mode 3

    if mutetype=="mute" then
        reaper.SetMediaTrackInfo_Value(trackid, 'B_MUTE', 1.0)
    elseif mutetype=="unmute" then
        if (reaper.GetPlayState() &4) == 4 then
           ultraschall.SetTrackAutomodeState(tracknumber, 2) -- set to touch mode
           reaper.SetMediaTrackInfo_Value(trackid, 'B_MUTE', 0.0)
        end
    elseif mutetype=="PTTmute" then
        if (reaper.GetPlayState() &4) == 4 then
            ultraschall.SetTrackAutomodeState(tracknumber, 2) -- set to touch mode
        end
        reaper.SetMediaTrackInfo_Value(trackid, 'B_MUTE', 1.0)
    elseif mutetype=="PTTunmute" then
        reaper.SetMediaTrackInfo_Value(trackid, 'B_MUTE', 0.0)
    end

    if down=="0" then ultraschall.SetTrackAutomodeState(tracknumber, 0) end -- set to normal trim/read mode

--marker
elseif (markertype~="") then
    -- SET MARKER:
    current_position=get_cursor_position_at_selected_cursor_type(cursor)
    markercount=ultraschall.CountNormalMarkers_NumGap()
    if current_position+markeroffset<0 then current_position=-markeroffset end

    if markertype=="custom" then        
        retval = ultraschall.AddCustomMarker(markertext, current_position+markeroffset, "", markercount, convert_color_hex2rgb(markercolor))
    elseif markertype=="chapter" then
        reaper.AddProjectMarker2(0, false, current_position+markeroffset, 0, "", markercount, 0)
    elseif markertype=="chapter_enter_name" then
        retval, markername = reaper.GetUserInputs("Insert chapter marker", 1, "Name of this chapter marker:", "") -- User input box
        if retval == true then -- User pressed ok
            reaper.AddProjectMarker2(0, false, current_position+markeroffset, 0, markername, markercount, 0)
        end
    elseif markertype=="marker_with_timestamp" then
        function CreateDateTime(time)
            local D=os.date("*t",time)
            if D.day<10 then D.day="0"..D.day else D.day=tostring(D.day) end
            if D.month<10 then D.month="0"..D.month else D.month=tostring(D.month) end
            if D.hour<10 then D.hour="0"..D.hour else D.hour=tostring(D.hour) end
            if D.min<10 then D.min="0"..D.min else D.min=tostring(D.min) end
            if D.sec<10 then D.sec="0"..D.sec else D.sec=tostring(D.sec) end
            local Date=D.year.."-"..D.month.."-"..D.day
            local Time=D.hour..":"..D.min..":"..D.sec
            return Date.."T"..Time
        end
        reaper.AddProjectMarker2(0, false, current_position+markeroffset, 0, "_Time: "..CreateDateTime(), 0, convert_color_hex2rgb(markercolor))
    elseif markertype=="edit_marker" then
        reaper.AddProjectMarker2(0, false, current_position+markeroffset, 0, "_Edit", 0, reaper.ColorToNative(255, 0, 0) | 0x1000000)
    end
    runcommand("_Ultraschall_Center_Arrangeview_To_Cursor") -- scroll to cursor if not visible

-- soundboard
elseif (soundboardaction~="") then
    if (soundboardaction=="playstop") then
        note = -1
    elseif soundboardaction=="playpause"then
        note = 23
    elseif (soundboardaction=="playfadeout") then
        note = 47
    elseif (soundboardaction=="play") then
        note = 71
    elseif (soundboardaction=="fadeinpause") then
        note = 95
    end
    
    note = note + soundboardplayernumber
    reaper.StuffMIDIMessage(0, 144, note, 1)
end

--cleanup
reaper.DeleteExtState("ultradeck", "mutetype",true)
reaper.DeleteExtState("ultradeck", "markertype",true)
reaper.DeleteExtState("ultradeck", "markertext",true)
reaper.DeleteExtState("ultradeck", "markercolor",true)
reaper.DeleteExtState("ultradeck", "markeroffset",true)
reaper.DeleteExtState("ultradeck", "cursor",true)
reaper.DeleteExtState("ultradeck", "down",true)
reaper.DeleteExtState("ultradeck", "soundboardaction",true)
reaper.DeleteExtState("ultradeck", "soundboardplayernumber",true)