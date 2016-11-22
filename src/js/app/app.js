// IMPORT
import {Routing} from './providers';

export class MyApp {
  constructor() {
    this.device = "mobile"; //"mobile" for slides, desktop for fade
    this.rout = new Routing(this.device);
    this.rout.navToRoot('home', {rout: this.rout}); //YOU HAVE TO PASS THE ROUTER FOR THE FIRST VIEW (preferably using navToRoot)
  }
}

let myApp = new MyApp();
