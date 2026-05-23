import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  // ← MUST HAVE THIS
import { AccountsRoutingModule } from './accounts-routing.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';

@NgModule({
    declarations: [
        ListComponent,
        AddEditComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,  // ← MUST HAVE THIS
        AccountsRoutingModule
    ]
})
export class AccountsModule { }