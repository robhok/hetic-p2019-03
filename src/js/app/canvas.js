import {database} from "./config";

export class CanvasMosaic {
  constructor(canvas, rout, cache) {
    this.rout = rout;
    this.cache = cache;
    this.data = database["profiles"];
    this.dataAdded = JSON.parse(this.cache.getCache('data_added')) || [];
    this.fullData = [...this.data, ...this.dataAdded];
    this.dataKey = "fullData";
    this.canvas = canvas;
    this.state = 0; //0 for static, 1 for moving
    this.context = this.canvas.getContext('2d');
    this.container = this.canvas.parentNode;
    this.device = this.rout.device;
    this.coords = [];
    if (this.device === "desktop") {
      this.initCanvasDesktop();
      this.initEventsDesktop();
    } else if (this.device === "mobile") {
      this.initCanvasMobile();
      this.initEventsMobile();
    }
    this.middle = {x: (this.canvas.width)/2, y: (this.canvas.height)/2};
    this.filteredData = [];
    // this.createFakeDatabase(200);
    this.createCanvas();
  }

  initCanvasDesktop() {
    this.blockSize = 150;
    this.imgSize = 100;
    this.canvas.width = window.innerWidth*3;
    this.canvas.height = window.innerHeight*3;
    this.container.scrollLeft = this.canvas.width/3;
    this.container.scrollTop = this.canvas.height/3;
  }

  initCanvasMobile() {
    this.blockSize = 110;
    this.imgSize = 70;
    this.canvas.width = window.innerWidth*5;
    this.canvas.height = window.innerHeight*5;
    this.container.scrollLeft = 2*this.canvas.width/5;
    this.container.scrollTop = 2*this.canvas.height/5;
  }

  /**
  * Function createFakeDatabase()
  * fill database with existing items (to test bigger arrays)
  */

  createFakeDatabase(nbCell) {
    this.fakeData = [];
    this.dataKey = "fakeData";
    let size = 100;
    for (let i = 0; i < nbCell; i++) this.fakeData[i] = this.data[i % (this.data.length)];
  }

  /**
  * Function getRandomMargin()
  * @return margin (inside blocks images)
  */

  getRandomMargin() {
    let dif = this.blockSize - this.imgSize;
    return Math.random()*dif;
  }

  /**
  * Function search()
  * filter data by name
  * @param name (value inside the search input, name of persons)
  */

  search(name) {
    if (name) this.dataKey = "filteredData";
    else this.dataKey = "fullData";
    let _filtered = this.fullData.filter(profile => profile["name"].toLowerCase().lastIndexOf(name) != -1);
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

  /**
  * Function createCanvas()
  * draw all the canvas
  */

  createCanvas() {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.direction = "up";
    this.snailCoord = {x: 0, y: 0};
    let self = this;
    let snailIteration = 0;
    let snailMove = 1;
    let snailArrived = 0;
    let data = this[this.dataKey];
    this.coords = [];
    for (let i = 0; i < data.length; i++) {
      let image = document.createElement('img');
      image.src = data[i].image;
      image.onload = function () {
        let _coords = {
          x: self.snailCoord.x,
          y: self.snailCoord.y,
          profile: data[i]
        };
        self.coords.push(_coords);
        self.context.drawImage(image, self.middle.x + (self.snailCoord.x*self.blockSize) + self.getRandomMargin(), self.middle.y + (self.snailCoord.y*self.blockSize) + self.getRandomMargin(), self.imgSize, self.imgSize)
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

  /**
  * Function getProfileByCoords()
  * return right coord depending of coords
  * @param x, y (coordinates)
  * @return profile;
  */

  getProfileByCoords(x, y) {
    return this.coords.filter(coord => coord["x"] == x && coord["y"] == y);
  }

  /**
  * Function changeDirection()
  * change direction of snail
  */

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

  /**
  * Function moveSnail()
  * move snail
  */

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

  /**
  * Function initEventsDesktop()
  * init all events for desktop
  */

  initEventsDesktop() {
    let self = this;
    this.curXPos = 0;
    this.curYPos = 0;
    this.container.addEventListener('mousedown', (e) => {
      self.mouse = "down";
      self.state = 0;
      self.curYPos = e.pageY;
      self.curXPos = e.pageX;
    });

    this.container.addEventListener('mousemove', (e) => {
      if (self.mouse && self.mouse == "down") {
        self.state = 1;
        self.container.scrollLeft += (self.curXPos - e.pageX);
        self.container.scrollTop += (self.curYPos - e.pageY);
        self.curXPos = e.pageX;
        self.curYPos = e.pageY;
      }
    });

    this.container.addEventListener('mouseup', (e) => {
      if (!self.state && self.mouse == "down") self.relMouseCoords(e);
      self.state = 0;
      self.mouse = "up";
    });
  }

  /**
  * Function initEventsMobile()
  * init all events for mobiles
  */

  initEventsMobile() {
    if (window.navigator.msPointerEnabled) {
      this.container.addEventListener('MSPointerDown', this.handleTouchStart.bind(this), false);
      this.container.addEventListener('MSPointerMove', this.handleTouchMove.bind(this), false);
      this.container.addEventListener('MSPointerUp', this.handleTouchEnd.bind(this), false);
    }
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
  }

  /**
  * Function handleTouchStart()
  * action on touch for mobiles
  * @param e (event)
  */

  handleTouchStart(e) {
    this.mouse = "down";
    this.state = 0;
    if (window.navigator.msPointerEnabled) {
			this.curXPos = e.clientX;
			this.curYPos = e.clientY;
		} else {
      let _coord = e.touches.length ? e.touches : e.changedTouches;
			this.curXPos = _coord[0].clientX;
			this.curYPos = _coord[0].clientY;
		}
  }

  /**
  * Function handleTouchMove()
  * action on touch move for mobiles
  * @param e (event)
  */

  handleTouchMove(e) {
    if (this.mouse && this.mouse == "down") {
      this.state = 1;
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

  /**
  * Function handleTouchEnd()
  * action on release touch for mobiles
  * @param e (event)
  */

  handleTouchEnd(e) {
    if (!this.state && this.mouse == "down") {
      console.log(this.mouse);
      this.relMouseCoords(e);
    }
    this.state = 0;
    this.mouse = "up";
  }

  /**
  * Function relMouseCoords()
  * get coords of canvas by mouse position
  * @param e (event)
  */

  relMouseCoords(e) {
    let totalOffsetX = 0;
    let totalOffsetY = 0;
    let canvasX = 0;
    let canvasY = 0;
    let currentElement = this.canvas;
    let clientX;
    let clientY;
    if(this.device === "desktop") {
      clientX = e.pageX;
      clientY = e.pageY;
    } else if (this.device === "mobile") {
      if (window.navigator.msPointerEnabled) {
  			clientX = e.clientX;
  			clientY = e.clientY;
  		} else {
        let _coord = e.touches.length ? e.touches : e.changedTouches;
  			clientX = _coord[0].clientX;
  			clientY = _coord[0].clientY;
  		}
    }

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while (currentElement = currentElement.offsetParent);

    canvasX = clientX - totalOffsetX;
    canvasY = clientY - totalOffsetY;
    let color = this.context.getImageData(canvasX, canvasY, 1, 1).data.toString();
    if (color != "0,0,0,0") {
      let coords = this.coordsCanvasToArray(canvasX, canvasY);
      let person = this.getProfileByCoords(coords.x, coords.y);
      if (person && person.length) this.rout.pushPage('profile', {rout: this.rout, cache: this.cache, profile: person[0].profile});
    }
  }

  /**
  * Function coordsCanvasToArray()
  * push to page
  */

  coordsCanvasToArray(x,y) {
    let coord = {
      x: Math.floor((x-this.middle.x)/this.blockSize),
      y: Math.floor((y-this.middle.y)/this.blockSize)
    }
    return coord;
  }
}
