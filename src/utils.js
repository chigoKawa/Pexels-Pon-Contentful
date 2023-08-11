/**
 * Source: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_pick
 */
import { photoBaseUrl, videoBaseUrl, collectionBaseUrl } from "./constants";
import eventDispatcher from "./eventDispatcher";
export function pick(object, keys) {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
}

const baseUrls = {
  photo: photoBaseUrl,
  video: videoBaseUrl,
  collections: collectionBaseUrl,
};

export function createFetchWrapper(apiKey, type) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // "User-Agent": "Pexels/JavaScript",
      Authorization: apiKey,
    },
  };

  const baseUrl = baseUrls[type];

  return function (path, params) {
    return fetch(
      `${baseUrl}${path}?${stringifyParams(params || {})}`,
      options
    ).then(function (response) {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const headers = response.headers;
      const contentType = headers.get("content-type");
      const rateLimit = headers.get("X-Ratelimit-Limit");
      const rateLimitRemaining = headers.get("X-Ratelimit-Remaining");
      const rateLimitReset = headers.get("X-Ratelimit-Reset");
      const expires = headers.get("expires");

      eventDispatcher.dispatch(
        "messageChange",
        JSON.stringify({
          rateLimit,
          rateLimitRemaining,
          rateLimitReset,
          expires,
        })
      );

      // for (const [header, value] of response.headers.entries()) {
      //   console.log(`pexelin2 ${header}: ${value}`);
      // }

      return response.json();
    });
  };
}

function stringifyParams(params) {
  return Object.keys(params)
    .map(function (key) {
      return `${key}=${params[key]}`;
    })
    .join("&");
}

export function generatePhotoEndpoints(apiKey) {
  const fetchWrapper = createFetchWrapper(apiKey, "photo");

  return {
    search: function (params) {
      return fetchWrapper("/search", params);
    },
    curated: function (params) {
      params = params || {};
      return fetchWrapper("/curated", params);
    },
    show: function ({ id }) {
      return fetchWrapper(`/photos/${id}`);
    },
    random: async function () {
      const randomPage = Math.floor(1000 * Math.random());
      const response = await this.curated({ page: randomPage, per_page: 1 });
      return response.photos[0];
    },
  };
}
