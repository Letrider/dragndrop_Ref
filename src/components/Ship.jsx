import { useCallback } from 'react';

const Ship = ({ ship, isDragging, onDragStart, setCursorOffset, cellSize, gap }) => {
	const handleMouseDown = useCallback((e) => {
	  const rect = e.currentTarget.getBoundingClientRect();
	  setCursorOffset({
		 x: e.clientX - rect.left,
		 y: e.clientY - rect.top
	  });
	  onDragStart(ship);
	}, [ship, onDragStart, setCursorOffset]);
 
	return (
	  <div
		 className={`ship ${isDragging ? 'dragging' : ''}`}
		 style={{

			width: ship.width * cellSize + (ship.width - 1) * gap + 4 ,
			height: ship.height * cellSize + (ship.height - 1) * gap + 4,

			left: ship.x * (cellSize + gap),
			top: ship.y * (cellSize + gap),

			background: '#222',
			cursor: isDragging ? 'grabbing' : 'grab'
		 }}
		 onMouseDown={handleMouseDown}
	  />
	);
 };

export default Ship;