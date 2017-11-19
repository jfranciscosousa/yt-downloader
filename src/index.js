#!/usr/bin/env node

let fs = require("fs");
let _ = require("underscore");
let youtube = require("./youtube.js");
let playlist = require("./playlist.js");
let videoQueue = require("./queue.js");
const commandLineCommands = require("command-line-commands");

const validCommands = ["playlist_audio", "playlist_video", "file_audio", "file_video", "video", "audio", null];
const { command, argv } = commandLineCommands(validCommands);

if (!fs.existsSync("./media")) {
  fs.mkdirSync("./media");
}

switch (command) {
  case "playlist_audio": {
    playlist
      .getPlaylistVideos(argv[0])
      .then(videos => videoQueue.downloadMediaList(videos, "audio"))
      .catch(error => console.error("Invalid playlist url"));
    break;
  }

  case "playlist_video": {
    playlist
      .getPlaylistVideos(argv[0])
      .then(videos => videoQueue.downloadMediaList(videos, "video"))
      .catch(error => console.error("Invalid playlist url"));
    break;
  }

  case "file_audio": {
    downloadFromFile("audio");
    break;
  }

  case "file_video": {
    downloadFromFile("video");
    break;
  }

  case "audio": {
    youtube
      .downloadUrl(argv[0], "audio")
      .then(title =>
        console.log("Finished downloading and converting " + title)
      )
      .catch(err => console.log(err));
    break;
  }

  case "video": {
    youtube
      .downloadUrl(argv[0], "video")
      .then(title =>
        console.log("Finished downloading and converting " + title)
      )
      .catch(err => console.log(err));
    break;
  }

  default:
    console.log("Usage:");
    console.log("yt-downloader audio <audio url> | downloads audio only");
    console.log("yt-downloader video <video url> | downloads a video");
    console.log(
      "yt-downloader playlist_audio <playlist url> | download a playlist converting them to audio files"
    );
    console.log(
      "yt-downloader playlist_video <playlist url> | download a playlist converting them to video files"
    );
    console.log(
      "yt-downloader file <file location> | download a list of links from a file"
    );
}

/**
 * This function downloads the videos specified on a file, given a certain media type
 * @param {string} mediaType
 */
function downloadFromFile(mediaType) {
  fs.readFile(argv[0], "utf8", function(err, data) {
    if (err) {
      if (err.code == "ENOENT") {
        console.log("File doesn't exist!");
      }
      console.log(err.message);
    } else {
      let videos = _.uniq(
        data
          .trim()
          .split("\n")
          .map(val => val.trim())
      );
      videoQueue.downloadMediaList(videos, mediaType);
    }
  });
}
