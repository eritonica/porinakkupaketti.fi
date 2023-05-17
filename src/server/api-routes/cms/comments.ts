
import { ErrorHandler } from '../../core/errors';
import { confirmToken } from '../../lib/access/sessions';
import { CommentResultDTO, createComment, getCommentGroupId, updateComment } from '../../lib/cms/comments';
import { CommentsDTO } from '../../lib/schemas/commentsSchema';
import { confirmGroupPermission } from '../../lib/access/groups';
import { createRouter } from '../../core/server';

const commentsRouter = createRouter();

commentsRouter.Post("/api/comments", async (req, res) => {
  try {
    let comment = req.body as CommentsDTO;
    let result = {} as CommentResultDTO;
    if (req.headers.authorization !== undefined) {
      const { account } = await confirmToken(req.headers.authorization);
      comment = {
        ...comment,
        public: false,
        author: {
          type: "authenticated",
          account: account._id,
        }
      };
      result = await createComment(comment);
    } else {
      result = await createComment(comment);
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

commentsRouter.Put("/api/comments/", async (req, res) => {
  try {
    const comment = req.body as CommentsDTO;
    const { account } = await confirmToken(req.headers.authorization);
    if(!account) {
      return res.status(401).json({ result: "error", message: "Anonymous comments can not be modified anonymously or by the user, requires admin." });
    }
    let { group } = await getCommentGroupId(comment);
    if (group === undefined) {
      return res.status(401).json({ result: "error", message: "Could not find comment group id." });
    }
    let { permission } = await confirmGroupPermission("WRITE", group._id,  account);
    let result = {} as CommentResultDTO;
    if(permission === true || (comment.author?.type === "authenticated" && comment.author?.account === account._id)) {
      result = await updateComment(comment);
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

export {
  commentsRouter
}