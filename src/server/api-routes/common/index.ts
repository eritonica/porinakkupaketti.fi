import { createRouter } from "../../core/server";
import { contactRouter } from "./contact";
import { contactFormRouter } from "./contactForm";
const commonRouter = createRouter();

commonRouter.UseRouter(contactRouter);
commonRouter.UseRouter(contactFormRouter);

export { commonRouter }