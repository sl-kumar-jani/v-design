const { MongoClient } = require("mongodb");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/v-design-website";

const portfolioData = [
  {
    title: "Modern Residential Suite",
    category: "Interior Design",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-30%20at%204.17.45%20PM-SjK5owJhhzFf5WmS4pQS1WgsKdeMX8.jpeg",
    description:
      "Contemporary bedroom design with custom lighting and premium finishes",
    order: 1,
    isActive: true,
  },
  {
    title: "Luxury Dining Experience",
    category: "Interior Design",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-30%20at%204.17.46%20PM-UlYUGYAsqZuxYq4ta7qPQp7LjCXTgW.jpeg",
    description:
      "Sophisticated dining space with statement lighting and mirror accents",
    order: 2,
    isActive: true,
  },
  {
    title: "Executive Office Design",
    category: "Commercial",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-30%20at%204.17.42%20PM-nYeMsUlsvlqUDcSj0RwXUdgvFAKMVS.jpeg",
    description:
      "Professional workspace with modern aesthetics and functional layout",
    order: 3,
    isActive: true,
  },
  {
    title: "Zen Living Space",
    category: "Interior Design",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-30%20at%204.17.43%20PM%20%281%29-gXfiV5HLjJEsATW2ebhdu0dOug5uuI.jpeg",
    description:
      "Minimalist living area with natural elements and warm lighting",
    order: 4,
    isActive: true,
  },
  {
    title: "Custom Storage Solutions",
    category: "Interior Design",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-30%20at%204.17.37%20PM-nQJt4fbARSeI8cDwAiRqOID2niurmd.jpeg",
    description:
      "Innovative storage design with integrated lighting and premium materials",
    order: 5,
    isActive: true,
  },
  {
    title: "Luxury Lounge",
    category: "Interior Design",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-30%20at%204.17.43%20PM-HYtkudo69u134IJD0TjN6VHlsiKzDi.jpeg",
    description: "Elegant lounge space with rich textures and ambient lighting",
    order: 6,
    isActive: true,
  },
  {
    title: "Grand Entrance Design",
    category: "Architecture",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-30%20at%204.17.39%20PM-aIo2rNAPmiIkjOBQgV7dKLbVztes7m.jpeg",
    description:
      "Impressive entrance with V Design branding and luxury finishes",
    order: 7,
    isActive: true,
  },
  {
    title: "Master Bedroom Suite",
    category: "Interior Design",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-30%20at%204.17.44%20PM-PXd8NFSXOIipdG7EoUGiIzn4wlmHTI.jpeg",
    description:
      "Spacious bedroom with contemporary design and integrated workspace",
    order: 8,
    isActive: true,
  },
];

async function migratePortfolio() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("v-design-website");
    const portfolioCollection = db.collection("portfolios");

    // Check if portfolio items already exist
    const existingCount = await portfolioCollection.countDocuments();

    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing portfolio items`);
      const proceed = process.argv.includes("--force");

      if (!proceed) {
        console.log("Use --force flag to override existing data");
        return;
      }

      // Clear existing data
      await portfolioCollection.deleteMany({});
      console.log("Cleared existing portfolio data");
    }

    // Insert new portfolio data
    const result = await portfolioCollection.insertMany(
      portfolioData.map((item) => ({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    console.log(
      `Successfully migrated ${result.insertedCount} portfolio items`
    );

    // Display summary
    const categories = await portfolioCollection.distinct("category");
    console.log("\nPortfolio items by category:");
    for (const category of categories) {
      const count = await portfolioCollection.countDocuments({
        category: category,
      });
      console.log(`- ${category}: ${count} items`);
    }
  } catch (error) {
    console.error("Error migrating portfolio data:", error);
  } finally {
    await client.close();
  }
}

migratePortfolio();
