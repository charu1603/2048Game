class Game2048 {
  constructor(size = 4) {
    this.size = size;
    this.tiles = [];
    this.board = document.getElementById("board");
    this.init();
    this.addEventListeners();
  }

  init() {
    this.board.innerHTML = "";
    this.tiles = [];

    for (let i = 0; i < this.size * this.size; i++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      this.board.appendChild(tile);
      this.tiles.push(tile);
    }

    this.insertNew();
    this.insertNew();
  }

  restartGame() {
    this.init();
  }

  valAt(i) {
    return parseInt(this.tiles[i].textContent) || 0;
  }

  setVal(i, val) {
    const tile = this.tiles[i];
    tile.textContent = val ? val : "";
    tile.className = "tile";
    if (val) tile.classList.add(`tile-${val}`);
    if (val === 2048)
      setTimeout(() => alert("you are such a 2048 paglu!"), 100);
  }

  insertNew() {
    const blanks = this.tiles
      .map((t, i) => (t.textContent === "" ? i : -1))
      .filter((i) => i !== -1);
    if (blanks.length === 0) return;
    const choice = blanks[Math.floor(Math.random() * blanks.length)];
    this.setVal(choice, Math.random() < 0.9 ? 2 : 4);
  }

  slideRow(arr) {
    let result = arr.filter((x) => x !== 0);

    for (let i = 0; i < result.length - 1; i++) {
      if (result[i] === result[i + 1]) {
        result[i] *= 2;
        result[i + 1] = 0;
      }
    }

    return result
      .filter((x) => x !== 0)
      .concat(Array(this.size - result.filter((x) => x !== 0).length).fill(0));
  }

  shift(dir) {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      let line = [];

      for (let c = 0; c < this.size; c++) {
        let idx =
          dir === "left" || dir === "right"
            ? r * this.size + c
            : c * this.size + r;
        if (dir === "right" || dir === "down") {
          idx =
            dir === "right"
              ? r * this.size + (this.size - 1 - c)
              : (this.size - 1 - c) * this.size + r;
        }
        line.push(this.valAt(idx));
      }

      const slided = this.slideRow(line);
      for (let c = 0; c < this.size; c++) {
        let idx =
          dir === "left" || dir === "right"
            ? r * this.size + c
            : c * this.size + r;
        if (dir === "right" || dir === "down") {
          idx =
            dir === "right"
              ? r * this.size + (this.size - 1 - c)
              : (this.size - 1 - c) * this.size + r;
        }

        if (this.valAt(idx) !== slided[c]) {
          this.setVal(idx, slided[c]);
          moved = true;
        }
      }
    }

    return moved;
  }

  anyMovesLeft() {
    for (let i = 0; i < this.size * this.size; i++) {
      const v = this.valAt(i);
      if (v === 0) return true;

      const right = i % this.size !== this.size - 1 ? this.valAt(i + 1) : null;
      const down =
        i + this.size < this.size * this.size
          ? this.valAt(i + this.size)
          : null;

      if (v === right || v === down) return true;
    }
    return false;
  }

  play(key) {
    const directions = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };

    const direction = directions[key];
    if (!direction) return;

    const didMove = this.shift(direction);
    if (didMove) {
      this.insertNew();
      if (!this.anyMovesLeft()) {
        setTimeout(() => alert("💀khalaas, no more moves!"), 100);
      }
    }
  }

  addEventListeners() {
    document.addEventListener("keydown", (e) => this.play(e.key));

    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    });

    document.addEventListener("touchend", (e) => {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > 30) {
        if (absDx > absDy) {
          this.play(dx > 0 ? "ArrowRight" : "ArrowLeft");
        } else {
          this.play(dy > 0 ? "ArrowDown" : "ArrowUp");
        }
      }
    });
    document
      .getElementById("restartBtn")
      .addEventListener("click", () => this.restartGame());
  }
}
new Game2048();
