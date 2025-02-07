import React, { useState, useCallback } from 'react';
import Board from './components/Board';
import './App.css';

const initialShips = [
  { id: 1, width: 1, height: 2, x: 0, y: 0 }, 
  { id: 2, width: 2, height: 1, x: 2, y: 0 }, 
  { id: 3, width: 2, height: 2, x: 4, y: 0 }, 
  { id: 4, width: 1, height: 1, x: 6, y: 0 }, 
];

export default function App() {
  const [ships, setShips] = useState(initialShips);
  const [draggedShip, setDraggedShip] = useState(null);
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });

  const validatePosition = useCallback((ship, x, y) => {
    // проверка на отрицательные координаты
    if (x < 0 || y < 0) return false;
  
    // проверка на выход за правую и нижнюю границы
    if (x + ship.width > 10 || y + ship.height > 10) return false;
  
    // проверка коллизий с другими кораблями
    return ships.every(otherShip => {
      if (otherShip.id === ship.id) {
        return true;
      }
      return !checkCollision(ship, otherShip);
    });
  }, [ships]);

  const checkCollision = useCallback((ship1, ship2) => {
    const ship1Cells = getShipCells(ship1);
    const ship2Cells = getShipCells(ship2);
    return ship1Cells.some(cell1 => 
      ship2Cells.some(cell2 => 
        cell1.x === cell2.x && cell1.y === cell2.y
      )
    );
  }, []);

  const getShipCells = useCallback((ship) => {
    const cells = [];
    for (let i = 0; i < ship.size; i++) {
      cells.push({
        x: ship.isVertical ? ship.x : ship.x + i,
        y: ship.isVertical ? ship.y + i : ship.y
      });
    }
    return cells;
  }, []);

  const handleMoveShip = useCallback((shipId, newX, newY, isVertical) => {
    setShips(prev => prev.map(ship => {
      if (ship.id !== shipId) return ship;
      const newShip = { ...ship, x: newX, y: newY, isVertical };
      return validatePosition(newShip, newX, newY) ? newShip : ship;
    }));
  }, [validatePosition]);

  const handleRotateShip = useCallback((shipId) => {
    setShips(prev => prev.map(ship => {
      if (ship.id !== shipId) return ship;
  
      const newWidth = ship.height;
      const newHeight = ship.width;
  
      // корректировка позиции, чтобы корабль не выходил за границы
      let newX = ship.x;
      let newY = ship.y;
  
      if (newX + newWidth > 10) {
        newX = 10 - newWidth;
      }
      if (newY + newHeight > 10) {
        newY = 10 - newHeight;
      }
  
      const newShip = { ...ship, width: newWidth, height: newHeight, x: newX, y: newY };
      return validatePosition(newShip, newX, newY) ? newShip : ship;
    }));
  }, [validatePosition]);

  return (
    <div className="game">
      <Board 
        ships={ships}
        draggedShip={draggedShip}
        cursorOffset={cursorOffset}
        onShipMove={handleMoveShip}
        onRotateShip={handleRotateShip}
        onDragStart={setDraggedShip}
        onDragEnd={() => setDraggedShip(null)}
        setCursorOffset={setCursorOffset}
        validatePosition={validatePosition}
      />
    </div>
  );
}