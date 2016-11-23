/* Class linked to templates */
import {database} from "../app/config";

export class ProfilePage {
  constructor(navParams) {
    var self = this;
    Object.assign(this, navParams);
    this.user = this.getUser();
    console.log(this.profile);
    this.memoriesAdded = JSON.parse(this.cache.getCache('memories_added')) || [];
    this.flowersAdded = JSON.parse(this.cache.getCache('flowers_added')) || [];
    this.allMemories = [...this.memoriesAdded, ...this.profile.memories];
    this.allFlowers = [...this.flowersAdded, ...this.profile.flowers];
    console.log(this.allMemories);
    for (let memory of this.allMemories) {
      let _user = this.getUserById(memory.user_id)[0];
      console.log(_user);
      memory.user_name = _user.name;
      memory.user_image = _user.image;
    };
    for (let flower of this.allFlowers) {
      let _flower = this.getUserById(flower.user_id)[0];
      flower.user_name = _flower.name;
      flower.user_image = _flower.image;
    };
    console.log(this.allMemories);

    // LAUNCH FUNCTIONS THAT NEED DOM TO BE LOAD
    setTimeout(() => {
      self.tabs();
      self.initEvents();
    }, 100);

  }

  // SWITCH TABS BETWEEN REMEMBERS AND FLOWERS
  tabs() {
    // SET UP
    let profile = {};

    // TABS ACTIONS
    profile.tabs = document.querySelector('.profile__tabs');
    profile.tabs.remember = profile.tabs.querySelector('.profile__tabs--remember');
    profile.tabs.flower = profile.tabs.querySelector('.profile__tabs--flower');

    // TABS CONTENT
    profile.content = document.querySelector('.profile__content');
    profile.content.remember = profile.content.querySelector('.profile__content--remember');
    profile.content.flower = profile.content.querySelector('.profile__content--flower');

    // SWITCH SELECTED CLASS BETWEEN TAB

    // IF WINDOW > 760 TABS DOESN'T WORK
    if (window.innerWidth <= 760) {
      profile.tabs.addEventListener('click', (e) => {
        if (!e.target.classList.contains('selected')) {
          document.querySelector('.selected').classList.remove('selected');
          e.target.classList.add('selected');

          // DISPLAY OR HIDE TABS ACCORDING TO THE SELECTED TAB
          if (profile.tabs.remember.classList.contains('selected')) {
            profile.content.flower.style.display = 'none';
            profile.content.remember.style.display = 'block';
          }

          else if (profile.tabs.flower.classList.contains('selected')) {
            profile.content.remember.style.display = 'none';
            profile.content.flower.style.display = 'block';
          }
        }
      });
    }
  }

  //  INIT EVENTS
  initEvents() {
    let buttons = document.querySelectorAll('.add-flower');
    let flowers = document.querySelectorAll('.flowers img');
    let self = this;
    for (let button of buttons) {
      button.addEventListener('click', (e) => {
        self.actionFlowerMemories(e);
      });
    }
    let addMemoryButton = document.querySelector('.profile__action--remember > .action > button.btn > a');
    addMemoryButton.addEventListener('click', (e) => {
      self.addMemory();
    });
    let addFlowerButton = document.querySelector('.profile__action--flower > .action > button.btn > a');
    addFlowerButton.addEventListener('click', (e) => {
      self.showTextFlower();
    });
    let postFlower = document.querySelector('.profile__add--button > button.btn');
    postFlower.addEventListener('click', (e) => {
      self.addFlower();
    });
  }

  //  ADD A FLOWER INTO A REMEMBER
  showTextFlower() {
    let container = document.querySelector('.profile__add');
    container.style.display = "flex";
    console.log(container);
    setTimeout(() => {
      container.querySelector('.profile__add--container').style.opacity = 1;
    },100);
  }
  hideTextFlower() {
    let container = document.querySelector('.profile__add');
    container.querySelector('.profile__add--container').style.opacity = 0;
    setTimeout(() => {
      container.style.display = "none";
    },500);
  }

  actionFlowerMemories(e) {
    let parent = e.target.parentNode.parentNode.parentNode;
    console.log(parent);
    let _img = document.createElement('img');
    _img.src = "src/images/icons/flower-icon.svg";
    let _flowers = parent.querySelector('.flowers');
    _flowers.appendChild(_img);
  }

  addMemory() {
    this.inputUpload = document.querySelector('.profile__add--input-upload > input[type="file"]');
    this.inputUpload.addEventListener("change", this.readFile.bind(this), false);
    this.inputUpload.click();
  }

  addFlower() {
    let content = document.querySelector('textarea#message').value;
    console.log(content);
    let _flower = {
      "user_id": "1",
      "content": content,
      "date": "24 novembre 2016"
    };
    this.flowersAdded.push(_flower);
    this.cache.setCache('flowers_added', JSON.stringify(this.flowersAdded));
    this.rout.reloadPage({rout: this.rout, cache: this.cache, profile: this.profile});
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

  getUser() {
    return this.cache.getCache('user');
  }

  getUserById(id) {
    return database.users.filter(user => user.id == id);
  }

}
