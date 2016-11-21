import {HomePage} from '../pages/home';
import {LoginPage} from '../pages/login';
import {ProfilePage} from '../pages/profile';

let templates = window.MyApp.templates;
let render = {
  container: document.getElementsByTagName('render-outlet')[0],
  views: []
}

// ROUTING CLASS
export class Routing {
  constructor() {
    this.render = render;
    this.currentView = 0;
    this.homePage = HomePage;
    this.LoginPage = LoginPage;
    this.profilePage = ProfilePage;
    this.popPageButton = true; //Set to false if you don't want to have a previous button when a page is push
  }

  /**
  * Function getCurrentView()
  * Return the current view
  * @return current view or null if there are no view
  */

  getCurrentView(renderNb = this.render.views.length-1) {
    if (renderNb >= 0) return this.render.views[renderNb];
    else return null;
  }

  /**
  * Function push()
  * Push a new page, setting the old one unactive
  * @param page (the name of the page)
  * @param infos (infos to push into the template like the title of the page)
  */

  pushPage(page, infos = {}) {
    this.currentView++;
    let newDiv = document.createElement("render-view");
    let currentOutlet = this.getCurrentView();
    this.render.views.push(newDiv);
    if (currentOutlet) currentOutlet.classList.add('unactive-outlet');
    newDiv.className = 'page-'+page;
    this.render.container.append(newDiv);
    infos.previousButton = this.popPageButton;
    this.goToPage(page, infos, newDiv, () => {
      this.removeLinks();
      this.addEventPrevious();
    });
  }

  /**
  * Function popPage()
  * Remove current page, go to previous one
  */

  popPage() {
    let lastRender = this.getCurrentView();
    this.render.container.removeChild(lastRender);
    this.render.views.pop();
    let newLastRender = this.getCurrentView();
    newLastRender.classList.remove('unactive-outlet');
  }

  /**
  * Function goToPage()
  * Go to a page including the template, the component, and pushing infos into it
  * @param page (the name of the page (configure pages variable to add new one))
  * @param infos (infos to push into the template like the title of the page)
  * @param outlet (div where template must be insert)
  * @param callback (callback after loading new page)
  */

  goToPage(page, infos, outlet, callback) {
    /*
      This var is the connexion between the name of the page and the template. You can change the name or the template of a page, or even add new one
    */
    let pages = {
      "home": HomePage,
      "login": LoginPage,
      "profile": ProfilePage
    };
    if (pages[page]) {
      this.page = page;
      this.currentNav = new pages[page](infos); //Including infos manually added to component
    } else {
      this.page = "404";
      this.currentNav = {previousButton: this.popPageButton}
    }
    outlet.innerHTML = templates[page](this.currentNav); //Include component to template
    if (callback) callback.call(this);
  }

  doAnimation(name) {
    console.log(name);
  }

  /**
  * Function removeLinks()
  * All link <a href="/"> are remove and replace by the function pushPage()
  */

  removeLinks() {
    let self = this;
    let currentRender = this.getCurrentView();
    if (currentRender === null) return;
    let links = currentRender.getElementsByTagName('a');
    for (let link of links) {
      if (link.getAttribute('href')) {
        link.onclick = function(e) {
          e.preventDefault();
          let splittedURL = this.href.split('/');
          let page = splittedURL[splittedURL.length-1];
          self.pushPage(page);
        }
      }
    }
  }

  /**
  * Function addEventPrevious()
  * Bind popPage() function to previous button Div
  */

  addEventPrevious() {
    let self = this;
    let currentRender = this.getCurrentView();
    if (currentRender === null) return;
    let previousButton = currentRender.getElementsByClassName('header__previous');
    if (previousButton && previousButton[0]) previousButton[0].onclick = function(e) {
      self.popPage();
    }
  }
}
