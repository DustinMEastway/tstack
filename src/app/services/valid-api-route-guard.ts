import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DocumentationApiService } from './documentation-api.service';

@Injectable({ providedIn: 'root' })
export class ValidApiRouteGuard implements CanActivate {
	constructor(private _documentationApiService: DocumentationApiService, private _router: Router) {}

	canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
		const requestPath = (route.url.length) ? route.url.map(url => url.path).join('/') : 'index';

		return this._documentationApiService.apiList$.pipe(map(apiList => {
			const apiFound = apiList.some(api => api.path === requestPath);

			if (!apiFound) {
				this._router.navigateByUrl('/404');
			}

			return apiFound;
		}));
	}
}
