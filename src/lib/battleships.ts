export const CELL_TYPES = {
  NOTHING: {
    textIcon: '',
    image: "/assets/battleships/empty.png",
  },
  MISS: {
    textIcon: '.',
    image: "/assets/battleships/miss.png",
  },
  PART: {
    textIcon: '#',
    image: "/assets/battleships/part.png",
  },
  HIT: {
    textIcon: '%',
    image: "/assets/battleships/hit.gif",
  }
}

export const createRandomBoard = (boardSize: number): string[][] => {
  let board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(''));
  const boats = [2, 2, 3, 4, 5];

  boats.forEach(boatLength => {
    let isVertical = Math.random() < 0.5;
    let placed = false;

    while (!placed) {
      let startPosX = getRandomIntInRange(0, boardSize);
      let startPosY = getRandomIntInRange(0, boardSize);
      let canPlaceBoat = true;

      if (isVertical) {
        if (startPosY + boatLength <= boardSize) {
          for (let i = 0; i < boatLength; i++) {
            if (board[startPosY + i][startPosX] !== '') {
              canPlaceBoat = false;
              break;
            }
          }
          if (canPlaceBoat) {
            for (let i = 0; i < boatLength; i++) {
              board[startPosY + i][startPosX] = "#";
              // place borders around the boat
              if (startPosX - 1 >= 0) board[startPosY + i][startPosX - 1] = "-";
              if (startPosX + 1 <= boardSize - 1) board[startPosY + i][startPosX + 1] = "-";
            }
            // place borders around the boat
            if (startPosY - 1 >= 0) board[startPosY - 1][startPosX] = '-';
            if (startPosY + boatLength <= boardSize - 1) board[startPosY + boatLength][startPosX] = '-';
            placed = true;
          }
        }
      } else {
        if (startPosX + boatLength <= boardSize) {
          for (let i = 0; i < boatLength; i++) {
            if (board[startPosY][startPosX + i] !== '') {
              canPlaceBoat = false;
              break;
            }
          }
          if (canPlaceBoat) {
            for (let i = 0; i < boatLength; i++) {
              board[startPosY][startPosX + i] = "#";
              // place borders around the boat
              if (startPosY - 1 >= 0) board[startPosY - 1][startPosX + i] = "-";
              if (startPosY + 1 <= boardSize - 1) board[startPosY + 1][startPosX + i] = "-";
            }
            // place borders around the boat
            if (startPosX - 1 >= 0) board[startPosY][startPosX - 1] = '-';
            if (startPosX + boatLength <= boardSize - 1) board[startPosY][startPosX + boatLength] = '-';
            placed = true;
          }
        }
      }
    }
  });
  // Clean up borders
  board = board.map(row => row.map(col => col === '-' ? '' : col));
  return board;
}

function getRandomIntInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export const decideBattleshipsWinner = (board: string[][]) => {
  let allShipsDown = true;
  for (const row of board) {
    if (row.includes('#')) { allShipsDown = false; break; }
  }
  return allShipsDown;
}