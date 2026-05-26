import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { AccountService } from '@app/_services';
import { Account, Role } from '@app/_models';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
    Role = Role;
    account: Account | null = null;
    private accountService = inject(AccountService);

    ngOnInit() {
        this.accountService.account.subscribe((x: Account | null) => this.account = x);
    }

    logout() {
        this.accountService.logout();
    }
}