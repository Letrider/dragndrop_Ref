import { useCallback } from 'react';
import Ship from './Ship';

const Board = ({ 
  ships, 
  draggedShip, 
  cursorOffset, 
  onShipMove, 
  onRotateShip,
  onDragStart, 
  onDragEnd,
  setCursorOffset,
  validatePosition
}) => {
  const cellSize = 30; // Размер клетки
  const gap = 20; // Расстояние между клетками

  const handleMouseMove = useCallback((e) => {
    if (!draggedShip) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - cursorOffset.x) / (cellSize + gap));
    const y = Math.floor((e.clientY - rect.top - cursorOffset.y) / (cellSize + gap));

    // Проверяем, что новые координаты допустимы
    if (validatePosition(draggedShip, x, y)) {
      onShipMove(draggedShip.id, x, y, draggedShip.isVertical);
    }
  }, [draggedShip, cursorOffset, onShipMove, validatePosition, cellSize, gap]);

  return (
    <div 
      className="board"
      onMouseMove={handleMouseMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
    >
      {[...Array(10)].map((_, y) => (
        [...Array(10)].map((_, x) => (
          <div 
            key={`${x}-${y}`} 
            className="cell"
            style={{
              left: x * (cellSize + gap),
              top: y * (cellSize + gap)
            }}
          />
        ))
      ))}
      
      {ships.map(ship => (
        <Ship
          key={ship.id}
          ship={ship}
          isDragging={draggedShip?.id === ship.id}
          onDragStart={onDragStart}
          setCursorOffset={setCursorOffset}
          onRotateShip={onRotateShip}
          cellSize={cellSize}
          gap={gap}
        />
      ))}
    </div>
  );
};

export default Board;