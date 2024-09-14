import React, { useState, useEffect } from "react";
import platformImage from "../assets/platform.png";

const Platform = ({ playerY, setScore, setPlatforms, isGameOver }) => {
  const [platforms, setPlatformsState] = useState([]);

  const boardWidth = 360;
  const boardHeight = 571;
  const platformWidth = 60;
  const platformHeight = 18;

  useEffect(() => {
    const generatePlatforms = () => {
      let plats = [];
      for (let i = 0; i < 8; i++) {
        plats.push({
          x: Math.random() * (boardWidth - platformWidth),
          y: boardHeight - 75 * i - 150,
        });
      }
      setPlatformsState(plats);
    };
    generatePlatforms();
  }, []);

  useEffect(() => {
    const updatePlatforms = () => {
      setPlatformsState((prevPlatforms) => {
        let newPlatforms = prevPlatforms.map((plat) => ({
          ...plat,
          y: plat.y + 5,
        }));

        if (playerY < (boardHeight * 3) / 4) {
          newPlatforms = newPlatforms.map((plat) => ({
            ...plat,
            y: plat.y - 8,
          }));
        }

        newPlatforms = newPlatforms.filter((plat) => plat.y < boardHeight);
        while (newPlatforms.length < 6) {
          newPlatforms.push({
            x: Math.random() * (boardWidth - platformWidth),
            y: -platformHeight,
          });
        }
        return newPlatforms;
      });
    };

    if (!isGameOver) {
      const interval = setInterval(() => {
        updatePlatforms();
        setPlatforms(platforms);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [playerY, isGameOver, setPlatforms, platforms, boardWidth, boardHeight, platformWidth, platformHeight]);

  return (
    <>
      {platforms.map((plat, index) => (
        <img
          key={index}
          src={platformImage}
          alt="Platform"
          className="absolute"
          style={{
            left: `${plat.x}px`,
            top: `${plat.y}px`,
            width: `${platformWidth}px`,
            height: `${platformHeight}px`,
          }}
        />
      ))}
    </>
  );
};

export default Platform;
