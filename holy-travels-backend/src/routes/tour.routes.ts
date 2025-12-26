import { Router } from "express";
import { getAllTours, getTourById } from "../controllers/tour.controller";

const router = Router();

// GET /tours - Get all tours
router.get("/", getAllTours);

// GET /tours/:id - Get tour by ID
router.get("/:id", getTourById);

export default router;

