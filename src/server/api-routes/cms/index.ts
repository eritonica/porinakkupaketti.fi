import { createRouter } from "../../core/server";
import { articlesRouter } from "./articles";
import { commentsRouter } from "./comments";
import { pagesRouter } from "./pages";

const cmsRouter = createRouter();

cmsRouter.UseRouter(articlesRouter);
cmsRouter.UseRouter(commentsRouter);
cmsRouter.UseRouter(pagesRouter);

export { cmsRouter }