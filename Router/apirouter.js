const express = require("express");
const Route = express.Router();
const apiController = require("../Controller/apiController");
const body_parser = require("body-parser");

Route.use(body_parser.json());
Route.use(body_parser.urlencoded({ extended: true }));

// Home Section
Route.get('/banner',apiController.homeView);
// Blog Section
Route.get('/blog',apiController.blogView);
Route.get('/singleblog/:id',apiController.singleBloge);
// Comment Section
Route.post('/comment',apiController.createComment);
Route.get('/getcomment',apiController.getComment);
// Testimonials Section
Route.get('/testimonials',apiController.testimonialsView);
// Contact Section
Route.post('/contact',apiController.createContact);
// Uniqueness Section
Route.get('/uniqueness',apiController.uniquenessView);
Route.get('/singleuniq/:id',apiController.singleUniqueness);
// Disease section
Route.get('/disease',apiController.diseaseView);
// Treatment Secttion
Route.get('/treatment',apiController.treatmentView);

module.exports = Route;