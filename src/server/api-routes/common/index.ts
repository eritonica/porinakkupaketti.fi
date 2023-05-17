import { createRouter } from "../../core/server";
import { contactFormRouter } from "./contactForm";

const commonRouter = createRouter();

commonRouter.UseRouter(contactFormRouter);

export { commonRouter }