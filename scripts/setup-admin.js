const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/v-design-website";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function setupAdmin() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("v-design-website");
    const adminsCollection = db.collection("admins");

    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({
      adminEmail: ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    await adminsCollection.insertOne({
      adminEmail: ADMIN_EMAIL,
      adminPassword: hashedPassword,
      role: "super-admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Super Admin user created successfully");
    console.log("Email:", ADMIN_EMAIL);
    console.log("Password:", ADMIN_PASSWORD);
  } catch (error) {
    console.error("Error setting up admin:", error);
  } finally {
    await client.close();
  }
}

setupAdmin();
