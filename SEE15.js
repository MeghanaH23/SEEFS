const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://meghanahbsc:meghanahemanth23@cluster0.dmrwxaq.mongodb.net/?retryWrites=true&w=majority  ', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the ConstructionWorker schema
const workerSchema = new mongoose.Schema({
  name: String,
  wage: Number,
});

// Create the ConstructionWorker model
const ConstructionWorkerModel = mongoose.model('ConstructionWorker', workerSchema);

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

  async addWorker(worker) {
    const workerModel = new ConstructionWorkerModel(worker);
    await workerModel.save();
    this.workers.push(workerModel);
  }

  async getAllWorkers(workerName) {
    return await ConstructionWorkerModel.findOne({ name: workerName });
  }

  async calculateTotalWages(days) {
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
    await team.addWorker(worker);
  }

  const days = parseInt(prompt("Enter the number of days: "));
  const totalWages = await team.calculateTotalWages(days);

  console.log(`Total wages for ${days} days: $${totalWages.toFixed(2)}`);

  // Retrieve all workers from MongoDB
  const allWorkers = await team.getAllWorkers();
  console.log("All workers:", allWorkers);
}

main();
