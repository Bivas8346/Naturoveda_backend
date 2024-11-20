const express = require("express");
const Router = express.Router();
const adminController = require("../Controller/adminController");
const verify = require("../Middleware/verify");
const userAuth = require("../Middleware/adminAuth");
const {onliAdminAccess} = require("../Middleware/adminAccess");
const {secondAdminAccess}=require("../Middleware/adminAccess");
const UplodaMulti = require("../Middleware/multipleImage");
const uploadSingle = require("../Middleware/singleImage");
Router.use(userAuth.jwAuth);



// main dashboard section
Router.get('/',adminController.userAuth,adminController.dashboard);
// mamber registration section
Router.get('/addmamber',adminController.userAuth,onliAdminAccess,adminController.addmamber);
Router.post('/addmamber/create',[verify.verifyUser],uploadSingle.single("image"),adminController.admincreate);
// admin login section
Router.get('/log',adminController.adminlog);
Router.post('/log/create',adminController.Logcreate);
// Update Secction
Router.get('/updatePass',adminController.updatePass);
// Forget Section
Router.get('/forget',adminController.resetPassword);
Router.post('/resetpassword',adminController.forgetpassword);
Router.get('/setPassword',adminController.newPassword);
Router.get('/VerifyPassword/:token',adminController.verifytoken);
Router.post('/ResetPassword/:token',adminController.updatePassword);
// Admin list section
Router.get('/list',adminController.userAuth,onliAdminAccess,adminController.Adminlist);
Router.get('/admindelete/:id',adminController.adminDelete);
Router.get('/editlist/:id',adminController.userAuth,adminController.editmamber);
Router.post('/updatelist',uploadSingle.single("image"),adminController.updatemamber);
// log Out Section
Router.get('/logout',adminController.logout);
// Admin banner section
Router.get('/banneradd',adminController.userAuth,secondAdminAccess,adminController.Banner);
Router.post('/banneradd/create',uploadSingle.single("image"),adminController.homeCreate);
Router.get('/bannerDelete/:id',adminController.bannerDelete);
// Specialites add Section
Router.get('/specialites',adminController.userAuth,secondAdminAccess,adminController.Specialites);
Router.post('/specialites/create',adminController.specialitesCreate);
Router.get('/specialitesedit/:id',adminController.editspecilites);
Router.post('/specialitesupdate',adminController.updatespecilites);
// Treatment add section
Router.get('/treatment',adminController.userAuth,secondAdminAccess,adminController.Treatment);
Router.post('/treatment/create',adminController.treatmentCreate);
Router.get('/treatmentedit/:id',adminController.edittreatment);
Router.post('/treatmentupdate',adminController.updatetreatment);
// Disease add section
Router.get('/disease',adminController.userAuth,secondAdminAccess,adminController.Disease);
Router.post('/disease/create',adminController.diseaseCreate);
Router.get('/diseaseedit/:id',adminController.editdisease);
Router.post('/diseaseupdate',adminController.updatedisease);
Router.get('/diseaseDelete/:id',adminController.diseaseDelete);
// New Specialites Section
Router.get('/newspecialites',adminController.userAuth,secondAdminAccess,adminController.newspecilites);
Router.post('/newspecialites/create',adminController.newSpecialCreate);  
// New Disease add section
Router.get('/newdisease',adminController.userAuth,secondAdminAccess,adminController.Diseases);
Router.get('/formdisease',adminController.DiseasesForm);
Router.post('/newdisease/create',adminController.DiseasesCreate);
// Testimonials add section
Router.get('/testimonials',adminController.userAuth,secondAdminAccess,adminController.Testimonials);
Router.post('/testimonials/create',adminController.testimonialsCreate);
Router.get('/testimonialsDelete/:id',adminController.testimonialsDelete);
// Uniqueness add section
Router.get('/uniqueness',adminController.userAuth,secondAdminAccess,adminController.Uniqueness);
Router.post('/uniqueness/create',adminController.uniquenessCreate);
Router.get('/uniqedit/:id',adminController.edituniqueness);
Router.post('/uniquenessupdate',adminController.updateuniqueness);
Router.get('/uniqDelete/:id',adminController.uniquenessDelete);
// Blog add section
Router.get('/blog',adminController.userAuth,secondAdminAccess,adminController.Blog);
Router.post('/blog/create',adminController.blogCreate);
Router.get('/blogDelete/:id',adminController.blogDelete);
// Blog comment Part
Router.get('/blogcomment',adminController.userAuth,adminController.Comment);
Router.get('/commentDelete/:id',adminController.commentDelete);
// Contact Notifiacton sectionn
Router.get('/notification',adminController.userAuth,adminController.Notification);
Router.get('/notificationDelete/:id',adminController.noticDelete);

module.exports = Router;