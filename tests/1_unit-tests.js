const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;


suite("Unit Tests", function() {
  test("Logic handles a valid puzzle string of 81 characters", function() {
    const validPuzzleString = "123456789456789123789123456234567891567891234891234567345678912678912345912345678";
    const solver = new Solver();
    assert.isTrue(solver.validate(validPuzzleString));
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function() {
    const invalidPuzzleString = "12a456789456789123789123456234567891567891234891234567345678912678912345912345678";
    const solver = new Solver();
    assert.isFalse(solver.validate(invalidPuzzleString));
  });

  test("Logic handles a puzzle string that is not 81 characters in length", function() {
    const shortPuzzleString = "12345678945678912378912345623456789156789123489123456734567891267891234591234567";
    const solver = new Solver();
    assert.isFalse(solver.validate(shortPuzzleString));
  });

  test("Logic handles a valid row placement", function() {
    const solver = new Solver();
    const validPuzzleString = "123456789456789123789123456234567891567891234891234567345678912678912345912345678";
    assert.isTrue(solver.checkRowPlacement(validPuzzleString, 0, 0, 1)); // Valid placement
  });

  test("Logic handles an invalid row placement", function() {
    const solver = new Solver();
    const invalidPuzzleString = "123456789456789123789123456234567891567891234891234567345678912678912345912345678";
    assert.isFalse(solver.checkRowPlacement(invalidPuzzleString, 0, 0, 5)); // Invalid placement
  });

  test("Logic handles a valid column placement", function() {
    const solver = new Solver();
    const validPuzzleString = "123456789456789123789123456234567891567891234891234567345678912678912345912345678";
    assert.isTrue(solver.checkColPlacement(validPuzzleString, 0, 0, 1)); // Valid placement
  });

  test("Logic handles an invalid column placement", function() {
    const solver = new Solver();
    const invalidPuzzleString = "123456789456789123789123456234567891567891234891234567345678912678912345912345678";
    assert.isFalse(solver.checkColPlacement(invalidPuzzleString, 0, 0, 5)); // Invalid placement
  });

  test("Logic handles a valid region (3x3 grid) placement", function() {
    const solver = new Solver();
    const validPuzzleString = "123456789456789123789123456234567891567891234891234567345678912678912345912345678";
    assert.isTrue(solver.checkRegionPlacement(validPuzzleString, 0, 0, 1)); // Valid placement
  });

  test("Logic handles an invalid region (3x3 grid) placement", function() {
    const solver = new Solver();
    const invalidPuzzleString = "123456789456789123789123456234567891567891234891234567345678912678912345912345678";
    assert.isFalse(solver.checkRegionPlacement(invalidPuzzleString, 0, 0, 5)); // Invalid placement
  });

  test("Valid puzzle strings pass the solver", function() {
    const solver = new Solver();
    const validPuzzleString = "123456789456789123789123456234567891567891234891234567345678912678912345912345678";
    assert.isString(solver.solve(validPuzzleString)); // Should return a solved puzzle
  });

  test("Invalid puzzle strings fail the solver", function() {
    const solver = new Solver();
    const invalidPuzzleString = "12345678945678912378912345623456789156789123489123456734567891267891234591234567"; // Missing one character
    assert.isFalse(solver.solve(invalidPuzzleString)); // Should return false
  });

  test("Solver returns the expected solution for an incomplete puzzle", function() {
    const solver = new Solver();
    const incompletePuzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79"; // Example of an incomplete puzzle
    const solvedPuzzle = solver.solve(incompletePuzzleString);
    // Check if the solved puzzle is valid and matches the expected solution
    assert.isTrue(solver.validate(solvedPuzzle));
    assert.equal(solvedPuzzle, "534678912672195348198342567859761423426853791713924856961537284287419635345286179");
  });
});

