import { compareItems, hasDuplicates } from '@tstack/core';

export interface Villian {
	alias: string;
	name: string;
}

const villians: Villian[] = [
	{ alias: 'Delimiter', name: 'Kate' },
	{ alias: 'Compiler', name: 'Jeff' },
	{ alias: 'Compiler', name: 'Kate' },
	{ alias: 'C Shark', name: 'Doug' }
];

// a property can be used to check if any objects in an array have the same value for that property
// outputs: true
console.log(hasDuplicates(villians, { property: 'name' }));

// comparator can be used for more complex comparisions involving multiple properties
// outputs: false
console.log(hasDuplicates(villians, { comparator: (villian1, villian2) => compareItems(villian1, villian2, 'alias', 'name') }));
