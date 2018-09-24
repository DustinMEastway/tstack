import { accessSync, constants, existsSync, readdirSync, statSync } from 'fs';

export function canAccessSync(path: string, mode: number = constants.R_OK): boolean {
	try {
		return existsSync(path) && accessSync(path, mode) == null;
	} catch (error) {
		return false;
	}
}

export function readDirSync(path: string): string[] | null {
	return (canAccessSync(path) && statSync(path).isDirectory()) ? readdirSync(path) : null;
}
