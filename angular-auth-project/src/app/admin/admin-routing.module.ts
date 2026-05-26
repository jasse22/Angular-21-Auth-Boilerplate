import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';
import { SubNavComponent } from './subnav.component';
import { ListComponent } from './accounts/list.component';
import { AddEditComponent } from './accounts/add-edit.component';

const accountsRoutes: Routes = [
    { path: '', component: ListComponent },
    { path: 'add', component: AddEditComponent },
    { path: 'edit/:id', component: AddEditComponent }
];

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: SubNavComponent, outlet: 'subnav' },
            { path: '', component: OverviewComponent },
            { path: 'accounts', children: accountsRoutes }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
