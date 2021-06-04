import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from './user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: [ './user.component.scss' ]
})
export class UserComponent {
  @Input()
  form?: FormGroup;

  get managerControl(): FormGroup | null {
    const control = this.form?.get('manager');

    return (control) ? control as FormGroup : null;
  }

  onAddManagerClick(): void {
    this.form && this.form.setControl('manager', new User().toForm());
  }
}
