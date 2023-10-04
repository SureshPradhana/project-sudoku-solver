class SudokuSolver {
  stringTo2DArray(puzzleString) {
    const puzzleArray = [];
    const rows = puzzleString.match(/.{1,9}/g);

    for (const row of rows) {
      const rowArray = [];
      for (const char of row) {
        const num = char;
        rowArray.push(num);
      }
      puzzleArray.push(rowArray);
    }
    return puzzleArray;
  }

  validate(puzzleString) {
    let regex = /^[1-9.]{81}$/;
    return regex.test(puzzleString);
  }

  checkRowPlacement(puzzle, row, col, value) {
    let puzzleValues = this.stringTo2DArray(puzzle);
    const rowValues = puzzleValues[row];
    if (puzzleValues[row][col] == value) {
      return true;
    }

    if (rowValues.includes(value.toString())) {
      return false;
    }

    return true;
  }

  checkColPlacement(puzzle, row, col, value) {
    let puzzleValues = this.stringTo2DArray(puzzle);
    const colValues = [];
    for (let i = 0; i < 9; i++) {
      colValues.push(puzzleValues[i][col]);
    }

    if (puzzleValues[row][col] == value) {
      return true;
    }

    if (colValues.includes(value.toString())) {
      return false;
    }

    return true;
  }

  checkRegionPlacement(puzzle, row, col, value) {
    const regionStartRow = Math.floor(row / 3) * 3;
    const regionStartCol = Math.floor(col / 3) * 3;
    let board = this.stringTo2DArray(puzzle);

    if (board[row][col] == value) {
      return true;
    }

    const regionValues = [];
    for (let i = regionStartRow; i < regionStartRow + 3; i++) {
      for (let j = regionStartCol; j < regionStartCol + 3; j++) {
        regionValues.push(board[i][j]);
      }
    }

    if (regionValues.includes(value.toString())) {
      return false;
    }

    return true;
  }

  solveSudoku(grid, row, col) {
    const N = 9;

    if (row == N - 1 && col == N) return grid;

    if (col == N) {
      row++;
      col = 0;
    }

    if (grid[row][col] != 0) return this.solveSudoku(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {
      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;
        if (this.solveSudoku(grid, row, col + 1)) return grid;
      }

      grid[row][col] = 0;
    }
    return false;
  }

  isSafe(grid, row, col, num) {
    for (let x = 0; x <= 8; x++) if (grid[row][x] == num) return false;

    for (let x = 0; x <= 8; x++) if (grid[x][col] == num) return false;

    let startRow = row - (row % 3),
      startCol = col - (col % 3);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == num) return false;

    return true;
  }

  transform(puzzleString) {
    let grid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    let row = -1;
    let col = 0;
    for (let i = 0; i < puzzleString.length; i++) {
      if (i % 9 == 0) {
        row++;
      }
      if (col % 9 == 0) {
        col = 0;
      }

      grid[row][col] = puzzleString[i] === "." ? 0 : +puzzleString[i];
      col++;
    }
    return grid;
  }

  transformBack(grid) {
    return grid.flat().join("");
  }

  solve(puzzleString) {
    if (puzzleString.length != 81) {
      return false;
    }
    if (/[^0-9.]/g.test(puzzleString)) {
      return false;
    }
    let grid = this.transform(puzzleString);
    let solved = this.solveSudoku(grid, 0, 0);
    if (!solved) {
      return false;
    }
    let solvedString = this.transformBack(solved);
    return solvedString;
  }
}

module.exports = SudokuSolver;
