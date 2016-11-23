/* Class linked to templates */
import {CanvasMosaic} from "../app/canvas";

export class HomePage {
  constructor(navParams) {
    Object.assign(this, navParams);
    let self = this;
    setTimeout(() => {
      let canvas = document.querySelector('#home-canvas');
      console.log(canvas);
      self.canvas = new CanvasMosaic(canvas);
    });
  }
}
