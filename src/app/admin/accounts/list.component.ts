import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { Account } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    accounts: Account[] = [];
    private accountService = inject(AccountService);
    private alertService = inject(AlertService);

    ngOnInit() {
        this.accountService.getAll().pipe(first()).subscribe((a: Account[]) => this.accounts = a);
    }

    deleteAccount(account: Account) {
        if (!confirm(`Delete ${account.firstName} ${account.lastName}?`)) return;
        account.isDeleting = true;
        this.accountService.delete(account.id!).pipe(first()).subscribe({
            next: () => { this.accounts = this.accounts.filter(x => x.id !== account.id); },
            error: (e: string) => { account.isDeleting = false; this.alertService.error(e); }
        });
    }
}