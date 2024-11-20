const HomeModel = require("../Model/home");
const BlogModel = require("../Model/blog");
const TestimonialsModel = require("../Model/testimonials");
const ContactModel = require("../Model/contact");
const CommentModel = require("../Model/comment");
const UniquenessModel = require("../Model/uniqueness");
const DiseaseModel = require("../Model/disease");
const TreatmentModel = require("../Model/treatment");

// Home Section
const homeView = async (req, res) => {
  try {
    const homedata = await HomeModel.find();
    res.status(200).json({
      success: true,
      messsage: "get all banneer data",
      data: homedata,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "banner data not shown" });
  }
};

// Blog Section
const blogView = async (req, res) => {
  try {
    const blogdata = await BlogModel.find();
    res
      .status(200)
      .json({ success: true, messsage: "get all blog data", data: blogdata });
  } catch (error) {
    res.status(400).json({ success: false, message: "blog data not shown" });
  }
};

const singleBloge = async (req, res) => {
  try {
    await BlogModel.findById(req.params._id).then((data) => {
      return res
        .status(200)
        .json({ success: true, messsage: "get single Bloge data", data: data });
    });
  } catch {
    return res
      .status(404)
      .json({ success: false, message: "Not fetch Bloge Data" });
  }
};
// Blog Comment Section
const createComment = async (req, res) => {
  try {
    const commentData = await new CommentModel({
      postId: req.body.postId,
      name: req.body.name,
      email: req.body.email,
      comment: req.body.comment,
      website: req.body.website,
    });
    console.log(commentData);
    const contb = await commentData.save();

    return res
      .status(201)
      .json({ success: true, message: "New Comment added", data: contb });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not added" });
  }
};

const getComment = async (req, res) => {
  try {
    await CommentModel.find().then((data) => {
      return res
        .status(200)
        .json({ success: true, data: data, message: "comments fetched" });
    });
  } catch {
    return res.status(400).json({ success: false, message: "Server error" });
  }
};

// Contact section
const createContact = async (req, res) => {
  try {
    const contact = await new ContactModel({
      name: req.body.name,
      phone: req.body.phone,
      message: req.body.message,
    });
    const contact_data = await contact.save();
    res.status(200).json({
      success: true,
      messsage: "Contact Data save",
      data: contact_data,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Contact data not save" });
  }
};

// Testimonials section
const testimonialsView = async (req, res) => {
  try {
    const testimonialsdata = await TestimonialsModel.find();
    res.status(200).json({
      success: true,
      messsage: "get all testimonials data",
      data: testimonialsdata,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "testimonals data not shown" });
  }
};

// Uniqueness Section
const uniquenessView = async (req, res) => {
  try {
    const uniqdata = await UniquenessModel.find();
    res.status(200).json({
      success: true,
      messsage: "get all uniqueness data",
      data: uniqdata,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "uniqueness data not shown" });
  }
};

const singleUniqueness = async (req, res) => {
  try {
    await UniquenessModel.findById(req.params._id).then((data) => {
      return res.status(200).json({
        success: true,
        messsage: "get single Uniqueness data",
        data: data,
      });
    });
  } catch {
    return res
      .status(404)
      .json({ success: false, message: "Not fetch Uniqness Data" });
  }
};

// Disease Section
const diseaseView = async (req, res) => {
  try {
    const diseasedata = await DiseaseModel.find();
    res.status(200).json({
      success: true,
      messsage: "get all disease data",
      data: diseasedata,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "disease data not shown" });
  }
};

//   Treatment Section
const treatmentView = async (req, res) => {
  try {
    const traetmentdata = await TreatmentModel.find();
    res.status(200).json({
      success: true,
      messsage: "get all treatment data",
      data: traetmentdata,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "treatment data not shown" });
  }
};
// const edit = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const edituser = await usermodel.findById(id);
//     res
//       .status(200)
//       .json({ success: true, messsage: "get all user data", data: edituser });
//   } catch {
//     res.status(400).json({ success: false, messsage: "user not save" });
//   }
// };

module.exports = {
  homeView,
  blogView,
  singleBloge,
  createComment,
  getComment,
  createContact,
  testimonialsView,
  uniquenessView,
  singleUniqueness,
  diseaseView,
  treatmentView,
};
