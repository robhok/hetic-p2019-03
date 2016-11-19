let templates = window.MyApp.templates;
let render = document.getElementsByTagName('render-outlet')[0];

// ROUTING CLASS
export class Routing {
  constructor() {
    this.render = render;
  }

  /**
  * Function goToPage()
  * Go to a page including the template
  * @param page (the template/page)
  * @param infos (infos to push into the template like the title of the page)
  */

  goToPage(page, infos) {
    this.render.innerHTML = templates[page](infos);
    this.removeLinks();
  }

  /**
  * Function removeLinks()
  * All link <a href="/"> are remove and replace by the function goToPage()
  */

  removeLinks() {
    let self = this;
    let links = this.render.getElementsByTagName('a');
    console.log(links);
    for (let link of links) {
      if (link.getAttribute('href')) {
        console.log(link);
        link.onclick = function(e) {
          e.preventDefault();
          let splittedURL = this.href.split('/');
          let page = splittedURL[splittedURL.length-1];
          self.goToPage(page, {title: 'test'});
        }
      }
    }
  }
}
