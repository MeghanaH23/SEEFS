import React, { useState } from 'react';
import WidgetWrapper from 'components/WidgetWrapper';

const TeamPlayer = () => {
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [averageScore, setAverageScore] = useState('');
  const [minimumScore, setMinimumScore] = useState('');
  const [maximumScore, setMaximumScore] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'averageScore':
        setAverageScore(value);
        break;
      case 'minimumScore':
        setMinimumScore(value);
        break;
      case 'maximumScore':
        setMaximumScore(value);
        break;
      default:
        break;
    }
  };

  const handleAddTeamPlayer = () => {
    const newTeamPlayer = {
      averageScore: averageScore,
      minimumScore: minimumScore,
      maximumScore: maximumScore
    };

    setTeamPlayers([...teamPlayers, newTeamPlayer]);
    setAverageScore('');
    setMinimumScore('');
    setMaximumScore('');
  };

  const handleDeleteTeamPlayer = (index) => {
    const updatedTeamPlayers = [...teamPlayers];
    updatedTeamPlayers.splice(index, 1);
    setTeamPlayers(updatedTeamPlayers);
  };

  return (
    <WidgetWrapper>
    <div className="container">
      <h1>Team Players</h1>
      <div>
        <label>Average Score:</label>
        <input type="number" name="averageScore" value={averageScore} onChange={handleInputChange} placeholder="Enter average score" />
      </div>
      <div>
        <label>Minimum Score:</label>
        <input type="number" name="minimumScore" value={minimumScore} onChange={handleInputChange} placeholder="Enter minimum score" />
      </div>
      <div>
        <label>Maximum Score:</label>
        <input type="number" name="maximumScore" value={maximumScore} onChange={handleInputChange} placeholder="Enter maximum score" />
      </div>
      <div>
        <button onClick={handleAddTeamPlayer}>Add Team Player</button>
      </div>
      <ul>
        {teamPlayers.map((teamPlayer, index) => (
          <li key={index}>
            <span>Average Score: {teamPlayer.averageScore}, Minimum Score: {teamPlayer.minimumScore}, Maximum Score: {teamPlayer.maximumScore}</span>
            <button onClick={() => handleDeleteTeamPlayer(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
    </WidgetWrapper>
  );
};

export default TeamPlayer;
