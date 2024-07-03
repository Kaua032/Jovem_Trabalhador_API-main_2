import { Router } from "express";
import {
  CreatePartyController,
  FindPartyController,
  GetAllPartiesController,
  UpdatePartyController,
} from "../controllers/party.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const partyRouter = Router();

partyRouter.post("/register", authMiddleware, CreatePartyController);
partyRouter.get("/all", GetAllPartiesController);
partyRouter.put("/update/:id", authMiddleware, UpdatePartyController);
partyRouter.post("/find", authMiddleware, FindPartyController);

export default partyRouter;
