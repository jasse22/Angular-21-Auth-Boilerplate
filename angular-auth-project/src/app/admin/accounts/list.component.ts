import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { Account } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    accounts: Account[] = [];

    constructor(
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe((accounts: Account[]) => this.accounts = accounts);
    }

    deleteAccount(account: Account) {
        if (!confirm(`Delete account for ${account.firstName} ${account.lastName}?`)) return;
        account.isDeleting = true;
        this.accountService.delete(account.id)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.accounts = this.accounts.filter(x => x.id !== account.id);
                    this.alertService.success('Account deleted');
                },
                error: (error: string) => {
                    account.isDeleting = false;
                    this.alertService.error(error);
                }
            });
    }
}
