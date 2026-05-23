import { AccountService } from '../_services/account.service';

export function appInitializer(accountService: AccountService) {
    return () => new Promise<void>(resolve => {
        // attempt to refresh token on app start up to auto authenticate
        accountService.refreshToken()
            .subscribe({
                next: () => resolve(),
                error: () => resolve()
            });
    });
}