const prompt = require('prompt-sync')();
const { MongoClient } = require('mongodb');

class ConstructionWorker {
  constructor(name, wage) {
    this.name = name;
    this.wage = wage;
  }
}

class ConstructionTeam {
  constructor() {
    this.workers = [];
  }

  addWorker(worker) {
    this.workers.push(worker);
  }

  calculateTotalWages(days) {
    let totalWages = 0;
    for (const worker of this.workers) {
      totalWages += worker.wage * days;
    }
    return totalWages;
  }
}

async function main() {
  const team = new ConstructionTeam();
  const numberOfWorkers = parseInt(prompt("Enter the number of workers: "));

  for (let i = 0; i < numberOfWorkers; i++) {
    const name = prompt(`Enter the name of worker ${i + 1}: `);
    const wage = parseFloat(prompt(`Enter the wage for worker ${i + 1}: `));
    const worker = new ConstructionWorker(name, wage);
    team.addWorker(worker);
  }

  const days = parseInt(prompt("Enter the number of days: "));
  const totalWages = team.calculateTotalWages(days);

  console.log(`Total wages for ${days} days: $${totalWages.toFixed(2)}`);

  // MongoDB CRUD operations
  const uri = 'mongodb+srv://meghanahbsc:meghanahemanth23@cluster0.dmrwxaq.mongodb.net/?retryWrites=true&w=majority'; // MongoDB connection URI
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // Create
    const database = client.db('construction'); // Replace 'construction' with your database name
    const collection = database.collection('workers'); // Replace 'workers' with your collection name

    for (const worker of team.workers) {
      await collection.insertOne(worker);
    }

    console.log('Workers inserted into the database.');

    // Read
    const cursor = collection.find({});
    const savedWorkers = await cursor.toArray();
    console.log('Saved workers:');
    console.log(savedWorkers);

    // Update (assuming you want to update the wage of the first worker)
    const filter = { name: team.workers[0].name };
    const update = { $set: { wage: 1000 } };
    await collection.updateOne(filter, update);
    console.log('Worker updated.');

    // Delete (assuming you want to delete the second worker)
    const deleteFilter = { name: team.workers[1].name };
    await collection.deleteOne(deleteFilter);
    console.log('Worker deleted.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

main();

