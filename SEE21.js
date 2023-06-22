const prompt = require('prompt-sync')();
const { MongoClient } = require('mongodb');

class TeamPlayer {
  static playerId = 0;

  constructor(averageScore, minimumScore, maximumScore) {
    this.averageScore = averageScore;
    this.minimumScore = minimumScore;
    this.maximumScore = maximumScore;
    TeamPlayer.playerId++;
    this.id = TeamPlayer.playerId;
  }
}

async function main() {
  const client = new MongoClient('mongodb+srv://meghanahbsc:meghanahemanth23@cluster0.dmrwxaq.mongodb.net/?retryWrites=true&w=majority');

  try {
    await client.connect();

    const database = client.db('test');
    const teamPlayerCollection = database.collection('teamPlayers');

    class TeamPlayerManager {
      constructor() {
        this.teamPlayers = [];
        this.totalAverageScore = 0;
      }

      async addTeamPlayer(averageScore, minimumScore, maximumScore) {
        const player = new TeamPlayer(averageScore, minimumScore, maximumScore);
        this.teamPlayers.push(player);
        this.totalAverageScore += averageScore;
        await teamPlayerCollection.insertOne(player);
      }

      async updateTeamPlayer(playerId, updatedPlayer) {
        const result = await teamPlayerCollection.updateOne({ id: playerId }, { $set: updatedPlayer });
        if (result.modifiedCount === 1) {
          const index = this.teamPlayers.findIndex((player) => player.id === playerId);
          if (index !== -1) {
            this.teamPlayers[index] = updatedPlayer;
          }
          console.log(`Team Player with ID ${playerId} has been updated.`);
        } else {
          console.log(`Team Player with ID ${playerId} not found.`);
        }
      }

      async deleteTeamPlayer(playerId) {
        const result = await teamPlayerCollection.deleteOne({ id: playerId });
        if (result.deletedCount === 1) {
          this.teamPlayers = this.teamPlayers.filter((player) => player.id !== playerId);
          console.log(`Team Player with ID ${playerId} has been deleted.`);
        } else {
          console.log(`Team Player with ID ${playerId} not found.`);
        }
      }

      async displayTeamPlayerDetails() {
        console.log("Team Player details:");
        const cursor = teamPlayerCollection.find();
        await cursor.forEach((player) => {
          console.log(
            `Player ID: ${player.id}, Average Score: ${player.averageScore}, Minimum Score: ${player.minimumScore}, Maximum Score: ${player.maximumScore}`
          );
        });
        console.log("Total Average Score:", this.totalAverageScore);
      }
    }

    const teamPlayerManager = new TeamPlayerManager();

    while (true) {
      const averageScore = parseFloat(prompt("Enter the average score of the player (or 0 to stop): "));
      if (averageScore === 0) {
        break;
      }

      const minimumScore = parseFloat(prompt("Enter the minimum score of the player: "));
      const maximumScore = parseFloat(prompt("Enter the maximum score of the player: "));
      await teamPlayerManager.addTeamPlayer(averageScore, minimumScore, maximumScore);
    }

    await teamPlayerManager.displayTeamPlayerDetails();

    const operation = prompt("Enter the operation (update/delete): ");
    if (operation === "update") {
      const playerId = parseInt(prompt("Enter the Player ID to update: "));
      const averageScore = parseFloat(prompt("Enter the updated average score: "));
      const minimumScore = parseFloat(prompt("Enter the updated minimum score: "));
      const maximumScore = parseFloat(prompt("Enter the updated maximum score: ")); // Fix: Add the missing line
      const updatedPlayer = new TeamPlayer(averageScore, minimumScore, maximumScore);
      await teamPlayerManager.updateTeamPlayer(playerId, updatedPlayer);
    } else if (operation === "delete") {
      const playerId = parseInt(prompt("Enter the Player ID to delete: "));
      await teamPlayerManager.deleteTeamPlayer(playerId);
    } else {
      console.log("Invalid operation.");
    }

    await teamPlayerManager.displayTeamPlayerDetails();
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

main().catch(console.error);
