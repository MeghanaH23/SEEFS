const express = require('express');
const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://meghanahbsc:meghanahemanth23@cluster0.dmrwxaq.mongodb.net/teamplayers?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define the TeamPlayer schema
const teamPlayerSchema = new mongoose.Schema({
  averageScore: { type: Number, required: true },
  minimumScore: { type: Number, required: true },
  maximumScore: { type: Number, required: true },
});

// Define the TeamPlayer model
const TeamPlayerModel = mongoose.model('TeamPly', teamPlayerSchema);

class TeamPlayer {
  static playerId = 0;

  constructor(averageScore, minimumScore, maximumScore) {
    this.averageScore = averageScore;
    this.minimumScore = minimumScore;
    this.maximumScore = maximumScore;
    TeamPlayer.playerId++;
    this.id = TeamPlayer.playerId;
  }

  save() {
    const teamPlayerData = new TeamPlayerModel({
      averageScore: this.averageScore,
      minimumScore: this.minimumScore,
      maximumScore: this.maximumScore,
    });

    return teamPlayerData.save();
  }
}

const app = express();
app.use(express.json());

app.post('/team-players', (req, res) => {
  const { averageScore, minimumScore, maximumScore } = req.body;

  const player = new TeamPlayer(averageScore, minimumScore, maximumScore);
  player.save()
    .then(() => {
      res.status(201).json({ message: 'Team player added successfully.' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error adding team player.' });
    });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

function getUserInput() {
  const averageScore = parseFloat(prompt("Enter the average score of the player (or 0 to stop): "));
  if (averageScore === 0) {
    return;
  }

  const minimumScore = parseFloat(prompt("Enter the minimum score of the player: "));
  const maximumScore = parseFloat(prompt("Enter the maximum score of the player: "));

  const teamPlayer = { averageScore, minimumScore, maximumScore };

  fetch('http://localhost:3000/team-players', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teamPlayer)
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      getUserInput(); // Recursive call to get more input
    })
    .catch((error) => console.error('Error:', error));
}

getUserInput();
