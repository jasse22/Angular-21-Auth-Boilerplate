import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Alert, AlertType } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<Alert>();
    private defaultId = 'default-alert';

    onAlert(id = this.defaultId): Observable<Alert> {
        return this.subject.asObservable().pipe(filter((x: Alert) => x && x.id === id));
    }

    success(message: string, options?: Partial<Alert>) { this.alert({ ...options, type: AlertType.Success, message } as Alert); }
    error(message: string, options?: Partial<Alert>) { this.alert({ ...options, type: AlertType.Error, message } as Alert); }
    info(message: string, options?: Partial<Alert>) { this.alert({ ...options, type: AlertType.Info, message } as Alert); }
    warn(message: string, options?: Partial<Alert>) { this.alert({ ...options, type: AlertType.Warning, message } as Alert); }

    alert(alert: Alert) {
        alert.id = alert.id || this.defaultId;
        alert.autoClose = alert.autoClose === undefined ? true : alert.autoClose;
        this.subject.next(alert);
    }

    clear(id = this.defaultId) { this.subject.next({ id } as Alert); }
}