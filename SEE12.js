const prompt = require('prompt-sync')();
const { MongoClient } = require('mongodb');

class Temple {
  static templeId = 0;

  constructor(streetNumber, name) {
    this.streetNumber = streetNumber;
    this.name = name;
    Temple.templeId++;
    this.id = Temple.templeId;
    this.visitorCount = 0;
    this.visitors = [];
  }
}

async function main() {
  const uri = 'mongodb+srv://meghanahbsc:meghanahemanth23@cluster0.dmrwxaq.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection string
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('templesdb');
    const collection = database.collection('temples');

    class TempleManager {
      constructor() {
        this.temples = [];
        this.sumStreetNumbers = 0;
        this.totalVisitors = 0;
      }

      async addTemple(streetNumber, name) {
        const temple = new Temple(streetNumber, name);
        this.temples.push(temple);
        this.sumStreetNumbers += streetNumber;

        const templeData = {
          streetNumber: temple.streetNumber,
          name: temple.name,
          id: temple.id,
          visitorCount: temple.visitorCount,
          visitors: temple.visitors
        };

        await collection.insertOne(templeData);
      }

      async incrementVisitorCount(templeId) {
        const temple = this.temples.find((temple) => temple.id === templeId);
        if (temple) {
          temple.visitorCount++;
          this.totalVisitors++;

          await collection.updateOne(
            { id: temple.id },
            { $inc: { visitorCount: 1 } }
          );
        }
      }

      async displayTempleDetails() {
        console.log("Temple details:");
        const templeData = await collection.find().toArray();
        templeData.forEach((data) => {
          const temple = new Temple(
            data.streetNumber,
            data.name
          );
          temple.id = data.id;
          temple.visitorCount = data.visitorCount;
          temple.visitors = data.visitors;
          this.temples.push(temple);
          this.sumStreetNumbers += temple.streetNumber;
          this.totalVisitors += temple.visitorCount;

          console.log(
            `Temple ID: ${temple.id}, Street Number: ${temple.streetNumber}, Name: ${temple.name}, Visitors: ${temple.visitorCount}`
          );
        });

        console.log("Total Visitors:", this.totalVisitors);
        console.log("Sum of Street Numbers:", this.sumStreetNumbers);
      }

      async updateTemple(templeId, updatedStreetNumber, updatedName) {
        const temple = this.temples.find((temple) => temple.id === templeId);
        if (temple) {
          temple.streetNumber = updatedStreetNumber;
          temple.name = updatedName;

          await collection.updateOne(
            { id: temple.id },
            { $set: { streetNumber: temple.streetNumber, name: temple.name } }
          );
        }
      }

      async deleteTemple(templeId) {
        const templeIndex = this.temples.findIndex((temple) => temple.id === templeId);
        if (templeIndex !== -1) {
          const deletedTemple = this.temples.splice(templeIndex, 1)[0];
          this.sumStreetNumbers -= deletedTemple.streetNumber;
          this.totalVisitors -= deletedTemple.visitorCount;

          await collection.deleteOne({ id: templeId });
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
      const visitorCount = parseInt(prompt(`Enter the visitor count for temple ${temple.id}: `));
      for (let i = 0; i < visitorCount; i++) {
        templeManager.incrementVisitorCount(temple.id);
        temple.visitors.push(i + 1);
      }
    });

    templeManager.displayTempleDetails();

    // Example: Update a temple
    const templeToUpdateId = 1;
    const updatedStreetNumber = 123;
    const updatedName = "Updated Temple Name";
    await templeManager.updateTemple(templeToUpdateId, updatedStreetNumber, updatedName);
    console.log("Temple updated successfully.");

    // Example: Delete a temple
    const templeToDeleteId = 2;
    await templeManager.deleteTemple(templeToDeleteId);
    console.log("Temple deleted successfully.");
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

main();
