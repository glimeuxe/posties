// _ = Must be pre-defined based on something
// tiled_ = Must be pre-defined based on parameters used in Tiled

const cv = document.querySelector("canvas");
const c = cv.getContext("2d");
cv.width = 1024;
cv.height = 768;

let playerDownImage = new Image();
playerDownImage.src = "./img/player-down.png";
let playerUpImage = new Image();
playerUpImage.src = "./img/player-up.png";
let playerLeftImage = new Image();
playerLeftImage.src = "./img/player-left.png";
let playerRightImage = new Image();
playerRightImage.src = "./img/player-right.png";

let _playerImageWidth = 192; // Based on width of playerDownImage
let _playerImageHeight = 68; // Based on height of playerDownImage

let backgroundImage = new Image();
backgroundImage.src = "./maps/1/background.png";

let foregroundImage = new Image();
foregroundImage.src = "./maps/1/foreground.png";

// # Collisions and Boundaries
let tiled_mapWidth = 70;
let collisionsMap = [];

for (let i = 0; i < collisions.length; i += tiled_mapWidth) {
	collisionsMap.push(collisions.slice(i, i + tiled_mapWidth));
}

let tiled_pixelSize = 12; // Based on pixel size of exported map backgroundImage
let tiled_mapZoom = 400; // Based on zoom of exported map backgroundImage
let mapPixelSize = (tiled_pixelSize * tiled_mapZoom) / 100; // 48px by default

let boundariesMap = [];
let _boundaryValue = 1025; // Based on non-zero value in map's collisions.js file

let initialMapOffset = {
	x: -496,
	y: -660,
};

collisionsMap.forEach((row, line) => {
	row.forEach((symbol, character) => {
		if (symbol == _boundaryValue) {
			boundariesMap.push(
				new Boundary({
					position: {
						x: character * mapPixelSize + initialMapOffset.x,
						y: line * mapPixelSize + initialMapOffset.y,
					},
				})
			); // Map collisions array to boundaries array
		}
	});
});

// # Key State Management
const keys = {
	moveForward: {
		isPressed: false,
	},
	moveLeft: {
		isPressed: false,
	},
	moveBackward: {
		isPressed: false,
	},
	moveRight: {
		isPressed: false,
	},
};

let lastKeyPressed = "";

window.addEventListener("keydown", function (press) {
	switch (press.key) {
		case "w":
			keys.moveForward.isPressed = true;
			lastKeyPressed = "w";
			break;
		case "a":
			keys.moveLeft.isPressed = true;
			lastKeyPressed = "a";
			break;
		case "s":
			keys.moveBackward.isPressed = true;
			lastKeyPressed = "s";
			break;
		case "d":
			keys.moveRight.isPressed = true;
			lastKeyPressed = "d";
			break;
	}
});

window.addEventListener("keyup", function (press) {
	switch (press.key) {
		case "w":
			keys.moveForward.isPressed = false;
			break;
		case "a":
			keys.moveLeft.isPressed = false;
			break;
		case "s":
			keys.moveBackward.isPressed = false;
			break;
		case "d":
			keys.moveRight.isPressed = false;
			break;
	}
});

// # Animation
let background = new Sprite({
	position: {
		x: initialMapOffset.x,
		y: initialMapOffset.y,
	},
	image: backgroundImage,
});

let foreground = new Sprite({
	position: {
		x: initialMapOffset.x,
		y: initialMapOffset.y,
	},
	image: foregroundImage,
});

const player = new Sprite({
	position: {
		x: cv.width / 2 - _playerImageWidth / 8,
		y: cv.height / 2 - _playerImageHeight / 2,
	},
	image: playerDownImage,
	frames: {
		max: 4,
	},
	alts: {
		up: playerUpImage,
		left: playerLeftImage,
		down: playerDownImage,
		right: playerRightImage,
	},
	speed: 4,
});

/*
const testBoundary = new Boundary({
	position: {
		x: 400,
		y: 400,
	},
});
*/

let frameMovables = [background, foreground, ...boundariesMap];

function animation() {
	window.requestAnimationFrame(animation);

	background.draw();
	boundariesMap.forEach((boundary) => {
		boundary.draw();
	});
	player.draw();
	foreground.draw();

	player.canMove = true;
	player.isMoving = false;

	// Check if movement keys are pressed and move background accordingly
	if (keys.moveForward.isPressed && lastKeyPressed == "w") {
		player.image = player.alts.up;
		player.isMoving = true;

		// Check if player will collide with any boundary and set player.canMove to false if so
		for (let i = 0; i < boundariesMap.length; i++) {
			const boundary = boundariesMap[i];
			if (
				isColliding({
					object1: player,
					object2: {
						...boundary,
						position: {
							x: boundary.position.x,
							y: boundary.position.y + player.speed,
						},
					},
				})
			) {
				player.canMove = false;
				break;
			}
		}

		// By default, player.canMove is true and player will move on command
		if (player.canMove) {
			frameMovables.forEach((frameMovable) => {
				frameMovable.position.y += player.speed;
			});
		}
	}

	if (keys.moveLeft.isPressed && lastKeyPressed == "a") {
		player.image = player.alts.left;
		player.isMoving = true;
		for (let i = 0; i < boundariesMap.length; i++) {
			const boundary = boundariesMap[i];
			if (
				isColliding({
					object1: player,
					object2: {
						...boundary,
						position: {
							x: boundary.position.x + player.speed,
							y: boundary.position.y,
						},
					},
				})
			) {
				player.canMove = false;
				break;
			}
		}

		if (player.canMove) {
			frameMovables.forEach((frameMovable) => {
				frameMovable.position.x += player.speed;
			});
		}
	}

	if (keys.moveBackward.isPressed && lastKeyPressed == "s") {
		player.image = player.alts.down;
		player.isMoving = true;
		for (let i = 0; i < boundariesMap.length; i++) {
			const boundary = boundariesMap[i];
			if (
				isColliding({
					object1: player,
					object2: {
						...boundary,
						position: {
							x: boundary.position.x,
							y: boundary.position.y - player.speed,
						},
					},
				})
			) {
				player.canMove = false;
				break;
			}
		}

		if (player.canMove) {
			frameMovables.forEach((frameMovable) => {
				frameMovable.position.y -= player.speed;
			});
		}
	}

	if (keys.moveRight.isPressed && lastKeyPressed == "d") {
		player.image = player.alts.right;
		player.isMoving = true;
		for (let i = 0; i < boundariesMap.length; i++) {
			const boundary = boundariesMap[i];
			if (
				isColliding({
					object1: player,
					object2: {
						...boundary,
						position: {
							x: boundary.position.x - player.speed,
							y: boundary.position.y,
						},
					},
				})
			) {
				player.canMove = false;
				break;
			}
		}

		if (player.canMove) {
			frameMovables.forEach((frameMovable) => {
				frameMovable.position.x -= player.speed;
			});
		}
	}
}
animation();
