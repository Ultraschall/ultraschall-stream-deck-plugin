if string.sub(reaper.GetOS(),1,3)=="OSX" then
  dofile(os.getenv("HOME").."/Library/Application Support/com.elgato.StreamDeck/Plugins/fm.ultraschall.ultradeck.sdPlugin/LUA/Ultraschall_StreamDeck_2.lua")
elseif string.sub(reaper.GetOS(),1,3)=="Win" then
  dofile(os.getenv("APPDATA")..[[\Elgato\StreamDeck\Plugins\fm.ultraschall.ultradeck.sdPlugin\LUA\Ultraschall_StreamDeck_2.lua]])
else
  reaper.ShowMessageBox("Stream Deck Plugin is only available on MacOS and Windows", "Wrong OS", 0)
end
