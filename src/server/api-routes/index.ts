import { createRouter } from "../core/server";
import { accessRouter } from "./access";
import { cmsRouter } from "./cms";
import { commonRouter } from "./common";

const APIRouter = createRouter();






APIRouter.UseRouter(accessRouter);
APIRouter.UseRouter(cmsRouter);
APIRouter.UseRouter(commonRouter);

export { APIRouter }