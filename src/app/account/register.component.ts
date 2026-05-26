import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';

function mustMatch(c: string, m: string) {
    return (fg: UntypedFormGroup) => {
        const ctrl = fg.controls[c], match = fg.controls[m];
        if (match.errors && !match.errors['mustMatch']) return;
        ctrl.value !== match.value ? match.setErrors({ mustMatch: true }) : match.setErrors(null);
    };
}

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form!: UntypedFormGroup;
    loading = false;
    submitted = false;

    titles = ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'];

    private formBuilder = inject(UntypedFormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private accountService = inject(AccountService);
    private alertService = inject(AlertService);

    ngOnInit() {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            acceptTerms: [false, Validators.requiredTrue]
        }, { validators: mustMatch('password', 'confirmPassword') });
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid) return;
        this.loading = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Registration successful, please check your email for verification instructions', { keepAfterRouteChange: true } as any);
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: (e: string) => {
                    this.alertService.error(e);
                    this.loading = false;
                }
            });
    }
}