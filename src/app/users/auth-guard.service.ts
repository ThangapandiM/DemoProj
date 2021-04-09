import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private userService: UserService, private router: Router) { }

    canActivate(): boolean {

        if (!this.userService.isAuthenticated) {
            this.router.navigate(['/signin']);
        }
        return this.userService.isAuthenticated;
    }

    canActivateChild(): boolean {
        return this.canActivate();
    }
}