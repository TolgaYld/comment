const commentController = require("../controllers/commentController");
module.exports = function (fastify, opts, done) {
  fastify.get("/findAll", commentController.findAll);
  fastify.get("/find/:id", commentController.findOne);
  fastify.get(
    "/findAllCommentsFromUser/:id",
    commentController.findAllCommentsFromUser,
  );
  fastify.post("/create", commentController.createComment);
  fastify.patch("/update/:id", commentController.updateComment);
  fastify.delete("/delete/:id", commentController.deleteComment);
  done();
};
