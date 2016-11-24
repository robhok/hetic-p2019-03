/* Class linked to templates */
import {CanvasMosaic} from "../app/canvas";

export class HomePage {
  constructor(navParams) {
    Object.assign(this, navParams);
    this.user = this.getUser();
    if (!this.user) this.rout.navToRoot('login', {rout: this.rout, cache: this.cache});
    else {
      let self = this;
      this.newProfile = {}
      setTimeout(() => {
        let canvas = document.querySelector('#home-canvas');
        self.canvas = new CanvasMosaic(canvas, self.rout, self.cache);
        self.initEvents();
      }, 100);
    }
  }

  onChangeSearch() {
    this.canvas.search(this.inputSearch.value);
  }

  initEvents() {
    let self = this;
    this.inputSearch = document.querySelector('input#search');
    this.inputSearch.addEventListener('input', () => {
      self.onChangeSearch();
    });

    let btnAdd = document.querySelector('.home__close--container > button.btn');
    let formProfile = document.querySelector('.form-profile');
    btnAdd.addEventListener('click', (e) => {
      formProfile.style.display = "block";
      setTimeout(() => {
        formProfile.style.opacity = 1;
      }, 100)
    });

    let closeBtn = document.querySelector('.form-profile__form--cross');
    closeBtn.addEventListener('click', (e) => {
      formProfile.style.opacity = 0;
      setTimeout(() => {
        formProfile.style.display = "none";
      }, 500)
    });

    let inputImg = document.querySelector('.form-profile__form > input[type="file"]');
    inputImg.addEventListener("change", this.readFile.bind(this), false);

    let submitBtn = document.querySelector('.form-profile__form--submit');
    submitBtn.addEventListener('click', (e) => {

    });
  }

  getUser() {
    return this.cache.getCache('user');
  }

  readFile(e) {
    let self = this;
    if (e.target.files && e.target.files[0]) {
      let FR = new FileReader();
      FR.onload = function(evt) {
        let _memory = {
          "user_id": "1",
          "image": evt.target.result,
          "m_flowers" : [],
          "date": "24 novembre 2016"
        };
        self.memoriesAdded.push(_memory);
        self.cache.setCache('memories_added', JSON.stringify(self.memoriesAdded));
        console.log("success");
        self.rout.reloadPage({rout: self.rout, cache: self.cache, profile: self.profile});
      };
      FR.readAsDataURL( e.target.files[0] );
    }
  }
}
