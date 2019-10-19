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
    $(".mute.left").click(function() {
        muted["left"] = !muted["left"];
        changed["left"] = true;

        let url = muted["left"] ? "res/volume_muted.svg" : "res/volume.svg";
        $(this).attr("src", url);
    });
    $(".mute.right").click(function() {
        muted["right"] = !muted["right"];
        changed["right"] = true;

        let url = muted["right"] ? "res/volume_muted.svg" : "res/volume.svg";
        $(this).attr("src", url);
    });
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
            $("#player-" + side).attr("src",
                "https://player.twitch.tv/?autoplay=true&channel=" + lsread(side + "_stream") + "&muted=" + muted[side]
            );
            changed[side] = false;
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