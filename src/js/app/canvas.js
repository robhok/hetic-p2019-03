import {database} from "./config";

export class CanvasMosaic {
  constructor(canvas) {
    this.data = database["profiles"];
    this.canvas = canvas;
    console.log(this.canvas);
    this.context = canvas.getContext('2d');
    this.blockSize = 120;
    this.imgSize = 100;
    this.canvas.width = window.innerWidth + (this.blockSize*2);
    this.canvas.height = 800;
    this.middle = {x: (this.canvas.width-this.blockSize)/2, y: (this.canvas.height-this.blockSize)/2};
    this.createFakeDatabase();
    this.createCanvas();
  }

  createFakeDatabase() {
    this.fakeData = [];
    let size = 100;
    for (let i = 0; i < 100; i++) this.fakeData[i] = this.data[i % (this.data.length)];
  }

  createCanvas() {
    this.moves = {
      x: 0,
      y: 0
    }
    this.direction = "up";
    this.snailCoord = {x: 0, y: 0};
    let self = this;
    let snailIteration = 0;
    let snailMove = 1;
    let snailArrived = 0;
    for (let i = 0; i < this.fakeData.length; i++) {
      let image = document.createElement('img');
      image.src = this.fakeData[i].image;
      console.log(this.fakeData[i].image);
      image.onload = function () {
        self.context.drawImage(image, self.middle.x + self.moves.x + (self.snailCoord.x*self.blockSize), self.middle.y + self.moves.y + (self.snailCoord.y*self.blockSize), 100, 100)
        snailIteration++;
        self.moveSnail();
        if (snailIteration === snailMove) {
          self.changeDirection();
          snailArrived++;
          if (snailArrived == 2) {
            snailMove++;
            snailArrived = 0;
          }
          snailIteration = 0;
        }
      }
    }
  }

  changeDirection() {
    let self = this;
    switch(this.direction) {
      case "up":
        self.direction = "right";
        break;
      case "right":
        self.direction = "down";
        break;
      case "down":
        self.direction = "left";
        break;
      case "left":
        self.direction = "up";
        break;
    }
  }

  moveSnail() {
    let self = this;
    switch(this.direction) {
      case "up":
        self.snailCoord.y--;
        break;
      case "right":
        self.snailCoord.x++;
        break;
      case "down":
        self.snailCoord.y++;
        break;
      case "left":
        self.snailCoord.x--;
        break;
    }
  }


}
