var MapData = {};

const SONG_FIELDS = ["artist", "bpm", "mapper", "difficulty", "njs"];

function pullLS(field, value) {
    if (field.find("input").val() != value) {
        field.find("input").val(value);
    }
}
function pushLS(field, key) {
    lswrite(key, field.find("input").val());
}

function lsread(key) {
    return localStorage.getItem("cvre_overlay_" + key);
}
function lswrite(key, value) {
    localStorage.setItem("cvre_overlay_" + key, value);
}

$(document).ready(function() {
    getMap();
    receiveAll();
    $("#casters input").keypress(function(event) {
        if (event.which == 13) {
            $(this).val($(this).val() + "<br />");
        }
    });
    $("select#song-title").change(function() {
        let songname = $(this).val();
        if (songname in MapData) {
            for (let key in MapData[songname]) {
                lswrite("song_" + key, MapData[songname][key]);
                pullLS($("#song-" + key), lsread("song_" + key));
            }
        }
    });
    $("select#next-song").change(function() {
        let songname = $(this).val();
        lswrite("nextsong", songname);
    });
    $("#submit").click(function() {
        // Global information
        pushLS($("#title"), "title");
        pushLS($("#casters"), "casters");
        lswrite("ntowin", Math.ceil($("#best-of").find("input").val() / 2));
        // Song information
        lswrite("song_title", $("#song-title").val());
        lswrite("nextsong", $("#next-song").val());
        for (let key of SONG_FIELDS) {
            pushLS($("#song-" + key), "song_" + key);
        }
        // Stream information
        for (let side of ["left", "right"]) {
            pushLS($("#streamer-" + side), side + "_streamer");
            pushLS($("#player-" + side), side + "_stream");
            pushLS($("#score-" + side), side + "_score");
        }
    });
});

function receiveAll() {
    let data = localStorage.getItem("cvre_overlay");
    if (data === null) activateLocalStorage();
    // Global information
    pullLS($("#title"), lsread("title"));
    pullLS($("#casters"), lsread("casters"));
    pullLS($("#best-of"), parseInt(lsread("ntowin"))*2 - 1);
    // Song information
    $("#song-title").val(lsread("song_title"));
    $("#next-song").val(lsread("nextsong"));
    for (let key of SONG_FIELDS) {
        pullLS($("#song-" + key), lsread("song_" + key));
    }
    // Stream information
    for (let side of ["left", "right"]) {
        pullLS($("#streamer-" + side), lsread(side + "_streamer"));
        pullLS($("#player-" + side), lsread(side + "_stream"));
        pullLS($("#score-" + side), lsread(side + "_score"));
    }
}

function getMap() {
    let menu = $("select#song-title");
    menu.html("");
    for (let key in MapData) {
        let option = document.createElement("option");
        $(option).attr("value", key);
        $(option).text(key);
        menu.append(option);
    }
    // Copy over
    $("select#next-song").html(menu.html());
}

function activateLocalStorage() {
    localStorage.setItem("cvre_overlay", "active");
    lswrite("title", "");
    lswrite("casters", "");
    lswrite("ntowin", 1);
    lswrite("nextsong", "Song");
    lswrite("song_title", "Song")
    for (let key of SONG_FIELDS) {
        lswrite("song_" + key, "");
    }
    for (let side of ["left", "right"]) {
        lswrite(side + "_streamer", "");
        lswrite(side + "_stream", "");
        lswrite(side + "_score", 0);
    }
}

function deactivateLocalStorage() {
    localStorage.removeItem("cvre_overlay");
}