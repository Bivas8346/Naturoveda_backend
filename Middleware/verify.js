const AdminModel = require('../Model/admin')
const mongoose = require('mongoose');

exports.verifyUser = (req,res,next)=>{
    AdminModel.findOne({
        email:req.body.email
    }).then((err, user)=>{
        if(err){
            req.flash('massage',"not able to find your email address");
            console.log('cano find the email address');
            res.redirect('/addmamber')
            return;
        }
        if(user){
            req.flash('massage',"email already exists")
            console.log('email already exists');
            res.redirect('/addmamber')
            return;
        }
        const password = req.body.password;
        const confirmPW = req.body.confirmpassword;
        if (password !== confirmPW) {
            console.log('password and confirm password are not same');
            req.flash('massage',"password and confirm password are not same")
            res.redirect('/addmamber')
            return;
        }
        next();
    }).catch((err)=>{
        console.log(err);
    })
}