const mongoose = require("mongoose");

// Define the testimonial schema (same as in model)
const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create model
const Testimonial = mongoose.model("Testimonial", testimonialSchema);

// Static testimonials data to migrate
const staticTestimonials = [
  {
    name: "Priya Sharma",
    location: "Pune, Maharashtra",
    project: "3BHK Apartment Interior",
    rating: 5,
    review:
      "Ar. Virali Dias transformed our home into a masterpiece. Her attention to detail and understanding of our lifestyle needs was exceptional. The modern design with traditional touches perfectly reflects our personality.",
    image: "/placeholder.svg?height=80&width=80",
    isActive: true,
    order: 1,
  },
  {
    name: "Rajesh Patel",
    location: "Mumbai, Maharashtra",
    project: "Office Space Design",
    rating: 5,
    review:
      "V Design created an inspiring workspace that boosted our team's productivity. The use of natural light and premium materials created an environment that our clients and employees absolutely love.",
    image: "/placeholder.svg?height=80&width=80",
    isActive: true,
    order: 2,
  },
  {
    name: "Anita Desai",
    location: "Pune, Maharashtra",
    project: "Villa Interior Design",
    rating: 5,
    review:
      "Working with V Design was a dream come true. Virali's vision and execution exceeded our expectations. Every corner of our villa now tells a story of elegance and sophistication.",
    image: "/placeholder.svg?height=80&width=80",
    isActive: true,
    order: 3,
  },
  {
    name: "Vikram Singh",
    location: "Nashik, Maharashtra",
    project: "Restaurant Interior",
    rating: 5,
    review:
      "The restaurant design by V Design has become the talk of the town. The ambiance perfectly complements our cuisine, and customer footfall has increased significantly since the renovation.",
    image: "/placeholder.svg?height=80&width=80",
    isActive: true,
    order: 4,
  },
  {
    name: "Meera Joshi",
    location: "Pune, Maharashtra",
    project: "Boutique Store Design",
    rating: 5,
    review:
      "V Design understood our brand vision perfectly. The store layout not only looks stunning but also enhances the shopping experience. Our sales have increased by 40% since the redesign.",
    image: "/placeholder.svg?height=80&width=80",
    isActive: true,
    order: 5,
  },
];

async function migrateTestimonials() {
  try {
    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/v-design-website";
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Check if testimonials already exist
    const existingTestimonials = await Testimonial.find();
    if (existingTestimonials.length > 0) {
      console.log(
        `⚠️  Found ${existingTestimonials.length} existing testimonials in database`
      );
      console.log("   Skipping migration to avoid duplicates");
      console.log(
        "   If you want to replace existing data, please clear the collection first"
      );
      return;
    }

    // Insert static testimonials
    console.log("🔄 Inserting static testimonials...");
    const result = await Testimonial.insertMany(staticTestimonials);
    console.log(
      `✅ Successfully migrated ${result.length} testimonials to database`
    );

    // Log the migrated testimonials
    console.log("\n📋 Migrated testimonials:");
    result.forEach((testimonial, index) => {
      console.log(
        `${index + 1}. ${testimonial.name} - ${testimonial.project} (${
          testimonial.rating
        }⭐)`
      );
    });

    console.log("\n🎉 Migration completed successfully!");
    console.log(
      "   You can now manage testimonials through the admin dashboard"
    );
    console.log("   Visit: http://localhost:3000/admin/");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("🔒 Database connection closed");
  }
}

// Run the migration
if (require.main === module) {
  migrateTestimonials();
}

module.exports = migrateTestimonials;
