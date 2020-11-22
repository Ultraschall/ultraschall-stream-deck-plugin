-- add this line to reaper-kb.ini:
-- SCR 4 0 Ultraschall_StreamDeck "Custom: Ultraschall: Streamdeck" ultraschall_streamdeck.lua

-- load Ultraschall API
dofile(reaper.GetResourcePath().."/UserPlugins/ultraschall_api.lua")

-- get ExtStates submittetd from StreamDeck Plugin and act accordingly
mutetype=reaper.GetExtState("ultradeck", "mutetype") or false
tracknumber=reaper.GetExtState("ultradeck", "tracknumber")
    if (tracknumber=="") then tracknumber=1 end
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

function debug()
    print("Mutetype= "..mutetype)
    print("tracknumber= "..tracknumber)
    print("markertype= "..markertype)
    print("markertext= "..markertext)
    print("markercolor= "..markercolor)
    print("markeroffset= "..markeroffset)
    print("cursor= "..cursor)  
end

--debug()


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

if (mutetype~="") then
    current_position=get_cursor_position_at_selected_cursor_type(cursor)
    if mutetype=="mute" then
        ultraschall.ToggleMute(tracknumber, current_position, 0)
    elseif mutetype=="unmute" then
        ultraschall.ToggleMute(tracknumber, current_position, 1)
    elseif mutetype=="toggle_mute" then
        envIDX, envVal, envPosition = ultraschall.GetPreviousMuteState(tracknumber, current_position)
        if envVal==0 then 
            ultraschall.ToggleMute(tracknumber, current_position, 1)
        else
            ultraschall.ToggleMute(tracknumber, current_position, 0)
        end
    end
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
end

--cleanup
reaper.DeleteExtState("ultradeck", "mutetype",true)
reaper.DeleteExtState("ultradeck", "markertype",true)
reaper.DeleteExtState("ultradeck", "markertext",true)
reaper.DeleteExtState("ultradeck", "markercolor",true)
reaper.DeleteExtState("ultradeck", "markeroffset",true)
reaper.DeleteExtState("ultradeck", "cursor",true)
