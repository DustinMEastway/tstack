import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getValue, Type } from '@tstack/core';

/** objects commonly used to test components */
export interface TestObject<ComponentT = any, FixtureT = ComponentT> {
	debugElement: DebugElement;
	fixture: ComponentFixture<FixtureT>;
	component: ComponentT;
	nativeElement: HTMLElement;
}

/**
 * getTestObject: gets primary objects used to unit test an angular component
 * @param componentType to test
 * @returns test object containing common pieces used to test a component
 */
export function getTestObject<ComponentT>(componentType: Type<ComponentT>): TestObject<ComponentT>;

/**
 * getTestObject: gets primary objects used to unit test an angular component
 * @param componentType to test
 * @param pageType to test the ui of the host with
 * @returns test object containing common pieces used to test a component
 */
export function getTestObject<ComponentT, PageT>(componentType: Type<ComponentT>, pageType: Type<PageT, ComponentFixture<ComponentT>>):
	TestObject<ComponentT> & { page: PageT };
export function getTestObject<ComponentT, PageT>(componentType: Type<ComponentT>, pageType?: Type<PageT, ComponentFixture<ComponentT>>):
	TestObject<ComponentT> & { page: PageT } {
	const fixture = TestBed.createComponent(componentType);

	return {
		fixture: fixture,
		component: fixture.componentInstance,
		debugElement: fixture.debugElement,
		nativeElement: fixture.nativeElement,
		page: (pageType) ? new pageType(fixture) : undefined
	};
}

/**
 * getTestObject: gets primary objects used to unit test an angular component
 * @param hostType to test
 * @returns test object containing common pieces used to test a component with a host
 */
export function getTestObjectWithHost<HostT extends { component: any }>
	(hostType: Type<HostT>): TestObject<HostT['component'], HostT> & { host: HostT };
/**
 * getTestObject: gets primary objects used to unit test an angular component
 * @param hostType to test
 * @param componentProperty to located the component on the host
 * @returns test object containing common pieces used to test a component with a host
 */
export function getTestObjectWithHost<HostT, PropT extends keyof(HostT)>
	(hostType: Type<HostT>, componentProperty?: PropT): TestObject<HostT[PropT], HostT> & { host: HostT };
/**
 * getTestObject: gets primary objects used to unit test an angular component
 * @param hostType to test
 * @param componentProperty to located the component on the host (nested property)
 * @returns test object containing common pieces used to test a component with a host
 */
export function getTestObjectWithHost<HostT, ComponentT>
	(hostType: Type<HostT>, componentProperty?: string): TestObject<ComponentT, HostT> & { host: HostT };
/**
 * getTestObject: gets primary objects used to unit test an angular component
 * @param hostType to test
 * @param componentProperty to located the component on the host
 * @param pageType to test the ui of the host with
 * @returns test object containing common pieces used to test a component with a host and page
 */
export function getTestObjectWithHost<HostT, PropT extends keyof(HostT), PageT>
	(hostType: Type<HostT>, componentProperty?: PropT, pageType?: Type<PageT, ComponentFixture<HostT>>):
	TestObject<HostT[PropT], HostT> & { host: HostT, page: PageT };
/**
 * getTestObject: gets primary objects used to unit test an angular component
 * @param hostType to test
 * @param componentProperty to located the component on the host (nested property)
 * @param pageType to test the ui of the host with
 * @returns test object containing common pieces used to test a component with a host and page
 */
export function getTestObjectWithHost<HostT, ComponentT, PageT>
	(hostType: Type<HostT>, componentProperty?: string, pageType?: Type<PageT, ComponentFixture<HostT>>):
	TestObject<ComponentT, HostT> & { host: HostT, page: PageT };
export function getTestObjectWithHost<HostT, ComponentT, PageT>
	(hostType: Type<HostT>, componentProperty: string = 'component', pageType?: Type<PageT, ComponentFixture<HostT>>):
	TestObject<ComponentT, HostT> & { host: HostT, page: PageT } {
	const hostTestObject = getTestObject(hostType, pageType);
	hostTestObject.fixture.detectChanges();

	return {
		...hostTestObject,
		component: getValue(hostTestObject.component, componentProperty),
		host: hostTestObject.component
	};
}
