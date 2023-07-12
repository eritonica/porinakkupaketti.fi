import { 
  confirmGroupPermission, 
  confirmPermission 
} from '../../lib/access/groups';
import { 
  createArticle, 
  deleteArticle, 
  getArticlesByDomain,
  getArticlesByGroup, 
  getPublicArticleByHeader, 
  getPublicArticles, 
  getPublicArticlesByDomain, 
  publishArticle, 
  unpublishArticle, 
  updateArticle 
} from '../../lib/cms/articles';
import { confirmToken } from '../../lib/access/sessions';
import { ErrorHandler } from '../../core/errors';
import { createRouter } from '../../core/server';
import mongoose from 'mongoose';


const articlesRouter = createRouter();

/**
 * Articles aka blog posts.
 * /articles/               POST        - Save a new article
 * /articles/               PUT         - Update article
 * /articles/               GET         - Get all public articles
 * /articles/:id            GET         - Get article by ID
 * /articles/group/:id      GET         - Get all articles by group ID
 * /articles/domain/:id     GET         - Get all articles by domain
 * /articles/:id            DELETE      - Delete article by ID
 */

/**
 * Handles HTTP POST requests for adding article.
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
articlesRouter.Post("/api/articles/", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { group } = await confirmPermission(account, "WRITE");
    return res.status(200).json(await createArticle(account, group, req.body.article));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

/**
 * Handles HTTP Put requests for updating article.
 * @function
 * @async
 * @param {object} req - The HTTP rquest object.
 * @param {object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
articlesRouter.Put("/api/articles/", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { permission } = await confirmPermission(account, "WRITE");
    if(permission !== true) {
      return res.status(500).json({ result: "error", message: "No permission." })
    }
    return res.status(200).json(await updateArticle(req.body.article));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

/**
 * Handles HTTP Put requests for publishing article.
 * @function
 * @async
 * @param {object} req - The HTTP rquest object.
 * @param {object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
articlesRouter.Put("/api/articles/publish", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { permission } = await confirmPermission(account, "WRITE");
    if(permission !== true) {
      return res.status(500).json({ result: "error", message: "No permission." })
    }
    return res.status(200).json(await publishArticle(req.body.article));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

/**
 * Handles HTTP Put requests for unpublishing article.
 * @function
 * @async
 * @param {object} req - The HTTP rquest object.
 * @param {object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
articlesRouter.Put("/api/articles/unpublish", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { permission } = await confirmPermission(account, "WRITE");
    if(permission !== true) {
      return res.status(500).json({ result: "error", message: "No permission." })
    }
    return res.status(200).json(await unpublishArticle(req.body.article));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

/**
 * Handles HTTP delete requests for updating article.
 * @function
 * @async
 * @param {object} req - The HTTP rquest object.
 * @param {object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
articlesRouter.Delete("/api/articles/:id", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { permission } = await confirmPermission(account, "DELETE");
    if(permission !== true) {
      return res.status(500).json({ result: "error", message: "No permission." })
    }
    return res.status(200).json(await deleteArticle(req.params?.['id']));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

/**
 * Handles HTTP Get requests for getting article.
 * @function
 * @async
 * @param {object} req - The HTTP rquest object.
 * @param {object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
articlesRouter.Get("/api/articles/", async (_req, res) => {
  try {
    return res.status(200).json(await getPublicArticles());
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});


articlesRouter.Get("/api/article/:header", async (req, res) => {
  try {
    return res.status(200).json(await getPublicArticleByHeader(req.params!['header']));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

/**
 * Handles HTTP Get requests for getting article by group id.
 * @function
 * @async
 * @param {object} req - The HTTP rquest object.
 * @param {object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
articlesRouter.Get("/api/articles/group/:id", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const groupId = new mongoose.Types.ObjectId(req.params?.['id']);
    const { group } = await confirmGroupPermission("READ", { _id : groupId },  account);
    return res.status(200).json(await getArticlesByGroup(group));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

/**
 * Handles HTTP Get requests for getting article.
 * @function
 * @async
 * @param {object} req - The HTTP rquest object.
 * @param {object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
articlesRouter.Get("/api/articles/public/domain/:domain", async (req, res) => {
  try {
    return res.status(200).json(await getPublicArticlesByDomain(req.params?.['domain']));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

/**
 * Handles HTTP Get requests for getting article.
 * @function
 * @async
 * @param {object} req - The HTTP rquest object.
 * @param {object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
articlesRouter.Get("/api/articles/domain/:domain", async (req, res) => {
  try {
    return res.status(200).json(await getArticlesByDomain(req.params?.['domain']));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

export {
  articlesRouter
}