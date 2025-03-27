let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let plane = null;
let planeImg = new Image();
let selectedPlaneSrc = "";

let cloudImg = new Image(); cloudImg.src = "cloud.png";
let larkImg = new Image(); larkImg.src = "bird.png";
let heartImg = new Image(); heartImg.src = "heart.png";

let obstacles = [], hearts = [], heartCount = 0;
let gameOver = false, win = false, gameStarted = false;

window.onload = function () {
  document.getElementById("pinkPlane").onclick = () => selectPlane("plane_pink.png");
  document.getElementById("bluePlane").onclick = () => selectPlane("plane_blue.png");
  document.getElementById("retryBtn").onclick = () => location.reload();
};

function selectPlane(src) {
  selectedPlaneSrc = src;
  planeImg.src = src;
  startGame();
}

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  canvas.style.display = "block";
  document.body.style.backgroundImage = "url('arka.jpg')";
  document.getElementById("heartBar").style.display = "block";
  gameStarted = true;

  canvas.width = 480;
  canvas.height = 640;

  plane = {
    x: 210,
    y: 540,
    width: 60,
    height: 60,
    speed: 10
  };

  heartCount = 0;
  obstacles = [];
  hearts = [];
  updateHeartBar();
  update();
}

function updateHeartBar() {
  const heartsEl = document.querySelectorAll(".heart");
  for (let i = 0; i < 3; i++) {
    heartsEl[i].src = i < heartCount ? "heart.png" : "heart_empty.png";
  }
}

function update() {
  if (!gameOver) {
    spawnObstacles();
    spawnHearts();
    moveObstacles();
    moveHearts();
    checkCollisions();
    checkHearts();
    draw();
    requestAnimationFrame(update);
  } else {
    const msg = win
      ? "Tebrikler aşkım! 3 kalbi de topladın! ❤️❤️❤️\nSeni çok çok seviyorum 💕"
      : "Kaybettin kar tanesi... yeniden dener misin? 💔";

    document.getElementById("message").textContent = msg;
    document.getElementById("message").style.display = "block";
    document.getElementById("retryBtn").style.display = "block";

    if (win) {
      document.getElementById("starContainer").style.display = "block";
      createStars();
    } else {
      document.body.style.backgroundImage = "url('farklı.jpg')";
    }
  }
}

function spawnObstacles() {
  if (Math.random() < 0.02) {
    const type = Math.random() < 0.5 ? "bulut" : "kus";
    obstacles.push({
      x: Math.random() * 420,
      y: -40,
      width: 60,
      height: 40,
      type
    });
  }
}

function spawnHearts() {
  if (Math.random() < 0.005) {
    hearts.push({
      x: Math.random() * 440,
      y: -40,
      width: 30,
      height: 30
    });
  }
}

function moveObstacles() {
  obstacles.forEach(o => o.y += 1.5);
}

function moveHearts() {
  hearts.forEach(h => h.y += 1.2);
}

function checkCollisions() {
  obstacles.forEach(obs => {
    if (
      obs.x < plane.x + plane.width &&
      obs.x + obs.width > plane.x &&
      obs.y < plane.y + plane.height &&
      obs.y + obs.height > plane.y
    ) {
      gameOver = true;
    }
  });
}

function checkHearts() {
  hearts = hearts.filter(h => {
    const collected =
      h.x < plane.x + plane.width &&
      h.x + h.width > plane.x &&
      h.y < plane.y + plane.height &&
      h.y + h.height > plane.y;
    if (collected) {
      heartCount++;
      updateHeartBar();
      if (heartCount >= 3) {
        win = true;
        gameOver = true;
      }
    }
    return !collected;
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height);
  obstacles.forEach(obs => {
    const img = obs.type === "kus" ? larkImg : cloudImg;
    ctx.drawImage(img, obs.x, obs.y, obs.width, obs.height);
  });
  hearts.forEach(h => {
    ctx.drawImage(heartImg, h.x, h.y, h.width, h.height);
  });
}

function createStars() {
  const container = document.getElementById("starContainer");
  for (let i = 0; i < 15; i++) {
    const star = document.createElement("img");
    star.src = "star.png";
    star.className = "star";
    star.style.left = Math.random() * window.innerWidth + "px";
    star.style.animationDuration = (3 + Math.random() * 3) + "s";
    container.appendChild(star);
  }
}

document.addEventListener("keydown", function (e) {
  if (!gameStarted) return;
  if (e.key === "ArrowLeft" && plane.x > 0) plane.x -= plane.speed;
  if (e.key === "ArrowRight" && plane.x < canvas.width - plane.width) plane.x += plane.speed;
  if (e.key === "ArrowUp" && plane.y > 0) plane.y -= plane.speed;
  if (e.key === "ArrowDown" && plane.y < canvas.height - plane.height) plane.y += plane.speed;
});
