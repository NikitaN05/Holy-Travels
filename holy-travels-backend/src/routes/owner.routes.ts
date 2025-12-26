import { Router } from "express";
import { createTour, updateTour, deleteTour } from "../controllers/owner.controller";
import { authenticateToken } from "../middleware/auth";
import { requireOwner } from "../middleware/rbac";

const router = Router();

// All owner routes require authentication and OWNER role
router.use(authenticateToken);
router.use(requireOwner);

// POST /owner/tours - Create a new tour
router.post("/tours", createTour);

// PATCH /owner/tours/:id - Update a tour
router.patch("/tours/:id", updateTour);

// DELETE /owner/tours/:id - Delete a tour
router.delete("/tours/:id", deleteTour);

export default router;

