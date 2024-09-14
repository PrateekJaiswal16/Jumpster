import React, { useState, useEffect } from "react";
import left from "../assets/doodler-left.png";
import right from "../assets/doodler-right.png";

const Player = ({
  setScore,
  onGameOver,
  onJump,
  platformWidth,
  platformHeight,
  platforms,
  isGameOver,
}) => {
  const [position, setPosition] = useState({ x: 180, y: 480 });
  const [velocity, setVelocity] = useState({ x: 0, y: -10 });
  const [image, setImage] = useState(right);
  const [highestY, setHighestY] = useState(position.y);

  const gravity = 0.1;
  const initialVelocityY = -5.0; 
  const boardWidth = 360;
  const boardHeight = 576;
  const finishLevel = 50; 
  const topBoundary = 20; 

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "d") {
      setVelocity((prev) => ({ ...prev, x: 6 })); // Increased speed for smoother movement
      setImage(right);
    } else if (e.key === "ArrowLeft" || e.key === "a") {
      setVelocity((prev) => ({ ...prev, x: -6 })); // Increased speed for smoother movement
      setImage(left);
    }
  };

  const handleKeyUp = (e) => {
    if (
      e.key === "ArrowRight" ||
      e.key === "ArrowLeft" ||
      e.key === "d" ||
      e.key === "a"
    ) {
      setVelocity((prev) => ({ ...prev, x: 0 }));
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    console.log("hi");
  }, []);

  useEffect(() => {
    if(isGameOver) {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  }, [isGameOver]);

  useEffect(() => {
    if (!isGameOver) {
      const interval = setInterval(() => {
        setPosition((prev) => {
          const newY = prev.y + velocity.y;
          const newX = prev.x + velocity.x;

          // Boundary checks
          let boundedX = newX;
          if (boundedX < 0) boundedX = 0;
          if (boundedX > boardWidth - 46) boundedX = boardWidth - 46;

          // Stop player if it crosses the top boundary
          let boundedY = newY;
          if (boundedY < topBoundary) boundedY = topBoundary;

          // Stop player if it crosses the bottom boundary
          if (boundedY > boardHeight - finishLevel) {
            boundedY = boardHeight - finishLevel;
            clearInterval(interval);
            onGameOver();
          }

          setVelocity((v) => ({ ...v, y: v.y + gravity }));

          if (boundedY < highestY) {
            const heightDifference = highestY - boundedY;
            //increase score on basis of kinta pixel jump kra
            if (heightDifference >= 10) {
              setScore(
                (prevScore) => prevScore + Math.floor(heightDifference / 10)
              );
              setHighestY(boundedY); 
            }
          } else {
            setHighestY(boundedY); 
          }

          return { x: boundedX, y: boundedY };
        });
      }, 20); 

      return () => clearInterval(interval);
    }
  }, [velocity, position, onGameOver, highestY, setScore, isGameOver]);

  useEffect(() => {
    detectCollision(platforms);
  }, [platforms, position]);

  const detectCollision = (platforms) => {
    for (let plat of platforms) {
      if (
        position.x < plat.x + platformWidth &&
        position.x + 46 > plat.x &&
        position.y + 46 > plat.y &&
        position.y + 46 < plat.y + platformHeight &&
        velocity.y > 0
      ) {
        setPosition((prev) => ({
          ...prev,
          y: plat.y - 80, 
        }));

        // Resest speed for bounce effect
        setVelocity((v) => ({ ...v, y: initialVelocityY }));

        onJump();
        return;
      }
    }
  };

  return (
    <div
      className="absolute w-12 h-12"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
      }}
    ></div>
  );
};

export default Player;
