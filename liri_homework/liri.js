var keys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: "b415dc12d4034fcb8f1fa13468e6bd3b",
    secret: "44098e2ae95c40f18ad85a6237019a70"
});


var getMyTweets = function() {

    var client = new Twitter(keys.twitterKeys);

    var params = { screen_name: 'juliekarnes' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(' ');
                console.log(tweets[i].text);
            }
        }
    });
}

var getArtistNames = function(artist) {
    return artist.name;
}


var getMeSpotify = function(songName) {

    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songs = data.tracks.items;

        for (var i = 0; i < songs.length; i++) {
            console.log(i);
            console.log('artist(s): ' + songs[i].artists.map(getArtistNames));
            console.log('song name: ' + songs[i].name);
            console.log('preview song: ' + songs[i].preview_url);
            console.log('album: ' + songs[i].album.name);
            console.log('-------------------------------------------------');
        }

    });
}

var getMeMovie = function(movieName) {

    request('http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&r=json', function(error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);

        var jsonData = JSON.parse(body);

        console.log('Title: ' + jsonData.Title);
        console.log('Year: ' + jsonData.Year);
        console.log('Rated: ' + jsonData.Rated);
        console.log('IMDB Rating: ' + jsonData.imdbRating);
        console.log('Country: ' + jsonData.Country);
        console.log('Language: ' + jsonData.Language);
        console.log('Plot: ' + jsonData.Plot);
        console.log('Actors: ' + jsonData.Actors);
        console.log('Rotton Tomatoes URL: ' + jsonData.tomatoURL);
    });
}

var doWhatItSays = function() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) throw err;

        var dataArr = data.split(',');

        if (dataArr.length == 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
            pick(dataArr[0]);
        }
    });
}

var pick = function(caseData,
    functionData) {
    switch (caseData) {
        case 'my-tweets':
            getMyTweets();
            break;
        case 'spotify-this-song':
            getMeSpotify(functionData);
            break;
        case 'movie-this':
            getMeMovie(functionData);
        case 'do-what-it-says':
            doWhatItSays();
        default:
            console.log('Liri does not know that');
    }
}

var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);