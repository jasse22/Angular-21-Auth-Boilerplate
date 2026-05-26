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

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form!: UntypedFormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;

    private formBuilder = inject(UntypedFormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private accountService = inject(AccountService);
    private alertService = inject(AlertService);

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        const pwVal = [Validators.minLength(6)];
        if (this.isAddMode) pwVal.push(Validators.required);

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
            password: ['', pwVal],
            confirmPassword: ['']
        }, { validators: mustMatch('password', 'confirmPassword') });

        if (!this.isAddMode) {
            this.accountService.getById(this.id).pipe(first()).subscribe(a => this.form.patchValue(a));
        }
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid) return;
        this.loading = true;
        this.isAddMode ? this.createAccount() : this.updateAccount();
    }

    private createAccount() {
        this.accountService.create(this.form.value).pipe(first()).subscribe({
            next: () => {
                this.alertService.success('Account created', { keepAfterRouteChange: true } as any);
                this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: (e: string) => { this.alertService.error(e); this.loading = false; }
        });
    }

    private updateAccount() {
        this.accountService.update(this.id, this.form.value).pipe(first()).subscribe({
            next: () => {
                this.alertService.success('Update successful', { keepAfterRouteChange: true } as any);
                this.router.navigate(['../../'], { relativeTo: this.route });
            },
            error: (e: string) => { this.alertService.error(e); this.loading = false; }
        });
    }
}