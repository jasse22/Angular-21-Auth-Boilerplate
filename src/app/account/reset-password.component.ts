import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';

function mustMatch(c: string, m: string) {
    return (fg: UntypedFormGroup) => {
        const ctrl = fg.controls[c], match = fg.controls[m];
        if (match.errors && !match.errors['mustMatch']) return;
        ctrl.value !== match.value ? match.setErrors({ mustMatch: true }) : match.setErrors(null);
    };
}

@Component({ templateUrl: 'reset-password.component.html' })
export class ResetPasswordComponent implements OnInit {
    form!: UntypedFormGroup;
    loading = false;
    submitted = false;
    token!: string;
    tokenValidating = false;
    tokenValid = true;

    private formBuilder = inject(UntypedFormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private accountService = inject(AccountService);
    private alertService = inject(AlertService);

    ngOnInit() {
        this.token = this.route.snapshot.queryParams['token'];
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });
        this.form = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: mustMatch('password', 'confirmPassword') });
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid) return;
        this.loading = true;
        this.accountService.resetPassword(this.token, this.f['password'].value, this.f['confirmPassword'].value)
            .pipe(first(), finalize(() => this.loading = false))
            .subscribe({
                next: () => {
                    this.alertService.success('Password reset successful, you can now login', { keepAfterRouteChange: true } as any);
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: (e: string) => this.alertService.error(e)
            });
    }
}