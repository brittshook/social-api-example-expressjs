const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const comments = require("../data/comments");
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    const userId = req.query.userId;

    const links = [
      {
        href: "posts/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    if (userId) {
      const userPosts = posts.filter((post) => post.userId == userId);
      res.json(userPosts);
    } else {
      res.json({ posts, links });
    }
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

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

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

router.route("/:id/comments").get((req, res, next) => {
  const postId = req.params.id;
  const post = posts.map((post) => post.id == postId);

  if (post && comments) {
    const postComments = comments.filter((comment) => comment.postId == postId);
    const userId = req.query.userId;

    if (userId) {
      const filteredComments = postComments.filter(
        (comment) => comment.userId == userId
      );
      res.json(filteredComments);
    } else {
      res.json(postComments);
    }
  } else {
    next(error(404, "Post not found"));
  }
});

module.exports = router;
