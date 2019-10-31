//https://dimparato.github.io/Portfolio/index.html
require("dotenv").config();
var keys = require("./keys.js");
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var commandLine = process.argv;
var choice;
var search;

if(commandLine.length < 3) {
    inquirer.prompt([{
            type: "list",
            name: "choice",
            message: "What do you want me to do?",
            choices: ["movie-this", "spotify-this-song", "concert-this"],
        },
    ])
    .then(answers => {
        console.info("Answer: ", answers.choice);
        choice = answers.choice;
        inquirer.prompt([{
                name: "search",
                message: "Okay, name it:",
            },
        ])
        .then(answers => {
            console.info("Answer: ", answers.search);
            search = answers.search;
            searchToggle();
        });
    });
}
else {
    choice = commandLine[2];
    if(commandLine.length > 3) {
        commandLine.splice(0,3);
        search = commandLine.join(" ");
    }
    searchToggle();
}

function searchToggle() {
    switch(choice) {
        case "do-what-it-says":
            searchFromFile();
            break;
        case "movie-this":
            searchMovie(search);
            break;
        case "spotify-this-song":
            searchSong(search);
            break;
        case "concert-this":
            searchConcert(search);
            break;
        default:
            console.log("\nWAT???\n\nHi, I'm Liri.\nHere are my commands:\n'do-what-it-says' (loads info from 'random.txt')\n'movie-this' [movie title]\n'spotify-this-song' [song]\n'concert-this' [artist/band name]\n");
    }
}

function searchMovie(movie) {
    if(!movie) {
        movie = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + movie)
        .then(function(response) {
            var movieData = "\n" + response.data.Title + "\n" + response.data.Year + "\nIMDB: " + response.data.Ratings[0].Value + "\nRotten Tomatoes: " + response.data.Ratings[1].Value + "\nLocations: " + response.data.Country + "\nLanguages: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nCast: " + response.data.Actors;
            console.log(movieData);
            fs.appendFile("log.txt", "\n" + moment().format("dddd, MMMM Do YYYY, h:mm:ss a") + "\n" + movieData + "\n", (error) => {
                if (error) throw error;
            });
        }).catch(function(error) {
            console.log(error);
    })
}

function searchSong(song) {
    if(!song) {
        song = "The Sign, Ace of Base";
    }
    spotify.search({type: "track", query: song})
        .then(function(response) {
            var songData = "\nArtist: " + response.tracks.items[0].artists[0].name + "\nTrack: " + response.tracks.items[0].name + "\nPreview: " + response.tracks.items[0].preview_url + "\nAlbum: " + response.tracks.items[0].album.name;
            console.log(songData);
            fs.appendFile("log.txt", "\n" + moment().format("dddd, MMMM Do YYYY, h:mm:ss a") + "\n" + songData + "\n", (error) => {
                if (error) throw error;
            });
        }).catch(function(error) {
            console.log(error);
    });
}

function searchConcert(concert) {
    if(!concert) {
        concert = "Gallagher";
    }
    axios.get("https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp")
        .then(function(response) {
            var concertData;
            fs.appendFile("log.txt", "\n" + moment().format("dddd, MMMM Do YYYY, h:mm:ss a") + "\n", (error) => {
                if (error) throw error;
            });
            fs.appendFile("log.txt", "\nSee " + concert + " on stage at...\n\n", (error) => {
                if (error) throw error;
            });
            console.log("\nSee " + concert + " on stage at...\n");
            for (let i = 0; i < response.data.length; i++) {
                concertData = response.data[i].venue.name + ", " + response.data[i].venue.city + ", " + response.data[i].venue.country + ", " + moment(response.data[i].datetime).format("MM/DD/YYYY");
                console.log(concertData);
                fs.appendFile("log.txt", concertData + "\n", (error) => {
                    if (error) throw error;
                });
            }
        }).catch(function(error) {
            console.log(error);
    })
}

function searchFromFile() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if(error) {
            return console.log(error);
        }
        var choiceSearch = data.split(",");
        console.log("\n" + choiceSearch);
        choice = choiceSearch[0];
        search = choiceSearch[1];
        searchToggle();
    });
}