const path = require("path");
const AdminModel = require("../Model/admin");
const HomeModel = require("../Model/home");
const SpecModel = require("../Model/specialities");
const TreatmentModel = require("../Model/treatment");
const DiseaseModel = require("../Model/disease");
const TestimonialsModel = require("../Model/testimonials");
const UniquenessModel = require("../Model/uniqueness");
const BlogModel = require("../Model/blog");
const CommentModel = require("../Model/comment");
const ContactModel = require("../Model/contact");
const TokenModel = require("../Model/token");
// New Part Start
const DiseasesModel = require("../Model/diseases");
const SpecialitesModel = require("../Model/newspecilities");
// New Part End
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const passwordMailer = require("../Middleware/passwordMailer");
const crypto = require("crypto");
const randomstring = require("randomstring");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const { title } = require("process");

// main dashboard section
exports.dashboard = (req, res) => {
  res.render("dashboard", { title: "Admin Dashboard", data: req.user,message:req.flash('message') });
  // AdminModel.find()
  //   .then((result) => {
  //     res.render("dashboard", { title: "Admin Dashboard", admin: result });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
};

// mamber registration section
exports.addmamber = (req, res) => {
  res.render("adminreg", { title: "Admin Add Member", data: req.user,Message:req.flash('message') });
};

exports.admincreate = (req, res) => {
  const newreg = new AdminModel({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    admin: req.body.admin,
    type: req.body.type,
    password: bcryptjs.hashSync(req.body.password, bcryptjs.genSaltSync(6)),
  });
  if (req.file) {
    newreg.image = req.file.path;
  }
  newreg
    .save()
    .then((data) => {
      if (data) {
        req.flash("massage", "New Admin Added....");
        console.log("New Admin Added......");
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// Admin login section
exports.adminlog = (req, res) => {
  res.render("adminlog", { title: "Admin Login",message:req.flash('message') });
};

exports.Logcreate = (req, res) => {
  console.log("Email received:", req.body.email);

  AdminModel.findOne({ email: req.body.email })
    .then((data) => {
      if (data) {
        if (data.admin === "true") {
          const pwd = data.password;
          if (bcryptjs.compareSync(req.body.password, pwd)) {
            const token = jwt.sign(
              {
                id: data._id,
                email: data.email,
                name: data.name,
                phone: data.phone,
                image: data.image,
                admin: data.admin,
                type: data.type,
              },
              "ADMINNATURO2024",
              { expiresIn: "12h" }
            );
            console.log(token);
            console.log(data.name);
            res.cookie("userToken", token);
            res.cookie("name", data.name);
            res.cookie("phone", data.phone);
            res.cookie("email", data.email);
            res.cookie("image", data.image);
            res.cookie("admin", data.admin);
            res.type("type", data.type);
            res.redirect("/");
          } else {
            req.flash("message", "Password not match");
            console.log("Password not match");
            res.redirect("/log");
          }
        } else {
          req.flash("message", "You are not admin matched");
          console.log("admin not matched");
          res.redirect("/log");
        }
      }
    })
    .catch((err) => {
      console.log(err, "User Not Found");
      req.flash("message", "An error occured, pls try again later");
      res.redirect("/log");
    });
};

// Admin Auth Section
exports.userAuth = (req, res, next) => {
  if (req.user) {
    console.log(req.user);
    next();
  } else {
    console.log("Not Authienticat");
    res.redirect("/log");
  }
};
// Reset Password Section
exports.resetPassword = (req, res) => {
  res.render("forgetpassword", { title: "Reset Password Form" });
};

exports.newPassword = (req, res) => {
  res.render("setpassword", { title: "New Password Form" });
};

exports.updatePass = (req, res) => {
  res.render("updatePassword", { title: "Password Update Form" });
};

exports.updatepassword = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const password = req.body.password;

    const data = await AdminModel.findOne({ _id: user_id });
    if (data) {
      const newPassword = await securePassword(password);
      const userData = await AdminModel.findByIdAndUpdate(
        { _id: user_id },
        {
          $set: {
            password: newPassword,
          },
        }
      );

      res
        .status(201)
        .send({ success: true, msg: "your password hasbeen updated" });
    } else {
      res.status(400).send({ succses: false, msg: "user id Not found" });
    }
  } catch (error) {
    res.status(400).send(error, message);
  }
};

exports.updatePassword = (req, res) => {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  AdminModel.findById(req.user.id)
    .then((admin) => {
      if (!admin) {
        req.flash("message", "Admin not found");
        res.redirect("/");
      }

      const isMatch = bcryptjs.compareSync(currentPassword, admin.password);
      if (!isMatch) {
        console.log("Current password is not match");
        req.flash("message", "Current password is not Matched");
        res.redirect("/");
      }

      admin.password = bcryptjs.hashSync(newPassword, bcryptjs.genSaltSync(6));

      admin.save().then(() => {
        console.log("password Updated Successfully");
        req.flash("message", "Password updated successfully");
        res.redirect("/");
      });
    })
    .catch((error) => {
      console.error("Error updating password:", error);
      req.flash("message", "An error occurred. Please try again later.");
      res.redirect("/");
    });
};

exports.forgetpassword = (req, res) => {
  const { email } = req.body;

  AdminModel.findOne({ email })
    .then((admin) => {
      if (!admin) {
        console.log("Admin Data not found");
        req.flash("message", "Admin not found");
        return res.redirect("/forget");
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      const resetTokenExpires = Date.now() + 3600000; // Token valid for 1 hour

      admin.token = resetPasswordToken;
      admin.resetPasswordExpires = resetTokenExpires;

      console.log(resetToken, resetPasswordToken);
      admin.save();

      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/VerifyPassword/${resetToken}`;
      const message = `Reset your password by clicking the link: ${resetURL}`;

      const transporter = nodemailer.createTransport({
        service: "No-replyBivasdas@gmail.com", // or your email service
        auth: {
          user: "bivasdas005@gmail.com",
          pass: "gwfniqmpthmrngmh",
        },
      });

      transporter.sendMail({
        to: admin.email,
        subject: "Password Reset Request",
        text: message,
      });
      console.log("mail send to the email");

      req.flash("message", "Password reset link sent to your email");
      res.redirect("/log");
    })
    .catch((error) => {
      console.log(error);
      req.flash("message", "An error occurred. Please try again later.");
      res.redirect("/log");
    });
};

exports.verifytoken = (req, res) => {
  const { token } = req.params;

  res.render("setpassword", { title: "New Password Form", token }); // Assuming you have a 'reset-password' view template
};

exports.updatePassword = (req, res) => {
  const token = req.params.token;
  const newPassword = req.body.newPassword;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  AdminModel.findOne({
    token: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .then((data) => {
      if (!data) {
        console.log("Token Expired or not Valide");
        req.flash("message", "Token is invalid or expired");
        res.redirect("/forget");
      }

      data.password = bcryptjs.hashSync(newPassword, bcryptjs.genSaltSync(6));
      data.token = undefined;
      data.resetPasswordExpires = undefined;
      data.passwordChangeAt = Date.now();

      data.save().then(() => {
        console.log("Password Reset Done");
        req.flash("message", "Password has been reset successfully");
        res.redirect("/log");
      });
    })
    .catch((error) => {
      console.log(error);
      req.flash("message", "An error occurred. Please try again later.");
      return res.redirect("/setPassword");
    });
};

// log out Section
exports.logout = (req, res) => {
  res.clearCookie("userToken");
  res.clearCookie("name");
  res.clearCookie("email");
  res.clearCookie("phone");
  res.clearCookie("image");
  console.log("Log Out Successfully");
  req.flash("message","Logout SuccessFully")
  res.redirect("/log");
};

// Admin list section
exports.Adminlist = (req, res) => {
  AdminModel.find()
    .then((result) => {
      res.render("mamberlist", {
        title: "All Mamber List",
        data: req.user,
        admin: result,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.adminDelete = (req, res) => {
  const uid = req.params.id;
  AdminModel.deleteOne({ _id: uid })
    .then((del) => {
      console.log(del, "delete successfully");
      res.redirect("/list");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.editmamber = (req, res) => {
  // res.render("editmamber", { title: "Admin Edit Member", data: req.user });

  const pid = req.params.id;
  AdminModel.findById(pid)
    .then((admin) => {
      console.log(admin);
      res.render("editmamber", {
        title: "Admin Edit Member",
        data: req.user,
        admin,
      });
    })
    .catch((err) => {
      res.render("editmamber", { error: "error occured,Cant fetch" });
    });
};

exports.updatemamber = (req, res) => {
  const user_id = req.body.u_id;
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const admin = req.body.admin;
  const type = req.body.type;
  const image = req.file ? req.file.filename : null;

  AdminModel.findById(user_id)
    .then((result) => {
      result.name = name;
      result.email = email;
      result.phone = phone;
      result.admin = admin;
      result.type = type;
      if (image) {
        result.image = `Image/${image}`;
      }
      return result
        .save()
        .then((result) => {
          res.redirect("/list");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Admin banner section
exports.Banner = (req, res) => {
  // res.render("bannercreate", { title: "Add Banner", data: req.user });
  HomeModel.find()
    .then((result) => {
      res.render("bannercreate", {
        title: "Add Banner",
        data: req.user,
        banner: result,
        message:req.flash('message')
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.homeCreate = (req, res) => {
  const Hcreate = new HomeModel({
    title: req.body.title,
    description: req.body.description,
  });
  if (req.file) {
    Hcreate.image = req.file.path;
  }
  Hcreate.save()
    .then((data) => {
      if (data) {
        console.log("Banner Add Successfully");
        req.flash('message', 'Banner Add Successfully');
        res.redirect("/banneradd");
      }
    })
    .catch((err) => {
      console.log(err, "Banner not Added");
      req.flash('message',"banner not added")
      res.redirect("/banneradd");
    });
};

exports.bannerDelete = (req, res) => {
  const uid = req.params.id;
  HomeModel.deleteOne({ _id: uid })
    .then((del) => {
      console.log(del, "delete successfully");
      req.flash('message',"Banner Data Deleted Successfully")
      res.redirect("/banneradd");
    })
    .catch((err) => {
      console.log(err);
    });
};
// Specialites add Section
exports.Specialites = (req, res) => {
  // res.render("specialites", { title: "Specialites Add Form", data: req.user });
  SpecModel.find()
    .then((result) => {
      res.render("specialites", {
        title: "Specialites Add Form",
        data: req.user,
        specil: result,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.specialitesCreate = (req, res) => {
  const Screate = new SpecModel({
    title: req.body.title,
  });
  Screate.save()
    .then((data) => {
      if (data) {
        console.log("Specialites Add Successfully");
        res.redirect("/specialites");
      }
    })
    .catch((err) => {
      console.log(err, "Specialites not Added");
      res.redirect("/specialites");
    });
};

exports.editspecilites = (req, res) => {
  const pid = req.params.id;
  SpecModel.findById(pid)
    .then((specil) => {
      console.log(specil);
      res.render("editspecilites", {
        title: "specilites Edit",
        data: req.user,
        specil,
      });
    })
    .catch((err) => {
      res.render("editspecilites", { error: "error occured,Cant fetch" });
    });
};

exports.updatespecilites = (req, res) => {
  const user_id = req.body.u_id;
  const title = req.body.title;

  SpecModel.findById(user_id)
    .then((result) => {
      result.title = title;
      return result
        .save()
        .then((result) => {
          res.redirect("/specialites");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
// New Specialites Section
exports.newspecilites = (req, res) => {
  DiseasesModel.find().then((result2) => {
    SpecialitesModel.find()
      .then((result) => {
        res.render("newSpecilites", {
          title: "Specialites Add Form",
          data: req.user,
          special: result,
          Diseas: result2,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
exports.newSpecialCreate = (req,res)=>{
  const Acreate = new SpecialitesModel({
    title: req.body.title,
    diseasesid: req.body.diseasesid,
  });
  Acreate.save()
    .then((data) => {
      if (data) {
        console.log("Treatment Add Successfully");
        res.redirect("/newspecialites");
      }
    })
    .catch((err) => {
      console.log(err, "Treatment not Added");
      res.redirect("/newspecialites");
    });
}

// Treatment add section
exports.Treatment = (req, res) => {
  TreatmentModel.find().then((result2) => {
    SpecModel.find()
      .then((result) => {
        res.render("treatment", {
          title: "Treatment Add Form",
          data: req.user,
          spec: result,
          treat: result2,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

exports.treatmentCreate = (req, res) => {
  const Acreate = new TreatmentModel({
    treatment: req.body.treatment,
    specialitiesid: req.body.specialitiesid,
  });
  Acreate.save()
    .then((data) => {
      if (data) {
        console.log("Treatment Add Successfully");
        res.redirect("/treatment");
      }
    })
    .catch((err) => {
      console.log(err, "Treatment not Added");
      res.redirect("/treatment");
    });
};

exports.edittreatment = (req, res) => {
  const pid = req.params.id;
  TreatmentModel.findById(pid)
    .then((treat) => {
      console.log(treat);
      res.render("edittreatment", {
        title: "Treatment Edit",
        data: req.user,
        treat,
      });
    })
    .catch((err) => {
      res.render("edittreatment", { error: "error occured,Cant fetch" });
    });
};

exports.updatetreatment = (req, res) => {
  const user_id = req.body.u_id;
  const treatment = req.body.treatment;

  TreatmentModel.findById(user_id)
    .then((result) => {
      result.treatment = treatment;
      return result
        .save()
        .then((result) => {
          res.redirect("/treatment");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
// Disease add section
exports.Disease = (req, res) => {
  DiseaseModel.find()
    .then((result3) => {
      SpecModel.find().then((result2) => {
        TreatmentModel.find().then((result) => {
          res.render("disease", {
            title: "Disease Add Form",
            data: req.user,
            treatment: result,
            spec: result2,
            disease: result3,
          });
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.diseaseCreate = (req, res) => {
  const Dcreate = new DiseaseModel({
    disease_title: req.body.disease_title,
    disease_description: req.body.disease_description,
    image: req.body.image,
    treatmentid: req.body.treatmentid,
    specialitiesid: req.body.specialitiesid,
  });
  Dcreate.save()
    .then((data) => {
      if (data) {
        console.log("Disease Add Successfully");
        res.redirect("/disease");
      }
    })
    .catch((err) => {
      console.log(err, "Disease not Added");
      res.redirect("/disease");
    });
};

exports.editdisease = (req, res) => {
  const pid = req.params.id;
  DiseaseModel.findById(pid)
    .then((dise) => {
      console.log(dise);
      res.render("editdisease", {
        title: "Disease Edit",
        data: req.user,
        dise,
      });
    })
    .catch((err) => {
      res.render("editdisease", { error: "error occured,Cant fetch" });
    });
};

exports.updatedisease = (req, res) => {
  const user_id = req.body.u_id;
  const disease_title = req.body.disease_title;
  const disease_description = req.body.disease_description;
  const image = req.body.image;

  DiseaseModel.findById(user_id)
    .then((result) => {
      result.disease_title = disease_title;
      result.disease_description = disease_description;
      result.image = image;

      return result
        .save()
        .then((result) => {
          res.redirect("/disease");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.diseaseDelete = (req, res) => {
  const uid = req.params.id;
  DiseaseModel.deleteOne({ _id: uid })
    .then((del) => {
      console.log(del, "delete successfully");
      res.redirect("/disease");
    })
    .catch((err) => {
      console.log(err);
    });
};
// New Disease Section
exports.Diseases = (req, res) => {
  DiseasesModel.find()
    .then((result) => {
      res.render("newdisease", {
        title: "Disease View Page",
        data: req.user,
        disc: result,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.DiseasesForm = (req, res) => {
  res.render("newdiseasesForm", { title: "Disease Add Form", data: req.user });
};
exports.DiseasesCreate = (req, res) => {
  const Discreate = new DiseasesModel({
    title: req.body.title,
    sub_title: req.body.sub_title,
    description: req.body.description,
    treatment: req.body.treatment,
    specialities: req.body.specialities,
    about_title: req.body.about_title,
    about_disease: req.body.about_disease,
    risk_factor: req.body.risk_factor,
    disease_point1: req.body.disease_point1,
    disease_point2: req.body.disease_point2,
    disease_point3: req.body.disease_point3,
    disease_point4: req.body.disease_point4,
    disease_point5: req.body.disease_point5,
    disease_point6: req.body.disease_point6,
    disease_point7: req.body.disease_point7,
    disease_point8: req.body.disease_point8,
    disease_point9: req.body.disease_point9,
    disease_point10: req.body.disease_point10,
    disease_point11: req.body.disease_point11,
    disease_point12: req.body.disease_point12,
    symptoms_title: req.body.symptoms_title,
    symptoms_1: req.body.symptoms_1,
    symptoms_2: req.body.symptoms_2,
    symptoms_3: req.body.symptoms_3,
    symptoms_4: req.body.symptoms_4,
    symptoms_5: req.body.symptoms_5,
    symptoms_6: req.body.symptoms_6,
    symptoms_7: req.body.symptoms_7,
    symptoms_8: req.body.symptoms_8,
    symptoms_9: req.body.symptoms_9,
    symptoms_10: req.body.symptoms_10,
    complication_title: req.body.complication_title,
    complication_1: req.body.complication_1,
    complication_2: req.body.complication_2,
    complication_3: req.body.complication_3,
    complication_4: req.body.complication_4,
    complication_5: req.body.complication_5,
    complication_6: req.body.complication_6,
    complication_7: req.body.complication_7,
    complication_8: req.body.complication_8,
    complication_9: req.body.complication_9,
    complication_10: req.body.complication_10,
    healthy_title: req.body.healthy_title,
    healthy_tips1: req.body.healthy_tips1,
    healthy_tips2: req.body.healthy_tips2,
    healthy_tips3: req.body.healthy_tips3,
    healthy_tips4: req.body.healthy_tips4,
    healthy_tips5: req.body.healthy_tips5,
    healthy_tips6: req.body.healthy_tips6,
    healthy_tips7: req.body.healthy_tips7,
    sub_heading: req.body.sub_heading,
    image: req.body.image,
  });
  Discreate.save()
    .then((data) => {
      if (data) {
        console.log("Disease Add Successfully");
        res.redirect("/newdisease");
      }
    })
    .catch((err) => {
      console.log(err, "Disease not Added");
      res.redirect("/formdisease");
    });
};
// Testimonials add section
exports.Testimonials = (req, res) => {
  // res.render("testimonials", {
  //   title: "Testimonials Add  Form",
  //   data: req.user,
  // });
  TestimonialsModel.find()
    .then((result) => {
      res.render("testimonials", {
        title: "Testimonials Add  Form",
        data: req.user,
        testimonials: result,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.testimonialsCreate = (req, res) => {
  const Tcreate = new TestimonialsModel({
    clients_name: req.body.clients_name,
    clients_review: req.body.clients_review,
    disease_title: req.body.disease_title,
    image: req.body.image,
    patient_id: req.body.patient_id,
  });
  Tcreate.save()
    .then((data) => {
      if (data) {
        console.log("Testimonials Add Successfully");
        res.redirect("/testimonials");
      }
    })
    .catch((err) => {
      console.log(err, "Testimonials not Added");
      res.redirect("/testimonials");
    });
};

exports.testimonialsDelete = (req, res) => {
  const uid = req.params.id;
  TestimonialsModel.deleteOne({ _id: uid })
    .then((del) => {
      console.log(del, "delete successfully");
      res.redirect("/testimonials");
    })
    .catch((err) => {
      console.log(err);
    });
};
// Uniqueness Add section
exports.Uniqueness = (req, res) => {
  // res.render("uniqueness", { title: "Uniqueness Add  Form", data: req.user });
  UniquenessModel.find()
    .then((result) => {
      res.render("uniqueness", {
        title: "Uniqueness Add  Form",
        data: req.user,
        uniq: result,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.uniquenessCreate = (req, res) => {
  const Ucreate = new UniquenessModel({
    uniq_title: req.body.uniq_title,
    uniq_heading: req.body.uniq_heading,
    uniq_description: req.body.uniq_description,
    uniq_text: req.body.uniq_text,
    image: req.body.image,
  });
  Ucreate.save()
    .then((data) => {
      if (data) {
        console.log("Uniqueness Add Successfully");
        res.redirect("/uniqueness");
      }
    })
    .catch((err) => {
      console.log(err, "Uniqueness not Added");
      res.redirect("/uniqueness");
    });
};

exports.edituniqueness = (req, res) => {
  const pid = req.params.id;
  UniquenessModel.findById(pid)
    .then((uniq) => {
      console.log(uniq);
      res.render("edituniqueness", {
        title: "Disease Edit",
        data: req.user,
        uniq,
      });
    })
    .catch((err) => {
      res.render("edituniqueness", { error: "error occured,Cant fetch" });
    });
};

exports.updateuniqueness = (req, res) => {
  const user_id = req.body.u_id;
  const uniq_title = req.body.uniq_title;
  const uniq_heading = req.body.uniq_heading;
  const uniq_description = req.body.uniq_description;
  const uniq_text = req.body.uniq_text;
  const image = req.body.image;

  DiseaseModel.findById(user_id)
    .then((result) => {
      result.uniq_title = uniq_title;
      result.uniq_heading = uniq_heading;
      result.uniq_description = uniq_description;
      result.uniq_text = uniq_text;
      result.image = image;

      return result
        .save()
        .then((result) => {
          res.redirect("/uniqueness");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.uniquenessDelete = (req, res) => {
  const uid = req.params.id;
  UniquenessModel.deleteOne({ _id: uid })
    .then((del) => {
      console.log(del, "deleted successfully");
      res.redirect("/uniqueness");
    })
    .catch((err) => {
      console.log(err);
    });
};
// Blog add section
exports.Blog = (req, res) => {
  // res.render("blog", { title: "Blog Add  Form", data: req.user });
  BlogModel.find()
    .then((result) => {
      res.render("blog", {
        title: "Blog Add  Form",
        data: req.user,
        blog: result,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.blogCreate = (req, res) => {
  const Bcreate = new BlogModel({
    blog_title: req.body.blog_title,
    blog_heading: req.body.blog_heading,
    blog_description: req.body.blog_description,
    image: req.body.image,
  });
  Bcreate.save()
    .then((data) => {
      if (data) {
        console.log("Blog Add Successfully");
        res.redirect("/blog");
      }
    })
    .catch((err) => {
      console.log(err, "Blog not Added");
      res.redirect("/blog");
    });
};

exports.blogDelete = (req, res) => {
  const uid = req.params.id;
  BlogModel.deleteOne({ _id: uid })
    .then((del) => {
      console.log(del, "delete successfully");
      res.redirect("/blog");
    })
    .catch((err) => {
      console.log(err);
    });
};
// Comment Part
exports.Comment = (req, res) => {
  CommentModel.find()
    .then((result) => {
      res.render("comment", {
        title: "Blog Comment Box",
        data: req.user,
        comment: result,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.commentDelete = (req, res) => {
  const uid = req.params.id;
  CommentModel.deleteOne({ _id: uid })
    .then((del) => {
      console.log(del, "delete successfully");
      res.redirect("/blogcomment");
    })
    .catch((err) => {
      console.log(err);
    });
};
// Contact Notification section
exports.Notification = (req, res) => {
  ContactModel.find()
    .then((result) => {
      res.render("notification", {
        title: "Contact Notification",
        data: req.user,
        notification: result,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.noticDelete = (req, res) => {
  const uid = req.params.id;
  ContactModel.deleteOne({ _id: uid })
    .then((del) => {
      console.log(del, "delete successfully");
      res.redirect("/notification");
    })
    .catch((err) => {
      console.log(err);
    });
};
