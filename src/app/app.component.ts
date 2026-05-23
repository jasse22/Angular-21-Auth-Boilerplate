import { Component } from '@angular/core';
import { AccountService } from './_services/account.service';
import { Account } from './_models/account';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    account: Account | null = null;

    constructor(private accountService: AccountService) {
        this.accountService.account.subscribe(x => this.account = x);
    }

    logout() {
        this.accountService.logout();
    }
}