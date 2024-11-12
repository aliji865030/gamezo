import React, { useEffect, useState } from "react";

const RainfallGame = () => {
  const gridSize = { rows: 15, cols: 20 }; 
  const fadeSteps = 5;
  const cellSize = 30; 
  const [raindrops, setRaindrops] = useState([]);

  // Function to generate a random color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Initialize the raindrops
  const initializeRaindrops = () => {
    const drops = Array.from({ length: gridSize.cols }).map(() => ({
      y: 0, // Start at the top of the grid
      trail: [],
      colIndex: Math.floor(Math.random() * gridSize.cols), // Random column index
      color: getRandomColor(), // Unique color for each raindrop
      delay: Math.floor(Math.random() * 20), // Random delay for initial fall
      active: true, // Raindrop is initially active
    }));
    setRaindrops(drops);
  };

  // Move raindrops down the grid
  const updateRaindrops = () => {
    setRaindrops((prevDrops) =>
      prevDrops.map((drop) => {
        if (!drop.active && drop.delay > 0) {
          // Wait before restarting the raindrop
          return { ...drop, delay: drop.delay - 1 };
        }

        // Check if the entire trail, including the last segment, has reached the bottom
        const lastTrailY = drop.trail.length > 0 ? drop.trail[drop.trail.length - 1].y : 0;
        if (lastTrailY >= gridSize.rows - 1) {
          // Reset the raindrop when the tail reaches the bottom
          return {
            ...drop,
            y: 0,
            trail: [],
            color: getRandomColor(), // Assign a new color for variety
            delay: Math.floor(Math.random() * 20), // Random delay before falling again
            active: false, 
          };
        }

        // Update the trail to create the fading effect
        const newTrail = [{ y: drop.y, opacity: 1 }, ...drop.trail]
          .slice(0, fadeSteps) 
          .map((segment, i) => ({
            ...segment,
            opacity: Math.max(0, 1 - i * (1 / fadeSteps)), 
          }));

        return {
          ...drop,
          y: Math.min(drop.y + 1, gridSize.rows - 1),
          trail: newTrail,
          active: true, 
        };
      })
    );
  };

  useEffect(() => {
    initializeRaindrops();
    const intervalId = setInterval(updateRaindrops, 100); // Adjust speed as needed

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Rainfall Game</h1>
        <p className="text-lg mb-8">Watch the colorful raindrops fall!</p>
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize.cols}, ${cellSize}px)`,
            gap: "0px",
            width: `60%`, 
            height: `${gridSize.rows * cellSize}px`,
          }}
        >
          {/* Render the grid */}
          {Array.from({ length: gridSize.rows * gridSize.cols }).map((_, index) => (
            <div
              key={index}
              className="w-full h-full bg-gray-800 border border-gray-700"
              style={{ boxSizing: "border-box" }}
            ></div>
          ))}

          {/* Render the raindrops */}
          {raindrops.map((drop) =>
            drop.trail.map((segment, trailIndex) => (
              <div
                key={`${drop.colIndex}-${trailIndex}`}
                className="absolute"
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  top: `${segment.y * cellSize}px`,
                  left: `${drop.colIndex * cellSize}px`,
                  backgroundColor: `${drop.color}`,
                  opacity: segment.opacity,
                  transition: "top 0.15s linear",
                }}
              ></div>
            ))
          )}
        </div>

        {/* Game UI */}
        <p className="mt-4 text-sm text-gray-400">Enjoy the falling raindrop pattern!</p>
      </div>
    </div>
  );
};

export default RainfallGame;
