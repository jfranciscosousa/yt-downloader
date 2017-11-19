const async = require("async");
const youtube = require("./youtube.js");

let queue = async.queue(({ url, mediaType }, callback) => {
  youtube
    .downloadUrl(url, mediaType)
    .then(data => callback(data))
    .catch(err => callback(err));
}, 4);

queue.drain = function() {
  console.log("All videos have been downloaded");
};

/**
 * Downloads a list of videos by puhsing them into a downloading queue
 *
 * @param {Array} urlList
 * @param {string} mediaType
 */
exports.downloadMediaList = function(urlList, mediaType) {
  let totalVideos = urlList.length;
  let videosDownloaded = 0;

  console.log(`Downloading ${totalVideos} videos, its going to take a while..`);

  urlList.forEach(url => {
    queue.push({ url, mediaType }, () => {
      videosDownloaded++;
      console.log(`Finished downloading ${url}`);
      console.log(`${videosDownloaded} out of ${totalVideos} downloaded`);
    });
  });
};
