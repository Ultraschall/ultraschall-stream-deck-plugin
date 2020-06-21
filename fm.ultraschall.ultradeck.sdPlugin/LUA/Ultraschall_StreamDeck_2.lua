-- add this line to reaper-kb.ini:
-- SCR 4 0 Ultraschall_StreamDeck "Custom: Ultraschall: Streamdeck" ultraschall_streamdeck.lua

-- load Ultraschall API
dofile(reaper.GetResourcePath().."/UserPlugins/ultraschall_api.lua")

-- get ExtStates submittetd from StreamDeck Plugin and act accordingly
markertext=reaper.GetExtState("ultradeck", "markertext")
markercolor=reaper.GetExtState("ultradeck", "markercolor")
markeroffset=reaper.GetExtState("ultradeck", "markeroffset")
cursor=reaper.GetExtState("ultradeck", "cursor")

-- convert color:
if string.len(markercolor)==7 then
    r=tonumber(string.sub(markercolor,2,3), 16)
    g=tonumber(string.sub(markercolor,4,5), 16)
    b=tonumber(string.sub(markercolor,6,7), 16)
    markercolor=reaper.ColorToNative(r,g,b)|0x1000000
else
    markercolor=0
end

-- change "," to "." and convert to number:
markeroffset=string.gsub(markeroffset , "," , "." )
markeroffset=tonumber( markeroffset )

-- get position at selected cursor type
if cursor=="Automatic depending on followmode" then followstate=ultraschall.GetUSExternalState("ultraschall_follow", "state")
    if reaper.GetPlayState() == 0 or reaper.GetPlayState() == 2 then -- 0 = Stop, 2 = Pause
        current_position = reaper.GetCursorPosition() -- Position of edit-cursor
    else
        if followstate~="0" then -- follow mode is active
            current_position = reaper.GetPlayPosition() -- Position of play-cursor
        else
            current_position = reaper.GetCursorPosition() -- Position of edit-cursor
        end
    end
    runcommand("_Ultraschall_Center_Arrangeview_To_Cursor") -- scroll to cursor if not visible
elseif cursor=="Edit cursor" then
    current_position = reaper.GetCursorPosition() -- Position of edit-cursor
elseif cursor=="Play cursor" then
    print "play"
    current_position = reaper.GetPlayPosition() -- Position of play-cursor
end

--debug
--reaper.ShowConsoleMsg("text= "..markertext.." COLOR= "..markercolor.." offset= "..markeroffset.." cursor= "..cursor.."\n")
--reaper.ShowConsoleMsg("rgb="..r.." "..g.." "..b.."   -> "..tostring(color).."\n")

-- SET MARKER:
if current_position+markeroffset<0 then current_position=-markeroffset end
markercount=ultraschall.CountNormalMarkers_NumGap()
retval, markernumber, guid = ultraschall.AddCustomMarker(markertext, current_position+markeroffset, "", markercount, markercolor)

--cleanup
reaper.DeleteExtState("ultradeck", "markertext",true)
reaper.DeleteExtState("ultradeck", "markercolor",true)
reaper.DeleteExtState("ultradeck", "markeroffset",true)
reaper.DeleteExtState("ultradeck", "cursor",true)
