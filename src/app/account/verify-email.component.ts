import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'verify-email.component.html' })
export class VerifyEmailComponent implements OnInit {
    verifying = true;
    verificationSuccess = false;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private accountService = inject(AccountService);
    private alertService = inject(AlertService);

    ngOnInit() {
        const token = this.route.snapshot.queryParams['token'];
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });
        this.accountService.verifyEmail(token).pipe(first()).subscribe({
            next: () => {
                this.verificationSuccess = true;
                this.verifying = false;
                this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true } as any);
                this.router.navigate(['../login'], { relativeTo: this.route });
            },
            error: () => {
                this.verificationSuccess = false;
                this.verifying = false;
                this.alertService.error('Verification failed');
            }
        });
    }
}