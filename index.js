const express = require("express");
const app = express();
app.use(express.json());

app.get("/", function (req, res) {
  res.json({
    apiversion: "1", // only required property
    color: "#3d00a6",
    head: "smart-caterpillar",
    tail: "weight",
  });
});

app.post("/move", function (req, res) {
  console.log(req.body);
  const you = req.body.you;
  const board = req.body.board;
  const snakes = board.snakes;

  let moves = ["up", "down", "left", "right"];

  // Remove options from moves array
  function remove(direction) {
    moves = moves.filter((item) => item != direction);
  }

  if (you.head.y == board.height - 1) remove("up");
  if (you.head.y == 0) remove("down");
  if (you.head.x == board.width - 1) remove("right");
  if (you.head.x == 0) remove("left");

  // Avoid ourselves
  for (let part of you.body) {
    if (you.head.x == part.x && you.head.y + 1 == part.y) remove("up");
    if (you.head.x == part.x && you.head.y - 1 == part.y) remove("down");
    if (you.head.y == part.y && you.head.x + 1 == part.x) remove("right");
    if (you.head.y == part.y && you.head.x - 1 == part.x) remove("left");
  }

  // Avoid other snakes
  for (let snake of snakes) {
    for (let part of snake.body) {
      if (you.head.x == part.x && you.head.y + 1 == part.y) remove("up");
      if (you.head.x == part.x && you.head.y - 1 == part.y) remove("down");
      if (you.head.y == part.y && you.head.x + 1 == part.x) remove("right");
      if (you.head.y == part.y && you.head.x - 1 == part.x) remove("left");
    }
  }

  res.json({ move: moves[Math.floor(Math.random() * moves.length)] });
});

app.listen(process.env.PORT);
