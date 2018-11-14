import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TskSparkleDirective } from './sparkle.directive';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		TskSparkleDirective
	],
	exports: [
		TskSparkleDirective
	]
})
export class TskSparkleModule {}
