class Sprite {
	constructor({ position, image, frames = { max: 1 }, alts, speed }) {
		this.position = position;
		this.image = image;
		this.frames = { ...frames, i: 0, elapsed: 0 };

		this.image.onload = () => {
			this.width = this.image.width / this.frames.max;
			this.height = this.image.height;
		};

		this.alts = alts;

		this.speed = speed;
		this.canMove;
		this.isMoving;
	}

	draw() {
		c.drawImage(
			this.image,
			this.frames.i * this.width,
			0,
			this.image.width / this.frames.max,
			this.image.height,
			this.position.x,
			this.position.y,
			this.image.width / this.frames.max,
			this.image.height
		);

		if (this.isMoving) {
			// Every second from crop 1, increments number of frames elapsed
			if (this.frames.max > 1) this.frames.elapsed++;
			// Every 10 frames elapsed, shifts crop by 1
			if (this.frames.elapsed % 16 === 0) {
				// Shift crop by 1 (will loop back to start, at end)
				this.frames.i < this.frames.max - 1 ? this.frames.i++ : (this.frames.i = 0);
			}
		} else {
			this.frames.i = 0;
		}
	}
}

class Boundary {
	constructor({ position }) {
		this.width = mapPixelSize;
		this.height = mapPixelSize;
		this.position = position;
	}

	draw() {
		c.fillStyle = "rgba(255, 0, 0, 0.0)";
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
}
