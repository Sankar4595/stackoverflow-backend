var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var AnswerModel = require("../schemas/answerSchema");
var QuestionModel = require("../schemas/questionSchema");
var CommentModel = require("../schemas/commentSchema");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({
    message: "Home Page",
  });
});

// Question Model

router.get("/question", async (req, res) => {
  try {
    //GET request for all questions
    await QuestionModel.aggregate([
      // Creating a aggregate method for combining the answers,comments and voteDetails based on mongoDB methods
      {
        $lookup: {
          from: "answers", // assigning a lookup  method on answers collection
          // localField: "_id",
          // foreignField: "question_id",
          let: { question_id: "$_id" }, // assigning the question id as id
          pipeline: [
            { $match: { $expr: { $eq: ["$question_id", "$$question_id"] } } }, // matching the question id with the respective cells question id
            { $project: { _id: 1, user: 1 } }, // Displaying only the id and user by inclusion method
          ],
          as: "answers",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { question_id: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$question_id", "$$question_id"] } } },
            { $project: { _id: 1, user: 1, created_at: 1, comment: 1 } },
          ],
          as: "comments",
        },
      },
    ])
      .sort({ createdAt: -1 })
      .exec()
      .then((response) => res.status(200).send(response))
      .catch((err) => res.status(404).send(err));
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.get("/question/:id", async (req, res) => {
  try {
    // const question = await QuestionDB.findOne({ _id: req.params.id });
    // res.status(200).send(question);
    await QuestionModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "answers",
          let: { question_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$question_id", "$$question_id"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                user: 1,
                answer: 1,
                // created_at: 1,
                question_id: 1,
                created_at: 1,
              },
            },
          ],
          as: "answerDetails",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { question_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$question_id", "$$question_id"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                question_id: 1,
                user: 1,
                comment: 1,
                // created_at: 1,
                // question_id: 1,
                created_at: 1,
              },
            },
          ],
          as: "comments",
        },
      },
      {
        $project: {
          __v: 0,
          // _id: "$_id",
          // answerDetails: { $first: "$answerDetails" },
        },
      },
    ])
      .exec()
      .then((questionDetails) => {
        res.status(200).send(questionDetails);
      })
      .catch((e) => {
        console.log("Error: ", e);
        res.status(400).send(error);
      });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      message: "Question not found",
    });
  }
});

router.post("/question", async (req, res) => {
  try {
    let question = await QuestionModel.create(req.body);
    question.save();
    res.status(201).send({
      message: "Question Post Successfull",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

// Answer Model

router.post("/answer", async (req, res) => {
  try {
    let answer = await AnswerModel.create(req.body);
    answer.save();
    res.status(201).send({
      message: "Answer Update Successful",
      answer,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

// Comment Model

router.post("/comment/:question_id", async (req, res) => {
  try {
    let comment = await CommentModel.create(req.body);
    comment.save();
    res.status(201).send({
      message: "Comment added",
      comment,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
