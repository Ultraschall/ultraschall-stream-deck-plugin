-- add this line to reaper-kb.ini:
-- SCR 4 0 Ultraschall_StreamDeck "Custom: Ultraschall: Streamdeck" ultraschall_streamdeck.lua

-- load Ultraschall API
dofile(reaper.GetResourcePath().."/UserPlugins/ultraschall_api.lua")

-- get ExtStates submittetd from StreamDeck Plugin and act accordingly
markertype=reaper.GetExtState("ultradeck", "markertype")
markertext=reaper.GetExtState("ultradeck", "markertext") or ""
markercolor=reaper.GetExtState("ultradeck", "markercolor") or 0
markeroffset=reaper.GetExtState("ultradeck", "markeroffset") or "0,0"
    markeroffset=string.gsub(markeroffset , "," , "." )
    markeroffset=tonumber( markeroffset ) or 0
cursor=reaper.GetExtState("ultradeck", "cursor")
    if cursor==nil or cursor=="" then cursor= "Automatic depending on followmode" end

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

-- SET MARKER:
current_position=get_cursor_position_at_selected_cursor_type(cursor)
markercount=ultraschall.CountNormalMarkers_NumGap()
if current_position+markeroffset<0 then current_position=-markeroffset end

--print("type= "..markertype.."\ntext= "..markertext.."\nCOLOR= "..markercolor.."\noffset= "..markeroffset.."\ncursor= "..cursor.."\n\n")
--print(tostring(color).."\n")

if markertype=="custom" then        
    retval = ultraschall.AddCustomMarker(markertext, current_position+markeroffset, "", markercount, convert_color_hex2rgb(markercolor))
elseif markertype=="chapter" then
    reaper.AddProjectMarker2(0, false, current_position+markeroffset, 0, "", markercount, 0)
end
runcommand("_Ultraschall_Center_Arrangeview_To_Cursor") -- scroll to cursor if not visible

--cleanup
reaper.DeleteExtState("ultradeck", "markertype",true)
reaper.DeleteExtState("ultradeck", "markertext",true)
reaper.DeleteExtState("ultradeck", "markercolor",true)
reaper.DeleteExtState("ultradeck", "markeroffset",true)
reaper.DeleteExtState("ultradeck", "cursor",true)
