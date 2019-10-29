require("dotenv").config();
var keys = require("./keys.js");
var inquirer = require("inquirer");



var spotify = new Spotify(keys.spotify);