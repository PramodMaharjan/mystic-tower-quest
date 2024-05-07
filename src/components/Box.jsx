/* eslint-disable */
const Box = ({ box, onClick, isActive, gameActivated }) => {
	return (
		<div
			className={`box ${box.revealed ? box.type : "unrevealed"} ${
				isActive && gameActivated ? "active-floor" : ""
			}`}
			onClick={onClick}
		>
			{box.revealed ? (box.type === "gem" ? "💎" : "💣") : "🎁"}
		</div>
	);
};

export default Box;
