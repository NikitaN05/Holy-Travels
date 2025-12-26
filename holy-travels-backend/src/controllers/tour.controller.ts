import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAllTours = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const tours = await prisma.tour.findMany({
      orderBy: { startDate: "asc" },
    });

    res.json({ tours });
  } catch (error) {
    console.error("Get all tours error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTourById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const tour = await prisma.tour.findUnique({
      where: { id },
    });

    if (!tour) {
      res.status(404).json({ error: "Tour not found" });
      return;
    }

    res.json({ tour });
  } catch (error) {
    console.error("Get tour by id error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

