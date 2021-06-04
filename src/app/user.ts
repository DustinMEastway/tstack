import { customValidationMessages, BaseObject, Field, Group, Validators } from './tstack-validation';

export class User extends BaseObject {
  @Field(
    'Name',
    [ Validators.required, Validators.minLength(2), Validators.maxLength(3) ],
    customValidationMessages({ required: 'Name is kind of important, please add it' })
  )
  name?: string;
  @Group('Manager')
  manager?: User;
}
