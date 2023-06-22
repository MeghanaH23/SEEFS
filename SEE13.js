const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

// Define the Temple schema
const templeSchema = new mongoose.Schema({
  streetNumber: Number,
  name: String,
  visitorCount: Number,
  visitors: [Number]
});

// Create the Temple model
const Temple = mongoose.model('Temple', templeSchema);

async function main() {
  const uri = 'mongodb+srv://meghanahbsc:meghanahemanth23@cluster0.dmrwxaq.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection string

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    class TempleManager {
      constructor() {
        this.temples = [];
        this.sumStreetNumbers = 0;
        this.totalVisitors = 0;
      }

      async addTemple(streetNumber, name) {
        const temple = new Temple({
          streetNumber: streetNumber,
          name: name,
          visitorCount: 0,
          visitors: []
        });

        await temple.save();

        this.temples.push(temple);
        this.sumStreetNumbers += streetNumber;
      }

      async incrementVisitorCount(templeId) {
        const temple = this.temples.find((temple) => temple._id.toString() === templeId);
        if (temple) {
          temple.visitorCount++;
          this.totalVisitors++;
          temple.visitors.push(temple.visitorCount);
          await temple.save();
        }
      }

      async displayTempleDetails() {
        console.log("Temple details:");

        this.temples.forEach((temple) => {
          console.log(
            `Temple ID: ${temple._id}, Street Number: ${temple.streetNumber}, Name: ${temple.name}, Visitors: ${temple.visitorCount}`
          );
        });

        console.log("Total Visitors:", this.totalVisitors);
        console.log("Sum of Street Numbers:", this.sumStreetNumbers);
      }

      async updateTemple(templeId, updatedStreetNumber, updatedName) {
        const temple = this.temples.find((temple) => temple._id.toString() === templeId);
        if (temple) {
          temple.streetNumber = updatedStreetNumber;
          temple.name = updatedName;
          await temple.save();
        }
      }

      async deleteTemple(templeId) {
        const templeIndex = this.temples.findIndex((temple) => temple._id.toString() === templeId);
        if (templeIndex !== -1) {
          const deletedTemple = this.temples.splice(templeIndex, 1)[0];
          this.sumStreetNumbers -= deletedTemple.streetNumber;
          this.totalVisitors -= deletedTemple.visitorCount;
          await Temple.deleteOne({ _id: templeId });
        }
      }
    }

    const templeManager = new TempleManager();

    while (true) {
      const streetNumber = parseInt(prompt("Enter the street number of the temple (or 0 to stop): "));
      if (streetNumber === 0) {
        break;
      }

      const name = prompt("Enter the name of the temple: ");
      await templeManager.addTemple(streetNumber, name);
    }

    console.log("Enter the visitor count for each temple:");
    templeManager.temples.forEach((temple) => {
      const visitorCount = parseInt(prompt(`Enter the visitor count for temple ${temple._id}: `));
      for (let i = 0; i < visitorCount; i++) {
        templeManager.incrementVisitorCount(temple._id.toString());
      }
    });

    await templeManager.displayTempleDetails();

    // Example: Update a temple
    const templeToUpdateId = "6095c07ef3c31c28683db1cf"; // Replace with the actual temple ID
    const updatedStreetNumber = 123;
    const updatedName = "Updated Temple Name";
    await templeManager.updateTemple(templeToUpdateId, updatedStreetNumber, updatedName);
    console.log("Temple updated successfully.");

    // Example: Delete a temple
    const templeToDeleteId = "6095c084f3c31c28683db1d0"; // Replace with the actual temple ID
    await templeManager.deleteTemple(templeToDeleteId);
    console.log("Temple deleted successfully.");
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

main();

