/* Class linked to templates */
import {CanvasMosaic} from "../app/canvas";

export class HomePage {
  constructor(navParams) {
    Object.assign(this, navParams);
    this.user = this.getUser();
    if (!this.user) this.rout.navToRoot('login', {rout: this.rout, cache: this.cache});
    else {
      let self = this;
      setTimeout(() => {
        let canvas = document.querySelector('#home-canvas');
        self.inputSearch = document.querySelector('input#search');
        console.log(canvas);
        self.canvas = new CanvasMosaic(canvas);
        self.inputSearch.addEventListener('input', () => {
          self.onChangeSearch();
        });
      }, 100);
    }
  }

  onChangeSearch() {
    this.canvas.search(this.inputSearch.value);
  }

  getUser() {
    return this.cache.getCache('user');
  }
}
