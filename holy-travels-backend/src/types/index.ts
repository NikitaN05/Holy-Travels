import { Role } from "@prisma/client";
import { Request } from "express";

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateTourBody {
  title: string;
  description: string;
  destination: string;
  price: number;
  duration: number;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  image?: string;
}

export interface UpdateTourBody {
  title?: string;
  description?: string;
  destination?: string;
  price?: number;
  duration?: number;
  startDate?: string;
  endDate?: string;
  maxCapacity?: number;
  image?: string;
}

