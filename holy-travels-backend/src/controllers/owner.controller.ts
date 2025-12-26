import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest, CreateTourBody, UpdateTourBody } from "../types";

export const createTour = async (
  req: AuthRequest & { body: CreateTourBody },
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      destination,
      price,
      duration,
      startDate,
      endDate,
      maxCapacity,
      image,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !destination ||
      price === undefined ||
      !duration ||
      !startDate ||
      !endDate ||
      !maxCapacity
    ) {
      res.status(400).json({ error: "All required fields must be provided" });
      return;
    }

    const tour = await prisma.tour.create({
      data: {
        title,
        description,
        destination,
        price: Number(price),
        duration: Number(duration),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxCapacity: Number(maxCapacity),
        image,
      },
    });

    res.status(201).json({
      message: "Tour created successfully",
      tour,
    });
  } catch (error) {
    console.error("Create tour error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTour = async (
  req: AuthRequest & { params: { id: string }; body: UpdateTourBody },
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      destination,
      price,
      duration,
      startDate,
      endDate,
      maxCapacity,
      image,
    } = req.body;

    // Check if tour exists
    const existingTour = await prisma.tour.findUnique({
      where: { id },
    });

    if (!existingTour) {
      res.status(404).json({ error: "Tour not found" });
      return;
    }

    // Build update data object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (destination !== undefined) updateData.destination = destination;
    if (price !== undefined) updateData.price = Number(price);
    if (duration !== undefined) updateData.duration = Number(duration);
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (maxCapacity !== undefined) updateData.maxCapacity = Number(maxCapacity);
    if (image !== undefined) updateData.image = image;

    const tour = await prisma.tour.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: "Tour updated successfully",
      tour,
    });
  } catch (error) {
    console.error("Update tour error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTour = async (
  req: AuthRequest & { params: { id: string } },
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if tour exists
    const existingTour = await prisma.tour.findUnique({
      where: { id },
    });

    if (!existingTour) {
      res.status(404).json({ error: "Tour not found" });
      return;
    }

    await prisma.tour.delete({
      where: { id },
    });

    res.json({ message: "Tour deleted successfully" });
  } catch (error) {
    console.error("Delete tour error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

