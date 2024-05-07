import { useEffect, useState } from "react";

import Box from "./components/Box";
import { generateRandomBoxes } from "./utils/gameUtils";
import {
	DIFFICULTIES,
	GAME_ACTIVATION_COST,
	NUM_FLOORS,
} from "./utils/constants";

const App = () => {
	const [floor, setFloor] = useState(0);
	const [difficulty, setDifficulty] = useState("Normal");
	const [boxes, setBoxes] = useState([]);
	const [autoPlay, setAutoPlay] = useState(false);
	const [remainingRounds, setRemainingRounds] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState(false);
	const [playerBalance, setPlayerBalance] = useState(100);
	const [insufficientPoints, setInsufficientPoints] = useState(false);
	const [gameActivated, setGameActivated] = useState(false);

	useEffect(() => {
		setBoxes(generateRandomBoxes(difficulty));
	}, [difficulty]);

	useEffect(() => {
		if (autoPlay && remainingRounds > 0 && floor < NUM_FLOORS && !gameOver) {
			const interval = setInterval(() => {
				const rowIndex = boxes.length - 1 - floor;
				const colIndex = Math.floor(Math.random() * boxes[rowIndex].length);
				handleClick(boxes[rowIndex][colIndex], rowIndex, colIndex);
				setRemainingRounds((prevRounds) => prevRounds - 1);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [autoPlay, remainingRounds, floor, boxes, gameOver]);

	const handleAutoPlayToggle = () => {
		setAutoPlay((prevAutoPlay) => !prevAutoPlay);
	};

	const handleRemainingRoundsChange = (e) => {
		const rounds = parseInt(e.target.value);
		setRemainingRounds(rounds);
	};

	const handleDifficultyChange = (e) => {
		setDifficulty(e.target.value);
		setGameActivated(false);
		setPlayerBalance(100);
		setFloor(0);
		setGameOver(false);
		setWinner(false);
		setRemainingRounds(0);
		setAutoPlay(false);
		setInsufficientPoints(false);
	};

	const handleStart = () => {
		setFloor(0);
		setBoxes(generateRandomBoxes(difficulty));
		setAutoPlay(false);
		setRemainingRounds(0);
		setGameOver(false);
		setWinner(false);
	};

	const handleActivateGame = () => {
		if (playerBalance >= GAME_ACTIVATION_COST) {
			setPlayerBalance(playerBalance - GAME_ACTIVATION_COST);
			setGameActivated(true);
			handleStart();
		} else {
			setInsufficientPoints(true);
		}
	};

	const handleClick = (box, rowIndex, colIndex) => {
		if (rowIndex !== boxes.length - 1 - floor || gameOver) {
			return;
		}
		const newBoxes = [...boxes];
		newBoxes[rowIndex][colIndex].revealed = true;
		if (box.type === "gem") {
			if (floor + 1 === NUM_FLOORS) {
				setWinner(true);
				setGameOver(true);
				setGameActivated(false);
			} else {
				setFloor(floor + 1);
				setBoxes(newBoxes);
			}
		} else {
			const updatedBoxes = newBoxes.map((floorBoxes) =>
				floorBoxes.map((box) => ({
					...box,
					revealed: true,
				}))
			);
			setBoxes(updatedBoxes);
			setGameOver(true);
			setGameActivated(false);
		}
	};

	return (
		<div className="app">
			<div className="game-header">
				<h1>Tower Quest</h1>
			</div>
			{gameOver && !winner && !insufficientPoints && (
				<h4 className="game-over">Game Over! You hit a bomb.</h4>
			)}
			{winner && (
				<h4 className="winner">
					Congratulations! You reached the top floor without hitting a bomb!
				</h4>
			)}
			{insufficientPoints && (
				<h4 className="game-over">Insufficient points to activate the game.</h4>
			)}

			<div className="game-controls">
				<div className="game-activate">
					<div>
						<button onClick={handleActivateGame} disabled={gameActivated}>
							Activate Game (-{GAME_ACTIVATION_COST} points)
						</button>
					</div>

					<div className="controls">
						<label htmlFor="difficulty">Select Difficulty:</label>
						<select
							id="difficulty"
							value={difficulty}
							onChange={handleDifficultyChange}
						>
							{DIFFICULTIES.map((diff) => (
								<option key={diff.name} value={diff.name}>
									{diff.description}
								</option>
							))}
						</select>
					</div>

					<div className="floor">Active Floor {floor + 1}</div>
					<div className="floor">Remaining Floor(s) {8 - (floor + 1)}</div>
				</div>
				<div className="game-balance">
					<p className="player-balance">Player Balance: {playerBalance}</p>

					<div className="auto-play-controls">
						<div className="autoPlay">
							<label htmlFor="auto-play-checkbox">Auto-play:</label>
							<input
								id="auto-play-checkbox"
								type="checkbox"
								checked={autoPlay}
								onChange={handleAutoPlayToggle}
								disabled={!gameActivated}
							/>
						</div>
						{autoPlay && !gameOver && (
							<div className="rounds">
								<label htmlFor="remaining-rounds">Rounds:</label>
								<input
									id="remaining-rounds"
									type="number"
									value={remainingRounds}
									onChange={handleRemainingRoundsChange}
									disabled={!autoPlay}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className={`game-board ${gameActivated ? "" : "disabled"}`}>
				{boxes.reverse().map((floorBoxes, floorIndex) => (
					<div key={floorIndex}>
						{floorBoxes.map((box, boxIndex) => (
							<Box
								key={boxIndex}
								box={box}
								isActive={floorIndex === boxes.length - 1 - floor}
								onClick={() => handleClick(box, floorIndex, boxIndex)}
								gameActivated={gameActivated}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default App;
