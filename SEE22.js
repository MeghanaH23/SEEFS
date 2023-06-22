const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://meghanahbsc:meghanahemanth23@cluster0.dmrwxaq.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const teamPlayerSchema = new mongoose.Schema({
  averageScore: Number,
  minimumScore: Number,
  maximumScore: Number
});

const TeamPlayer = mongoose.model('TeamPlayer', teamPlayerSchema);

async function main() {
  class TeamPlayerManager {
    constructor() {
      this.teamPlayers = [];
      this.totalAverageScore = 0;
    }

    async addTeamPlayer(averageScore, minimumScore, maximumScore) {
      const player = new TeamPlayer({ averageScore, minimumScore, maximumScore });
      await player.save();
      this.teamPlayers.push(player);
      this.totalAverageScore += averageScore;
    }

    async updateTeamPlayer(playerId, updatedPlayer) {
      const player = await TeamPlayer.findOneAndUpdate({ _id: playerId }, updatedPlayer, { new: true });
      if (player) {
        const index = this.teamPlayers.findIndex((p) => p._id.toString() === playerId);
        if (index !== -1) {
          this.teamPlayers[index] = player;
        }
        console.log(`Team Player with ID ${playerId} has been updated.`);
      } else {
        console.log(`Team Player with ID ${playerId} not found.`);
      }
    }

    async deleteTeamPlayer(playerId) {
      const result = await TeamPlayer.deleteOne({ _id: playerId });
      if (result.deletedCount === 1) {
        this.teamPlayers = this.teamPlayers.filter((player) => player._id.toString() !== playerId);
        console.log(`Team Player with ID ${playerId} has been deleted.`);
      } else {
        console.log(`Team Player with ID ${playerId} not found.`);
      }
    }

    async displayTeamPlayerDetails() {
      console.log("Team Player details:");
      this.teamPlayers.forEach((player) => {
        console.log(
          `Player ID: ${player._id}, Average Score: ${player.averageScore}, Minimum Score: ${player.minimumScore}, Maximum Score: ${player.maximumScore}`
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
    const playerId = prompt("Enter the Player ID to update: ");
    const averageScore = parseFloat(prompt("Enter the updated average score: "));
    const minimumScore = parseFloat(prompt("Enter the updated minimum score: "));
    const maximumScore = parseFloat(prompt("Enter the updated maximum score: "));
    const updatedPlayer = { averageScore, minimumScore, maximumScore };
    await teamPlayerManager.updateTeamPlayer(playerId, updatedPlayer);
  } else if (operation === "delete") {
    const playerId = prompt("Enter the Player ID to delete: ");
    await teamPlayerManager.deleteTeamPlayer(playerId);
  } else {
    console.log("Invalid operation.");
  }

  await teamPlayerManager.displayTeamPlayerDetails();

  mongoose.connection.close();
}

main().catch(console.error);
