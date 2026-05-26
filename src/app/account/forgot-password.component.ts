import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'forgot-password.component.html' })
export class ForgotPasswordComponent implements OnInit {
    form!: UntypedFormGroup;
    loading = false;
    submitted = false;
    emailSent = false;

    private formBuilder = inject(UntypedFormBuilder);
    private accountService = inject(AccountService);
    private alertService = inject(AlertService);

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid) return;
        this.loading = true;
        this.accountService.forgotPassword(this.f['email'].value)
            .pipe(first(), finalize(() => this.loading = false))
            .subscribe({
                next: () => {
                    this.emailSent = true;
                    this.alertService.success('Please check your email for password reset instructions');
                },
                error: (e: string) => this.alertService.error(e)
            });
    }
}