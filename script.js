var currentStream = {
    "left": "",
    "right": ""
};
var muted = {
    "left": true,
    "right": true
};
var changed = {
    "left": true,
    "right": true
};
var players = {
    "left": null,
    "right": null
};

function pullLS(field, value) {
    if (field.html() != value) {
        field.html(value);
    }
}

function lsread(key) {
    return localStorage.getItem("cvre_overlay_" + key);
}

$(document).ready(function() {
    setInterval(updateAll, 1000);

    players["left"] = new Twitch.Player("player-left", { "channel":"" });
    players["right"] = new Twitch.Player("player-right", { "channel":"" });

    for (let side of ["left", "right"]) {
        $(".mute." + side).click(function() {
            muted[side] = !muted[side];
            players[side].setMuted(muted[side]);

            let url = muted[side] ? "res/volume_muted.svg" : "res/volume.svg";
            $(this).attr("src", url);
        });
    }
});

function updateAll() {
    let data = localStorage.getItem("cvre_overlay");
    if (data === null) return;
    // Global information
    pullLS($("#title"), lsread("title"));
    pullLS($("#casters"), lsread("casters"));
    pullLS($("#next-song"), lsread("nextsong"));
    // Song information
    for (let key of ["title", "artist", "bpm", "mapper", "difficulty", "njs"]) {
        pullLS($("#song-" + key), lsread("song_" + key));
    }
    // Stream information
    for (let side of ["left", "right"]) {
        pullLS($("#streamer-" + side), lsread(side + "_streamer"));
        if (currentStream[side] != lsread(side + "_stream") || changed[side]) {
            currentStream[side] = lsread(side + "_stream");
            changed[side] = false;
            // Update player
            players[side].setChannel(currentStream[side]);
            players[side].play();
        }
        pullLS($("#score-" + side), lsread(side + "_score"));
        let npoints = parseInt(lsread("ntowin"));
        $(".points." + side).html("");
        for (let i = 1; i <= npoints; i++) {
            let point = document.createElement("div");
            point.classList.add("point");
            if (lsread(side + "_score") >= i) {
                point.classList.add("on");
            }
            $(".points." + side).append(point);
        }
    }
}