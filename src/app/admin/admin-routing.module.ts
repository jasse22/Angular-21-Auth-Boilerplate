import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';
import { SubNavComponent } from './subnav.component';

const accountsModule = () => import('./accounts/accounts.module').then(m => m.AccountsModule);

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                children: [
                    { path: '', component: SubNavComponent, outlet: 'subnav' },
                    { path: '', component: OverviewComponent }
                ]
            },
            {
                path: 'accounts',
                children: [
                    { path: '', component: SubNavComponent, outlet: 'subnav' },
                    { path: '', loadChildren: accountsModule }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }