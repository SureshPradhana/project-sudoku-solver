'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      // Check if required fields are missing
      if (!puzzle || !coordinate || value === undefined) {
        return res.json({ error: 'Required field(s) missing' });
      }
      // Check if the puzzle is 81 characters long
      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }


      // Validate the puzzle string
      if (!solver.validate(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }



      // Check if the coordinate is valid (A-I followed by 1-9)
      const coordinateRegex = /^[A-Ia-i][1-9]$/;
      if (!coordinate.match(coordinateRegex)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // Check if the value is a number between 1 and 9
      if (value < 1 || value > 9 || isNaN(value)) {
        return res.json({ error: 'Invalid value' });
      }

      // Convert coordinate to row and column indices
      const row = coordinate.charCodeAt(0) - 'A'.charCodeAt(0);
      const col = parseInt(coordinate.charAt(1)) - 1;

      // Check if the placement is valid and if there are any conflicts
      const isRowValid = solver.checkRowPlacement(puzzle, row, col, value.toString());
      const isColValid = solver.checkColPlacement(puzzle, row, col, value.toString());
      const isRegionValid = solver.checkRegionPlacement(puzzle, row, col, value.toString());

      const valid = isRowValid && isColValid && isRegionValid;

      // Determine if there are any conflicts
      const conflicts = [];
      if (!isRowValid) conflicts.push('row');
      if (!isColValid) conflicts.push('column');
      if (!isRegionValid) conflicts.push('region');

      // Construct the response object
      const response = {
        valid,
        conflict: conflicts.length > 0 ? conflicts : undefined,
      };

      // Return the response
      res.json(response);
    });


  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      if (puzzle.length != 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
      // Check if the puzzle is a valid Sudoku puzzle
      if (!solver.validate(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      // Attempt to solve the puzzle
      const solvedPuzzle = solver.solve(puzzle);

      if (!solvedPuzzle) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      // Return the solved puzzle
      return res.json({ solution: solvedPuzzle });
    });
};
