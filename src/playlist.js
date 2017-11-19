let axios = require("axios").default;
let util = require("util");
let apiKey = "AIzaSyA1Zv7gKh5pSX67ylmUygUx0vWUQeAXCjo";

const playlistItemURL = "https://www.googleapis.com/youtube/v3/playlistItems";
const URLFormat = "%s?part=contentDetails&maxResults=%s&playlistId=%s&key=%s";

/**
 * Synchrousnly populates an array with video IDs from a youtube playlist
 *
 * @param {string} id The ID of the playlist
 * @return {Promise}
 */
exports.getPlaylistVideos = async id => {
  let videos = [];
  let pageToken;
  let done = false;

  while (!done) {
    let playlistData = (await getPlaylistItems(id, 1, pageToken)).data;

    playlistData.items.forEach(item => {
      videos.push(idToUrl(item.contentDetails.videoId));
    });

    pageToken = playlistData.nextPageToken;

    if (!pageToken) done = true;
  }

  return videos;
};

/**
 * Auxiliary function to convert a youtube id to a full url
 *
 * @param {string} id The ID of the video
 * @return {string} string The full video URL
 */
function idToUrl(id) {
  return "https://www.youtube.com/watch?v=" + id;
}

/**
 * Gets the metadata of a playlist items
 *
 * @param {string} id The ID of the playlist
 * @param {string} maxResults Number of max results to return
 * @param {string} pageToken The token of the page we want to access
 * @return {Promise} the video IDs
 */
function getPlaylistItems(id, maxResults, pageToken) {
  let url = util.format(URLFormat, playlistItemURL, maxResults, id, apiKey);

  if (pageToken) url = url.concat(`&pageToken=${pageToken}`);

  return axios.get(url);
}
