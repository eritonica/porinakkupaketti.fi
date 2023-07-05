import { createRouter } from "../../core/server";
import { contactFormRouter } from "./contactForm";
import { filesRouter } from "./files";

const commonRouter = createRouter();

commonRouter.UseRouter(contactFormRouter);
commonRouter.UseRouter(filesRouter);

export { commonRouter }