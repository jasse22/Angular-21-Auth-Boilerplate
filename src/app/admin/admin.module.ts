import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { SubNavComponent } from './subnav.component';
import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';

@NgModule({
    declarations: [
        SubNavComponent,
        LayoutComponent,
        OverviewComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        AdminRoutingModule
    ]
})
export class AdminModule { }