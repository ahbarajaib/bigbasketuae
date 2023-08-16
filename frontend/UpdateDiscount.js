const MongoClient = require("mongodb").MongoClient;

// MongoDB connection URL
const url =
  "mongodb+srv://admin123:admin123@bigbasketcluster.0jwd0t4.mongodb.net/bigbasket?retryWrites=true&w=majority";

// Database name
const dbName = "bigbasket";

// Field to update
const fieldToUpdate = "discount";

// New discount value
const newDiscountValue = 10; // Update this value as needed

// Create a new MongoClient
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to the MongoDB server
client.connect((err) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }

  console.log("Connected to MongoDB");

  // Get a reference to the database
  const db = client.db(dbName); // Use dbName here

  // Get a reference to the collection you want to update
  const collection = db.collection("products");

  // Update all documents where the discount is not set
  collection.updateMany(
    { "prices.0.discount": { $exists: false } },
    { $set: { "prices.$[].discount": newDiscountValue } },
    (err, result) => {
      if (err) {
        console.error("Error updating documents:", err);
      } else {
        console.log("Documents updated:", result.modifiedCount);
      }

      // Close the connection
      client.close();
    }
  );
});
