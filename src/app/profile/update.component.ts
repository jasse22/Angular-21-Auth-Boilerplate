import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { Account } from '@app/_models';

function mustMatch(c: string, m: string) {
    return (fg: UntypedFormGroup) => {
        const ctrl = fg.controls[c], match = fg.controls[m];
        if (match.errors && !match.errors['mustMatch']) return;
        ctrl.value !== match.value ? match.setErrors({ mustMatch: true }) : match.setErrors(null);
    };
}

@Component({ templateUrl: 'update.component.html' })
export class UpdateComponent implements OnInit {
    account: Account | null = null;
    form!: UntypedFormGroup;
    loading = false;
    submitted = false;
    deleting = false;

    titles = ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'];

    private formBuilder = inject(UntypedFormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private accountService = inject(AccountService);
    private alertService = inject(AlertService);

    ngOnInit() {
        this.accountService.account.subscribe((x: Account | null) => this.account = x);
        this.form = this.formBuilder.group({
            title: [this.account?.title ?? '', Validators.required],
            firstName: [this.account?.firstName ?? '', Validators.required],
            lastName: [this.account?.lastName ?? '', Validators.required],
            email: [this.account?.email ?? '', [Validators.required, Validators.email]],
            password: ['', Validators.minLength(6)],
            confirmPassword: ['']
        }, { validators: mustMatch('password', 'confirmPassword') });
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid) return;
        this.loading = true;
        this.accountService.update(this.account!.id!, this.form.value).pipe(first()).subscribe({
            next: () => {
                this.alertService.success('Update successful', { keepAfterRouteChange: true } as any);
                this.router.navigate(['..'], { relativeTo: this.route });
            },
            error: (e: string) => { this.alertService.error(e); this.loading = false; }
        });
    }

    onDelete() {
        if (!confirm('Are you sure you want to delete your account?')) return;
        this.deleting = true;
        this.accountService.delete(this.account!.id!).pipe(first()).subscribe();
    }
}