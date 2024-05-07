import { NUM_FLOORS } from "./constants";

export const generateRandomBoxes = (difficulty) => {
	const boxes = [];
	let BOX_PER_FLOOR = 0;
	let NUM_GEMS = 0;
	let NUM_BOMBS = 0;

	switch (difficulty) {
		case "Normal":
			BOX_PER_FLOOR = 4;
			NUM_GEMS = 3;
			NUM_BOMBS = 1;
			break;
		case "Medium":
			BOX_PER_FLOOR = 3;
			NUM_GEMS = 2;
			NUM_BOMBS = 1;
			break;
		case "Hard":
			BOX_PER_FLOOR = 3;
			NUM_GEMS = 1;
			NUM_BOMBS = 2;
			break;
		case "Impossible":
			BOX_PER_FLOOR = 4;
			NUM_GEMS = 1;
			NUM_BOMBS = 3;
			break;
		default:
			break;
	}

	for (let i = 0; i < NUM_FLOORS; i++) {
		const floor = [];
		for (let j = 0; j < BOX_PER_FLOOR; j++) {
			floor.push({ type: "empty", revealed: false });
		}

		// Add gems
		for (let k = 0; k < NUM_GEMS; k++) {
			let randomIndex = Math.floor(Math.random() * floor.length);
			while (floor[randomIndex].type !== "empty") {
				randomIndex = Math.floor(Math.random() * floor.length);
			}
			floor[randomIndex] = { type: "gem", revealed: false };
		}

		// Add bombs
		for (let l = 0; l < NUM_BOMBS; l++) {
			let randomIndex = Math.floor(Math.random() * floor.length);
			while (floor[randomIndex].type !== "empty") {
				randomIndex = Math.floor(Math.random() * floor.length);
			}
			floor[randomIndex] = { type: "bomb", revealed: false };
		}
		boxes.push(floor);
	}
	return boxes;
};
