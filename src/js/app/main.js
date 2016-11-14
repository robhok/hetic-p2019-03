let templates = window.MyApp.templates;
let render = document.getElementsByTagName('render-outlet')[0];
render.innerHTML = templates['home']({title: 'Home Page'});
