// IMPORT
import {Routing} from './providers';

// NEW ROUTING
let device = "mobile"; //"mobile" for slides, desktop for fade
let routing = new Routing(device);
routing.navToRoot('home', {rout: routing, title: 'Connexion'});
