import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Account } from '@app/_models';

const baseUrl = `${environment.apiUrl}/accounts`;

@Injectable({ providedIn: 'root' })
export class AccountService {
    private router = inject(Router);
    private http = inject(HttpClient);

    private accountSubject = new BehaviorSubject<Account | null>(
        JSON.parse(localStorage.getItem('account') || 'null')
    );
    public account: Observable<Account | null> = this.accountSubject.asObservable();

    get accountValue(): Account | null { return this.accountSubject.value; }

    login(email: string, password: string) {
        return this.http.post<any>(`${baseUrl}/authenticate`, { email, password }, { withCredentials: true })
            .pipe(map(account => {
                this.accountSubject.next(account);
                localStorage.setItem('account', JSON.stringify(account));
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    logout() {
        this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.accountSubject.next(null);
        localStorage.removeItem('account');
        this.router.navigate(['/account/login']);
    }

    refreshToken() {
        return this.http.post<any>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
            .pipe(map(account => {
                this.accountSubject.next(account);
                localStorage.setItem('account', JSON.stringify(account));
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    register(account: any) { return this.http.post(`${baseUrl}/register`, account); }
    verifyEmail(token: string) { return this.http.post(`${baseUrl}/verify-email`, { token }); }
    forgotPassword(email: string) { return this.http.post(`${baseUrl}/forgot-password`, { email }); }
    validateResetToken(token: string) { return this.http.post(`${baseUrl}/validate-reset-token`, { token }); }
    resetPassword(token: string, password: string, confirmPassword: string) {
        return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
    }
    getAll() { return this.http.get<Account[]>(baseUrl); }
    getById(id: string) { return this.http.get<Account>(`${baseUrl}/${id}`); }
    create(params: any) { return this.http.post(baseUrl, params); }

    update(id: string, params: any) {
        return this.http.put<Account>(`${baseUrl}/${id}`, params)
            .pipe(map(account => {
                if (account.id === this.accountValue?.id) {
                    const updated = { ...this.accountValue, ...account };
                    this.accountSubject.next(updated as Account);
                    localStorage.setItem('account', JSON.stringify(updated));
                }
                return account;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`)
            .pipe(finalize(() => { if (id === this.accountValue?.id) this.logout(); }));
    }

    private refreshTokenTimeout?: ReturnType<typeof setTimeout>;

    private startRefreshTokenTimer() {
        if (!this.accountValue?.jwtToken) return;
        const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));
        const timeout = new Date(jwtToken.exp * 1000).getTime() - Date.now() - 60000;
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() { clearTimeout(this.refreshTokenTimeout); }
}