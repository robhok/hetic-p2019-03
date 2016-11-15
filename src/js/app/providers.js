let templates = window.MyApp.templates;
let render = document.getElementsByTagName('render-outlet')[0];

export class Routing {
  constructor() {
    this.render = render;
  }
  goToPage(page, infos) {
    this.render.innerHTML = templates[page](infos);
    this.removeLinks();
  }
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
