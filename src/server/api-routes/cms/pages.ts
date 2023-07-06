/**
 * @author: Toni Lukkaroinen
 * @license: MIT
 * 
 * 
 * TODO: Lets do OpenAPI specifications later, when the time..
 * openapi: '3.0.0'
 * info: 
 *   version: '1.0.0'
 *   title: 'HoosatCMS Pages'
 *   description: 'Create, list, update, delete pages'
 * 
 * paths:  
 *   /pages:
 *     post:
 *       summary: "Create a new article",
 *   /pages:
 *     put:
 *       summary: "Update article"
 *   /pages/:id         GET           - Get a page by ID
 *   /pages/domain/:id  GET           - Get pages by domain
 *   /pages/group/:id   GET           - Get pages by group
 *   /pages/author/:id  GET           - Get pages by author
 *   /pages/:id         DELETE        - Delete a page by ID
 */

import { confirmPermission } from "../../lib/access/groups";
import { createPage, deletePage, getPage, getPageByLink, getPagesByDomain, updatePage } from "../../lib/cms/pages";
import { confirmToken } from "../../lib/access/sessions";
import { DEBUG, ErrorHandler } from "../../core/errors";
import { createRouter } from "../../core/server";


const pagesRouter = createRouter();


/**
 * Handles HTTP POST requests for adding page.
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {string} req.headers.authorization - Session token
 * @param {Object} req.body.page - PageDTO
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
pagesRouter.Post("/api/pages/", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { group } = await confirmPermission(account, "WRITE");
    return res.status(200).json(await createPage(account, group, req.body.page));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

/**
 * Handles HTTP PUT requests for adding page.
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {string} req.headers.authorization - Session token
 * @param {Object} req.body.page - PageDTO
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
pagesRouter.Put("/api/pages/", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { permission } = await confirmPermission(account, "WRITE");
    if(permission !== true) {
      return res.status(500).json({ result: "error", message: "No permission." })
    }
    return res.status(200).json(await updatePage(req.body.page));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

/**
 * Handles HTTP DELETE requests for adding page.
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {string} req.headers.authorization - Session token
 * @param {string} req.params.id - Page ObjectID
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
pagesRouter.Delete("/api/pages/:id", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { permission } = await confirmPermission(account, "WRITE");
    if(permission !== true) {
      return res.status(500).json({ result: "error", message: "No permission." })
    }
    return res.status(200).json(await deletePage(req.params?.['id']));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});



/**
 * Handles HTTP Get requests for getting page by id.
 * @function
 * @async
 * @param {object} req - The HTTP rquest object.
 * @param {string} req.params.id - The id of the page to get.
 * @param {object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
pagesRouter.Get("/api/pages/link/:link", async (req, res) => {
  try {
    DEBUG.log(req.params?.['link']);
    return res.status(200).json(await getPageByLink(req.params?.['link']));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

/**
 * Handles HTTP Get requests for getting page by domain and link.
 * @function
 * @async
 * @param {object} req - The HTTP rquest object.
 * @param {string} req.params.link - The link of the page to get.
 * @param {string} req.params.domain - The link of the page to get.
 * @param {object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
pagesRouter.Get("/api/pages/domain/:domain/link/:link", async (req, res) => {
  try {
    DEBUG.log("Domain: ", req.params?.['domain']);
    DEBUG.log("Link: ", req.params?.['link']);
    if(req.params?.['domain'] === undefined) {
      return res.status(500).json({ result: "error", message: "Domain was empty" });
    }
    let { pages } = await getPagesByDomain(req.params?.['domain']);
    pages = pages.filter((page) => page.link === "/" + req.params?.['link']);
    return res.status(200).json({ result: "success", message: "Page has been found.", page: pages[0] });
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

/**
 * Handles HTTP Get requests for getting page by domain.
 * @function
 * @async
 * @param {object} req - The HTTP rquest object.
 * @param {string} req.params.domain - The domain of the pages to get.
 * @param {object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
pagesRouter.Get("/api/pages/domain/:domain", async (req, res) => {
  try {
    if(req.params?.['domain'] === undefined) {
      return res.status(500).json({ result: "error", message: "Domain was empty" });
    }
    return res.status(200).json(await getPagesByDomain(req.params?.['domain']));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

/**
 * Handles HTTP Get requests for getting page by author.
 * @function
 * @async
 * @param {object} req - The HTTP rquest object.
 * @param {string} req.params.author - The author id of the pages to get.
 * @param {object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
pagesRouter.Get("/api/pages/author/:author", async (req, res) => {
  try {
    if(req.params?.['author'] === undefined) {
      return res.status(500).json({ result: "error", message: "Author was empty" });
    }
    return res.status(200).json(await getPagesByDomain(req.params?.['author']));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});


/**
 * Handles HTTP Get requests for getting page by author.
 * @function
 * @async
 * @param {object} req - The HTTP rquest object.
 * @param {string} req.params.group - The group id of the pages to get.
 * @param {object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
pagesRouter.Get("/api/pages/group/:group", async (req, res) => {
  try {
    if(req.params?.['group'] === undefined) {
      return res.status(500).json({ result: "error", message: "Group was empty" });
    }
    return res.status(200).json(await getPagesByDomain(req.params?.['group']));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

/**
 * Handles HTTP Get requests for getting page by id.
 * @function
 * @async
 * @param {object} req - The HTTP rquest object.
 * @param {string} req.params.id - The id of the page to get.
 * @param {object} res - The HTTP response object.
 * @returns {Object} The HTTP with status code and JSON object with result, message and article properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
pagesRouter.Get("/api/pages/:id", async (req, res) => { 
  try {
    return res.status(200).json(await getPage(req.params?.['id']));
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

export {
  pagesRouter
}