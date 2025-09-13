// import kaboom from "kaboom": brings the Kaboom library into your project.
import kaboom from "kaboom";

// kaboom(): initializes the game engine. You can pass options like width, height, gravity, background color, etc.
// example: kaboom({ width: 640, height: 480, background: [0, 0, 0] });
kaboom();

// loadSprite("name", "path"): loads an image and gives it a name you can reference later.
loadSprite("bird", "sprites/bird.png");
loadSprite("bg", "sprites/bg.png");
loadSprite("pipe", "sprites/pipe.png");
// loadSound("name", "path"): loads audio files for sound effects.
loadSound("jump", "sounds/jump.mp3");
loadSound("bruh", "sounds/bruh.mp3");
loadSound("pass", "sounds/pass.mp3");

let highScore = 0;

// scene("game", () => { ... }): defines a game scene called "game".
scene("game", () => {
  const PIPE_GAP = 140; // PIPE_GAP: vertical gap between top and bottom pipes.
  let score = 0;
  setGravity(1600); // setGravity(1600): makes objects with body() affected by gravity.

  add([sprite("bg", { width: width(), height: height() })]); // add([sprite("bg")]): adds the background image, scaled to fit the canvas.

  const scoreText = add([text(score), pos(12, 12)]); // Adds a text object to display the score at the top-left corner.

  const player = add([
    // player: the main character controlled by the player.
    sprite("bird"), // sprite("bird"): shows the bird image.
    scale(1.2), // scale(1.2): scales the bird to 120% of its original size.
    pos(100, 50), // pos(100, 50): starts the bird at coordinates (100, 50).
    area(), // area(): gives the sprite a hitbox for collision detection.
    body(), // body(): makes the sprite affected by gravity and allows jumping.
  ]);

  function createPipes() {
    // createPipes(): function to create a pair of pipes (top and bottom).
    const offset = rand(-50, 50); // Random vertical offset for pipe placement.
    // bottom pipe
    add([
      sprite("pipe"),
      pos(width(), height() / 2 + offset + PIPE_GAP / 2), // pos(width(), ...): x = width() → starts off-screen to the right,
      // height() / 2 + offset + PIPE_GAP / 2: y-position → positions the bottom pipe below the center, adjusted by offset and half the gap.
      "pipe", // "pipe": gives this object the tag "pipe" so we can move it or detect collisions later.
      scale(2),
      area(), // area(): gives the pipe a hitbox for collision detection.
      { passed: false }, // { passed: false }: custom property to track if the player has passed this pipe (for scoring).
    ]);

    // top pipe
    add([
      sprite("pipe", { flipY: true }), // flipY: true → flips the pipe image vertically for the top pipe.
      pos(width(), height() / 2 + offset - PIPE_GAP / 2), // positions the top pipe above the center, adjusted by offset and half the gap.
      "pipe",
      anchor("botleft"), // anchor("botleft"): sets the anchor point to the bottom-left corner for better positioning.
      scale(2),
      area(),
    ]);
  }

  loop(1.5, () => createPipes()); // loop(1.5, ...): calls createPipes() every 1.5 seconds to continuously add new pipes.

  onUpdate("pipe", (pipe) => {
    //onUpdate("pipe", ...): updates all objects tagged "pipe" every frame.
    pipe.move(-300, 0); // pipe.move(-300, 0): moves the pipe left at 300 pixels per second.

    if (pipe.passed === false && pipe.pos.x < player.pos.x) {
      pipe.passed = true;
      score += 1;
      scoreText.text = score;
      play("pass");
    }
  });

  player.onCollide("pipe", () => {
    // player.onCollide("pipe", ...): sets up a collision handler for when the player hits a pipe.
    const ss = screenshot(); // Takes a screenshot of the current game state.
    go("gameover", score, ss); // go("gameover", score, ss): transitions to the "gameover" scene, passing the current score and screenshot.
  });

  player.onUpdate(() => {
    // player.onUpdate(...): checks if the player falls below the screen (ground).
    if (player.pos.y > height()) {
      // If the player falls below the screen, trigger game over.
      const ss = screenshot();
      go("gameover", score, ss);
    }
  });

  onKeyPress("space", () => {
    // onKeyPress("space", ...): sets up a key press handler for the spacebar.
    play("jump"); // play("jump"): plays the jump sound effect.
    player.jump(400); // player.jump(400): makes the player jump with a force of 400.
  });
  // For touch
  window.addEventListener("touchstart", () => {
    // touchstart event listener for mobile devices.
    play("jump");
    player.jump(400);
  });
});

// Game over scene
scene("gameover", (score, screenshot) => {
  if (score > highScore) highScore = score;

  play("bruh");

  loadSprite("gameOverScreen", screenshot); // Load the screenshot as a sprite to use as the background.
  add([sprite("gameOverScreen", { width: width(), height: height() })]); // Display the screenshot as the background.

  add([
    text("GameOver!\n" + "score: " + score + "\nhigh score: " + highScore, {
      // Display the game over text with the current score and high score.
      size: 45,
    }),
    pos(width() / 2, height() / 3),
  ]);

  onKeyPress("space", () => {
    // Restart the game on spacebar press.
    go("game");
  });
});

// Start the game
go("game");
