const dbConnection = require("../db/dbConnection");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const errorHandler = require("../errors/errorHandler");
// const pushToQ = require("../queue/pushToQueueHandler");

const findAll = async (request, reply) => {
  try {
    const id = request.headers.authorization;
    if (id == null) {
      return await errorHandler(401, "unauthorized", true, request, reply);
    } else {
      const findUser = await User.findById(id).exec();

      if (!findUser) {
        return await errorHandler(401, "unauthorized", true, request, reply);
      } else {
        const findAllComments = await Comment.find().exec();
        if (!findAllComments) {
          return await errorHandler(
            404,
            "comments-not-found",
            true,
            request,
            reply,
          );
        } else {
          await reply.code(200).send({
            success: true,
            data: findAllComments,
          });
        }
      }
    }
  } catch (error) {
    return await errorHandler(404, error, false, request, reply);
  }
};

const findOne = async (request, reply) => {
  try {
    const userId = request.headers.authorization;
    if (userId == null) {
      return await errorHandler(401, "unauthorized", true, request, reply);
    } else {
      const findUser = await User.findById(userId).exec();
      if (!findUser) {
        return await errorHandler(401, "unauthorized", true, request, reply);
      } else {
        const { id } = request.params;
        const findOneComment = await Comment.findById(id).exec();

        if (!findOneComment) {
          return await errorHandler(
            404,
            "comment-not-found",
            true,
            request,
            reply,
          );
        } else {
          await reply.code(200).send({
            success: true,
            data: findOneComment,
          });
        }
      }
    }
  } catch (error) {
    return await errorHandler(404, error, false, request, reply);
  }
};

const findAllCommentsFromUser = async (request, reply) => {
  try {
    const userId = request.headers.authorization;
    if (userId == null) {
      return await errorHandler(401, "unauthorized", true, request, reply);
    } else {
      const findUser = await User.findById(userId).exec();
      if (!findUser) {
        return await errorHandler(401, "unauthorized", true, request, reply);
      } else {
        const { id } = request.params;
        const findAllComments = await Comment.find({ user: id }).exec();

        if (!findAllComments) {
          return await errorHandler(
            404,
            "comments-not-found",
            true,
            request,
            reply,
          );
        } else {
          await reply.code(200).send({
            success: true,
            data: findAllComments,
          });
        }
      }
    }
  } catch (error) {
    return await errorHandler(404, error, false, request, reply);
  }
};

const createComment = async (request, reply) => {
  try {
    const userId = request.headers.authorization;
    if (userId == null) {
      return await errorHandler(401, "unauthorized", true, request, reply);
    } else {
      const findUser = await User.findById(userId).exec();
      if (!findUser) {
        return await errorHandler(401, "unauthorized", true, request, reply);
      } else {
        const findPost = await Post.findById(request.body.data.post);

        if (!findPost) {
          return await errorHandler(
            404,
            "post-not-found",
            true,
            request,
            reply,
          );
        } else {
          const createdComment = await Comment.create({
            ...request.body.data,
          });

          if (!createdComment) {
            return await errorHandler(
              400,
              "comment-not-created",
              true,
              request,
              reply,
            );
          } else {
            const addCommentToPost = await Post.findByIdAndUpdate(
              findPost._id,
              { $push: { comments: createdComment } },
            ).exec();
            if (!addCommentToPost) {
              return await errorHandler(
                400,
                "comment-not-created",
                true,
                request,
                reply,
              );
            } else {
              await reply.code(201).send({
                success: true,
                data: createdComment,
              });
            }
          }
        }
      }
    }
  } catch (error) {
    return await errorHandler(400, error, false, request, reply);
  }
};

const updateComment = async (request, reply) => {
  try {
    const userId = request.headers.authorization;
    if (userId == null) {
      return await errorHandler(401, "unauthorized", true, request, reply);
    } else {
      const findUser = await User.findById(userId).exec();
      if (!findUser) {
        return await errorHandler(401, "unauthorized", true, request, reply);
      } else {
        const findPost = await Post.findById(request.body.data.post).exec();

        if (!findPost) {
          return await errorHandler(
            404,
            "post-not-found",
            true,
            request,
            reply,
          );
        } else {
          const { id } = request.params;
          const findComment = await Comment.findById(id).exec();

          if (!findComment) {
            return await errorHandler(
              404,
              "comment-not-found",
              true,
              request,
              reply,
            );
          } else {
            const updatedComment = await Comment.findByIdAndUpdate(
              id,
              {
                ...request.body.data,
              },
              { new: true },
            ).exec();

            if (!updatedComment) {
              return await errorHandler(
                400,
                "comment-update-failed",
                true,
                request,
                reply,
              );
            } else {
              await reply.code(200).send({
                success: true,
                data: updatedComment,
              });
            }
          }
        }
      }
    }
  } catch (error) {
    return await errorHandler(404, error, false, request, reply);
  }
};

const deleteComment = async (request, reply) => {
  try {
    const userId = request.headers.authorization;
    if (userId == null) {
      return await errorHandler(401, "unauthorized", true, request, reply);
    } else {
      const findUser = await User.findById(userId).exec();

      if (!findUser) {
        return await errorHandler(401, "unauthorized", true, request, reply);
      } else {
        const { id } = request.params;
        const findComment = await Comment.findById(id).exec();

        if (!findComment) {
          return await errorHandler(
            404,
            "comment-not-found",
            true,
            request,
            reply,
          );
        } else {
          const deletedComment = await Comment.findByIdAndDelete(id).exec();

          if (!deletedComment) {
            return await errorHandler(
              400,
              "comment-delete-failed",
              true,
              request,
              reply,
            );
          } else {
            await reply.code(200).send({
              success: true,
              data: findComment,
            });
          }
        }
      }
    }
  } catch (error) {
    return await errorHandler(404, error, false, request, reply);
  }
};

module.exports = {
  findAll,
  findOne,
  findAllCommentsFromUser,
  createComment,
  updateComment,
  deleteComment,
};
