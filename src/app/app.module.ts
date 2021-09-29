import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuantumApplicationListComponent } from './quantum-application-list/quantum-application-list.component';
import { EventTriggerListComponent } from './event-trigger-list/event-trigger-list.component';
import { JobListComponent } from './job-list/job-list.component';
import { AppRoutingModule } from './app-routing.module';
import { MatCardModule } from '@angular/material/card';
import { AddQuantumApplicationComponent } from './dialogs/add-quantum-application/add-quantum-application.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { AddEventTriggerComponent } from './dialogs/add-event-trigger/add-event-trigger.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RegisterEventTriggersComponent } from './dialogs/register-event-triggers/register-event-triggers.component';
import { GenerateEventComponent } from './dialogs/generate-event/generate-event.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { InvokeQuantumApplicationComponent } from './dialogs/invoke-quantum-application/invoke-quantum-application.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    QuantumApplicationListComponent,
    EventTriggerListComponent,
    JobListComponent,
    AddQuantumApplicationComponent,
    AddEventTriggerComponent,
    RegisterEventTriggersComponent,
    GenerateEventComponent,
    InvokeQuantumApplicationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    NgxMatFileInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
