import { Entity } from '@tstack/core';

class Villian extends Entity {
	firstName: string;
	lastName: string;

	get fullName(): string {
		return `${this.firstName} ${this.lastName}`;
	}
}

// json data from an api
const json = { firstName: 'Agent', lastName: 'Smith' };

// cast to the Villian type to access its properties and methods
const villian = Villian.cast(json);

// outputs 'Agent Smith'
console.log(villian.firstName);
