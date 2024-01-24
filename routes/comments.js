const express = require("express");
const router = express.Router();

const comments = require("../data/comments");
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    const userId = req.query.userId;
    const postId = req.query.postId;

    const links = [
      {
        href: "comments/",
        rel: "",
        type: "POST",
      },
    ];

    if (userId) {
      const userComments = comments.filter((comment) => comment.userId == userId);
      res.json(userComments);
    } else if (postId) {
      const postComments = comments.filter((comment) => comment.postId == postId);
      res.json(postComments);
    } else {
      res.json({ comments, links });
    }
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.postId && req.body.body) {
      const comment = {
        id: comments.length + 1,
        userId: req.body.userId,
        postId: req.body.postId,
        body: req.body.body,
      };

      comments.push(comment);
      res.json(comments[comments.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const comment = comments.find((comment) => comment.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (comment) res.json({ comment, links });
    else next();
  })
  .patch((req, res, next) => {
    const comment = comments.find((comment, i) => {
      if (comment.id == req.params.id) {
        for (const key in req.body) {
          comments[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (comment) res.json(comment);
    else next();
  })
  .delete((req, res, next) => {
    const comment = comments.find((comment, i) => {
      if (comment.id == req.params.id) {
        comments.splice(i, 1);
        return true;
      }
    });

    if (comment) res.json(comment);
    else next();
  });

module.exports = router;
