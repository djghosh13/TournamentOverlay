from bs4 import BeautifulSoup
with open("index.html", 'r') as f:
    l = f.read()
    soup = BeautifulSoup(l, 'html.parser')

sInfo = soup.find("div", {"class": "song-info"})
next_song = soup.find("div", {"class": "next-song"})
title = soup.find("span", {"class": "title"})
left_score = soup.find("div", {"class": "score left"})
right_score = soup.find("div", {"class": "score right"})
left_stream = soup.find("div", {"class": "left stream"})
left_stream_title = left_stream.find("span", {"class": "stream-title"})
left_stream_iframe = left_stream.find("iframe")
right_stream = soup.find("div", {"class": "right stream"})
right_stream_title = right_stream.find("span", {"class": "stream-title"})
right_stream_iframe = right_stream.find("iframe")

things = {"next song": next_song, "title": title, "left score": left_score, "right score": right_score, 
"left stream title": left_stream_title, "right stream title": right_stream_title}

streams = {
    "Left stream": left_stream_iframe,
    "Right stream": right_stream_iframe
}
print(sInfo.getText())
sInfoSplit = sInfo.getText().split("\n")

songInfo = {
    "title": sInfoSplit[1].strip(),
    "artist": sInfoSplit[2].strip(),
    "BPM": sInfoSplit[3].strip(),
    "mapper": sInfoSplit[4].strip()
}

for k in songInfo.keys():
    print(k + ": " + songInfo[k])
    dat = input("Enter Song " + k + ": ")
    if len(dat) > 0:
        songInfo[k] = dat

sInfo.string = '\n'.join(["Song Name: " + songInfo['title'], "Artist: " + songInfo['artist'], "BPM: " + songInfo['BPM'], "Mapper: " + songInfo['mapper']])

print(str(sInfo))

for k in things.keys():
    print(things[k].string)
    new_string = input("Input string for: " + k + " (blank for no change): ")
    if len(new_string) > 0:
        things[k].string = new_string
    print(str(things[k]))

for st in streams.keys():
    print(streams[st]['src'])
    iFrameDat = input(st + " link (blank for no change): ")
    if len(iFrameDat) > 0:
        streams[st]['src'] = iFrameDat

with open("index.html", 'w') as f:
    f.write(str(soup))

print("Complete!")

