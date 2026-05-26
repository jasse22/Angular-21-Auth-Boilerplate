import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { AccountService } from '@app/_services';
import { Account } from '@app/_models';

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent implements OnInit {
    account: Account | null = null;
    private accountService = inject(AccountService);

    ngOnInit() {
        this.accountService.account.subscribe((x: Account | null) => this.account = x);
    }
}