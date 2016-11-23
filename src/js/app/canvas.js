import {database} from "./config";

export class CanvasMosaic {
  constructor(canvas, device = "mobile") {
    this.data = database["profiles"];
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.container = this.canvas.parentNode;
    this.device = device;
    if (device === "desktop") {
      this.blockSize = 130;
      this.imgSize = 80;
      this.canvas.width = window.innerWidth*3;
      this.canvas.height = window.innerHeight*3;
      this.container.scrollLeft = this.canvas.width/3;
      this.container.scrollTop = this.canvas.height/3;
    } else if (device === "mobile") {
      this.blockSize = 110;
      this.imgSize = 70;
      this.canvas.width = window.innerWidth*5;
      this.canvas.height = window.innerHeight*5;
      this.container.scrollLeft = 2*this.canvas.width/5;
      this.container.scrollTop = 2*this.canvas.height/5;
    }
    this.middle = {x: (this.canvas.width-this.blockSize)/2, y: (this.canvas.height-this.blockSize)/2};
    this.filteredData = [];
    this.createFakeDatabase();
    this.createCanvas();
    this.initEvents();
  }

  createFakeDatabase() {
    this.fakeData = [];
    this.dataKey = "fakeData";
    let size = 100;
    for (let i = 0; i < 200; i++) this.fakeData[i] = this.data[i % (this.data.length)];
  }

  getRandomMargin() {
    let dif = this.blockSize - this.imgSize;
    return (1 + Math.floor(dif*Math.random()))-dif;
  }

  search(name) {
    if (name) this.dataKey = "filteredData";
    let _filtered = this.fakeData.filter(profile => profile["name"].toLowerCase().lastIndexOf(name) != -1);
    if (_filtered.length !== this.filteredData.length || _filtered[0] !== this.filteredData[0] || _filtered[_filtered.length-1] !== this.filteredData[this.filteredData.length-1] ) {
      this.filteredData = _filtered;
      if (this.device === "desktop") {
        this.container.scrollLeft = this.canvas.width/3;
        this.container.scrollTop = this.canvas.height/3;
      } else if (this.device === "mobile") {
        this.container.scrollLeft = 2*this.canvas.width/5;
        this.container.scrollTop = 2*this.canvas.height/5;
      }
      this.createCanvas();
    }
  }

  createCanvas() {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
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
    let data = this[this.dataKey];
    for (let i = 0; i < data.length; i++) {
      let image = document.createElement('img');
      image.src = data[i].image;
      image.onload = function () {
        self.context.drawImage(image, self.middle.x + self.moves.x + (self.snailCoord.x*self.blockSize) + self.getRandomMargin(), self.middle.y + self.moves.y + (self.snailCoord.y*self.blockSize) + self.getRandomMargin(), self.imgSize, self.imgSize)
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

  initEvents() {
    if (this.device === "desktop") {
      let self = this;
      this.curXPos = 0;
      this.curYPos = 0;
      this.container.addEventListener('mousedown', (e) => {
        self.mouse = "down";
        self.curYPos = e.pageY;
        self.curXPos = e.pageX;
        console.log('down');
      });

      this.container.addEventListener('mousemove', (e) => {
        if (self.mouse && self.mouse == "down") {
          self.container.scrollLeft += (self.curXPos - e.pageX);
          self.container.scrollTop += (self.curYPos - e.pageY);
          self.curXPos = e.pageX;
          self.curYPos = e.pageY;
          console.log('moveDown');
        }
        console.log('moveUp');
      });

      this.container.addEventListener('mouseup', (e) => {
        self.mouse = "up";
        console.log('up');
      });
    } else if (this.device === "mobile") {
      if (window.navigator.msPointerEnabled) {
        this.container.addEventListener('MSPointerDown', this.handleTouchStart.bind(this), false);
        this.container.addEventListener('MSPointerMove', this.handleTouchMove.bind(this), false);
        this.container.addEventListener('MSPointerUp', this.handleTouchEnd.bind(this), false);
      }
      this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
      this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
      this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
    }
  }

  handleTouchStart(e) {
    this.mouse = "down";
    if (window.navigator.msPointerEnabled) {
			this.curXPos = e.clientX;
			this.curYPos = e.clientY;
		} else {
			this.curXPos = e.touches[0].clientX;
			this.curYPos = e.touches[0].clientY;
		}
  }

  handleTouchMove(e) {
    if (this.mouse && this.mouse == "down") {
      if (window.navigator.msPointerEnabled) {
        this.container.scrollLeft += (this.curXPos - e.clientX);
        this.container.scrollTop += (this.curYPos - e.clientY);
  			this.curXPos = e.clientX;
  			this.curYPos = e.clientY;
  		} else {
        this.container.scrollLeft += (this.curXPos - e.touches[0].clientX);
        this.container.scrollTop += (this.curYPos - e.touches[0].clientY);
  			this.curXPos = e.touches[0].clientX;
  			this.curYPos = e.touches[0].clientY;
  		}
		}
  }

  handleTouchEnd(e) {
    this.mouse = "up";
  }
}
