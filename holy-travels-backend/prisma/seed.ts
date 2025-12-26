import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create OWNER user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const owner = await prisma.user.upsert({
    where: { email: "owner@holytravels.com" },
    update: {},
    create: {
      email: "owner@holytravels.com",
      password: hashedPassword,
      name: "Holy Travels Admin",
      role: Role.OWNER,
    },
  });

  console.log("✅ Created OWNER user:", owner.email);

  // Create sample tour
  const tour = await prisma.tour.upsert({
    where: { id: "sample-tour-1" },
    update: {},
    create: {
      id: "sample-tour-1",
      title: "Sacred Jerusalem Pilgrimage",
      description:
        "Experience a transformative 7-day journey through the holy city of Jerusalem. Visit the Western Wall, Church of the Holy Sepulchre, Mount of Olives, and many other sacred sites. Includes guided tours, comfortable accommodation, and authentic local cuisine.",
      destination: "Jerusalem, Israel",
      price: 2499.99,
      duration: 7,
      startDate: new Date("2025-03-15"),
      endDate: new Date("2025-03-22"),
      maxCapacity: 30,
      image: "https://images.unsplash.com/photo-1552423314-cf29ab68ad73?w=800",
    },
  });

  console.log("✅ Created sample tour:", tour.title);

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

