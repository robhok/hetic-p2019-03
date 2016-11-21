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
  }

  getCurrentRender(renderNb = this.render.views.length-1) {
    if (renderNb >= 0) return this.render.views[renderNb];
    else return null;
  }

  /**
  * Function goToPage()
  * Go to a page including the template
  * @param page (the template/page)
  * @param infos (infos to push into the template like the title of the page)
  */

  pushPage(page, infos) {
    this.currentView++;
    let newDiv = document.createElement("render-view");
    let currentOutlet = this.getCurrentRender();
    this.render.views.push(newDiv);
    if (currentOutlet) currentOutlet.classList.add('unactive-outlet');
    newDiv.className = 'page-'+page;
    this.render.container.append(newDiv);
    this.goToPage(page, infos, newDiv);
  }

  goToPage(page, infos, outlet, animation = null) {
    let pages = {
      "home": HomePage,
      "login": LoginPage,
      "profile": ProfilePage
    };
    if (pages[page]) {
      this.page = page;
      this.currentNav = new pages[page](infos);
    } else {
      this.page = "404";
      this.currentNav = {}
    }
    outlet.innerHTML = templates[page](this.currentNav);
    if (animation) doAnimation(animation);
    this.removeLinks();
  }

  doAnimation(name) {
    console.log(name);
  }

  /**
  * Function removeLinks()
  * All link <a href="/"> are remove and replace by the function goToPage()
  */

  removeLinks() {
    let self = this;
    let currentRender = this.getCurrentRender();
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
}
