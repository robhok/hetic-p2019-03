/* Class linked to templates */

export class ProfilePage {
  constructor(navParams) {
    var self = this;

    Object.assign(this, navParams);

    // LAUNCH FUNCTIONS THAT NEED DOM TO BE LOAD
    setTimeout(() => {
      self.tabs();
      self.addFlower();
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

    // IF WINDOW >= 760 TABS DOESN'T WORK
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

  //  ADD A FLOWER INTO A REMEMBER
  addFlower() {

    let buttons = document.querySelectorAll('.add-flower')
        flowers = document.querySelectorAll('.flowers img');

    for (let button of buttons) {
      button.addEventListener('click', (e) => {
        console.log(e);
      });
    }
  }
}
