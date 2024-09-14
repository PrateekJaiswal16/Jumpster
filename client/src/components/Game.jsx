import React, { useState, useEffect } from "react";
import Player from "./Player";
import Platform from "./Platform";
import axios from "axios";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { Howl, Howler } from "howler";

//sound files
import jumpSoundFile from "../assets/cartoon-jump-6462.mp3";
import highScoreSoundFile from "../assets/highscore.mp3";
import gameOverSoundFile from "../assets/wrong-buzzer-6268.mp3";
import backgroundMusicFile from "../assets/background.mp3";

const Game = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [playerY, setPlayerY] = useState(480);
  const [platforms, setPlatforms] = useState([]);
  const [isNearHighScore, setIsNearHighScore] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const jumpSound = new Howl({ src: [jumpSoundFile], volume: 0.5 });
  const highScoreSound = new Howl({ src: [highScoreSoundFile], volume: 0.5 });
  const gameOverSound = new Howl({ src: [gameOverSoundFile], volume: 0.5 });
  const backgroundMusic = new Howl({
    src: [backgroundMusicFile],
    volume: 0.1,
    loop: true, 
  });

  useEffect(() => {
    Modal.setAppElement("#root");
    backgroundMusic.play();

    return () => {
      backgroundMusic.stop();
    };
  }, []);

  function closeModal() {
    window.location.reload();
    setIsGameOver(false);
    setConfetti(false);
  }

  useEffect(() => {
    const fetchHighScore = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await axios.get(`/api/highscore`, {
          headers: { authorization: token },
        });
        setHighScore(response.data.highScore || 0);
      } catch (error) {
        console.error("Error fetching high score:", error);
        if (error.response && error.response.status === 401) {
          navigate("/");
        }
      }
    };

    fetchHighScore();
  }, [navigate]);

  useEffect(() => {
    if (score >= highScore * 0.7 && score < highScore) {
      setIsNearHighScore(true);
    } else {
      setIsNearHighScore(false);
    }
  }, [score, highScore]);

  const handleGameOver = async () => {
    setIsGameOver(true); 

    if (score > highScore) {
      setHighScore(score);
      setConfetti(true);
      setIsNewHighScore(true);
      highScoreSound.play(); 

      try {
        const token = localStorage.getItem("authToken");
        await axios.post(
          `/api/highscore`,
          { score },
          {
            headers: { authorization: token },
          }
        );
        console.log("High Score updated!");
      } catch (error) {
        console.error("Error updating high score:", error);
        if (error.response && error.response.status === 401) {
          navigate("/");
        }
      }
    }
    else{
      gameOverSound.play();
    }
  };

  const handleJump = () => {
    jumpSound.play(); 
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      borderRadius: "15px",
      backgroundColor: "#f0f8ff",
      boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.2)",
    },
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-300 to-blue-500 overflow-hidden">
      {confetti && <Confetti />}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none bg-clouds"></div>
      <div className="flex flex-col items-center justify-center h-full">
        <h2
          className={`text-2xl font-bold text-white drop-shadow-lg transition-all ${
            isNearHighScore ? "animate-pulse text-yellow-400" : ""
          }`}
        >
          Score: {score}
        </h2>
        <h3 className="text-xl text-white drop-shadow-md">High Score: {highScore}</h3>
        <div className="relative overflow-hidden rounded-3xl flex items-center justify-center w-3/12 h-[38rem] bg-blue-200 border border-gray-300 mt-4 shadow-lg">
          <Player
            score={score}
            isGameOver={isGameOver}
            setScore={setScore}
            onGameOver={handleGameOver}
            onJump={handleJump} 
            platformWidth={38}
            platformHeight={18}
            platforms={platforms}
            setPlayerY={setPlayerY}
          />
          <Platform
            playerY={playerY}
            isGameOver={isGameOver}
            setScore={setScore}
            setPlatforms={setPlatforms}
          />
        </div>

        <Modal
          isOpen={isGameOver}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Game Over Modal"
          shouldCloseOnOverlayClick={false}
          appElement={document.getElementById("root")}
        >
          <div className="text-center">
            {isNewHighScore ? (
              <h2 className="text-3xl font-bold text-green-500">
                Wow! New High Score!
              </h2>
            ) : (
              <h2 className="text-2xl font-bold">Game Over</h2>
            )}
            <p className="mt-4 text-lg">Your Score: {score}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Game;
