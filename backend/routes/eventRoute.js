import express from "express";
import { addEvent, listEvent, removeEvent } from "../controllers/eventController.js";
import {
  eventBooking,
  getAmountEvent,
  updateAmount,
  userEventBooking,
  listEventBooking,
} from "../controllers/eventBookingController.js";
import upload from "../middleware/multer.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const eventRouter = express.Router();

eventRouter.post("/remove", adminAuth, removeEvent);
eventRouter.post("/add", upload.none(), addEvent);
eventRouter.get("/list", listEvent);
eventRouter.post("/event-booking", authUser, eventBooking);
eventRouter.post("/get-amount", getAmountEvent);
eventRouter.post("/update-amount", updateAmount);
eventRouter.post("/user-event-booking", authUser, userEventBooking);

eventRouter.post("/list-event-booking", adminAuth, listEventBooking);
export default eventRouter;
