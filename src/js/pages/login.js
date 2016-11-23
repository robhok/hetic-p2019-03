/* Class linked to templates */
import {LogService} from "../app/providers";

export class LoginPage {
  constructor(navParams) {
    Object.assign(this, navParams);
    // this.title = "Login";
    let self = this;
    setTimeout(() => {
      let formButton = document.querySelector('button[type="submit"]');
      formButton.addEventListener('click', (e) => {
        e.preventDefault();
        self.login();
      });
    }, 100);
  }

  // LOOP INTO USERS AND CHECK IF PASSWORD AND EMAIL MATCH AND THEN PUSH HOMEPAGE
  login() {
    let email = document.querySelector('input#email').value;
    let password = document.querySelector('input#password').value;
    self.log = new LogService();
    let user = self.log.login(email, password);
    if (user) {
      this.cache.setCache('user', user);
      this.rout.navToRoot('home', {rout: this.rout, cache: this.cache});
    }
  }
}
