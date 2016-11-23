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
    // INPUTS
    let email = document.querySelector('input#email').value;
    let password = document.querySelector('input#password').value;
    // NOTIFICATIONS
    let notification = document.querySelector('.notifications');
    let notificationMessage = document.querySelector('.notifications__message');
    let notificationIcon = document.querySelector('.notifications__icon img');

    self.log = new LogService();
    let user = self.log.login(email, password);
    if (user) {

      // NOTIFICATION SUCCESS
      notification.classList.add('success');
      notificationMessage.innerHTML = 'Votre connexion a été un succès !';
      notification.style.transform = 'translate(0px)';
      notificationIcon.src = 'src/images/icons/success-icon.svg';


      this.cache.setCache('user', user);
      this.rout.navToRoot('home', {rout: this.rout, cache: this.cache});
    } else {

      // NOTIFICATION ERROR
      notification.classList.add('danger');
      notificationMessage.innerHTML = 'Votre connexion a échouée, veuillez réessayer';
      notification.style.transform = 'translate(0px)';
      notificationIcon.src = 'src/images/icons/danger-icon.svg';
    }
  }
}
