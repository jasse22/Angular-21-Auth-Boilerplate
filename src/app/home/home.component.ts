import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { AccountService } from '@app/_services';
import { Account, Role } from '@app/_models';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    account: Account | null = null;
    Role = Role;
    private accountService = inject(AccountService);

    ngOnInit() {
        this.accountService.account.subscribe((x: Account | null) => this.account = x);
    }
}