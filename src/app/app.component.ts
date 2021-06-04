import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { markAs } from './mark-as';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tstack';
  user: User;
  form: FormGroup;

  constructor() {
    this.user = new User().assign({
      name: 'me',
      manager: new User().assign({
        name: 'joe',
      })
    });
    this.form = this.user.toForm();
  }

  onSubmit(): void {
    if (!this.form.valid) {
      markAs(this.form, 'Touched');
      return;
    }

    this.user.assign(this.form.value);
  }
}
