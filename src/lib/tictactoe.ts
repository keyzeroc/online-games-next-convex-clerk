export const decideTicTacToeWinner = (board: string[]) => {
  const isXWinner = checkLines("X", board);
  const is0Winner = checkLines("0", board);
  return isXWinner ? "X" : is0Winner ? "0" : "";
}

const checkLines = (symbol: string, board: string[]) => {
  if (board[0] === symbol && board[1] === symbol && board[2] === symbol) {
    return true;
  } else if (board[0] === symbol && board[3] === symbol && board[6] === symbol) {
    return true;
  } else if (board[0] === symbol && board[4] === symbol && board[8] === symbol) {
    return true
  } else if (board[1] === symbol && board[4] === symbol && board[7] === symbol) {
    return true
  } else if (board[2] === symbol && board[5] === symbol && board[8] === symbol) {
    return true;
  } else if (board[2] === symbol && board[4] === symbol && board[6] === symbol) {
    return true;
  } else if (board[3] === symbol && board[4] === symbol && board[5] === symbol) {
    return true;
  } else if (board[6] === symbol && board[7] === symbol && board[8] === symbol) {
    return true;
  }
  return false;
}