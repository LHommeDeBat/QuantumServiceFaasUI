import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { QuantumApplicationListComponent } from './quantum-application-list/quantum-application-list.component';
import { EventTriggerListComponent } from './event-trigger-list/event-trigger-list.component';
import { JobListComponent } from './job-list/job-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'quantum-applications', pathMatch: 'full' },
  { path: 'quantum-applications', component: QuantumApplicationListComponent },
  { path: 'event-triggers', component: EventTriggerListComponent },
  { path: 'jobs', component: JobListComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
