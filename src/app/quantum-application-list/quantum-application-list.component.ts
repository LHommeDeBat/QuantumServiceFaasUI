import { Component, OnInit, ViewChild } from '@angular/core';
import { QuantumApplicationService } from '../services/quantum-application.service';
import { AddQuantumApplicationComponent } from '../dialogs/add-quantum-application/add-quantum-application.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { EventTriggerService } from '../services/event-trigger.service';
import { RegisterEventTriggersComponent } from '../dialogs/register-event-triggers/register-event-triggers.component';
import { InvokeQuantumApplicationComponent } from '../dialogs/invoke-quantum-application/invoke-quantum-application.component';
import { ToastService } from '../services/toast.service';
import { ProviderService } from '../services/provider.service';

@Component({
  selector: 'app-quantum-application-list',
  templateUrl: './quantum-application-list.component.html',
  styleUrls: ['./quantum-application-list.component.scss']
})
export class QuantumApplicationListComponent implements OnInit {

  quantumApplications: any[] = [];
  selectedApplication: any = undefined;
  applicationEventTriggers: any[] = [];

  @ViewChild('drawer') public drawer: MatDrawer | undefined;

  constructor(private quantumApplicationService: QuantumApplicationService,
              private eventService: EventTriggerService,
              private providerService: ProviderService,
              private toastService: ToastService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getQuantumApplications();
  }

  getQuantumApplications(): void {
    this.quantumApplicationService.getQuantumApplications().subscribe(response => {
      this.quantumApplications = response._embedded ? response._embedded.quantumApplications : [];
      for (const quantumApplication of this.quantumApplications) {
        this.providerService.getProvider(quantumApplication._links.provider.href).subscribe((provider) => {
          quantumApplication.provider = provider;
        });
      }
    });
  }

  getApplicationEventTriggers(url: string): void {
      this.quantumApplicationService.getApplicationEventTriggers(url).subscribe(response => {
        this.applicationEventTriggers = response._embedded ? response._embedded.eventTriggers : [];
      });
  }

  addQuantumApplication(): void {
    const dialogRef = this.dialog.open(AddQuantumApplicationComponent, {
      width: '50%',
      data: {
        title: 'Add new Quantum-Application',
        name: '',
        file: undefined
      },
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.quantumApplicationService.createQuantumApplication(data.name, data.provider.name, data.dockerImage, data.notificationAddress, data.file).subscribe(() => {
          this.getQuantumApplications();
        });
      }
    });
  }

  deleteQuantumApplication(url: string): void {
    this.quantumApplicationService.deleteQuantumApplication(url).subscribe(() => {
      this.getQuantumApplications();
    });
  }

  selectApplication(application: any): void {
    if (!this.selectedApplication || this.selectedApplication.id !== application.id) {
      this.selectedApplication = application;
      this.selectedApplication.codeAsText = window.atob(this.selectedApplication.code);
      this.getApplicationEventTriggers(application._links.eventTriggers.href);
    }
    this.drawer?.open();
  }

  closeDetailsView(): void {
    this.drawer?.close();
    this.applicationEventTriggers = [];
    this.selectedApplication = undefined;
  }

  unregisterApplicationFromEventTrigger(selectedApplication: any, eventTrigger: any) {
    this.eventService.unregisterApplication(eventTrigger.name, selectedApplication.name).subscribe(() => {
      this.getApplicationEventTriggers(selectedApplication._links.eventTriggers.href);
    });
  }

  generateEventTypeDisplay(eventTrigger: any): string {
    if (eventTrigger.eventType === 'QUEUE_SIZE') {
      return eventTrigger.eventType + ' <= ' + eventTrigger.sizeThreshold;
    }

    if (eventTrigger.eventType === 'EXECUTION_RESULT') {
      return eventTrigger.eventType + ' (' + eventTrigger.executedApplicationName + ')';
    }

    return eventTrigger.eventType;
  }

  openRegisterEventTriggersDialog(): void {
    const dialogRef = this.dialog.open(RegisterEventTriggersComponent, {
      width: '50%',
      data: {
        application: this.selectedApplication,
        registeredEventTriggers: this.applicationEventTriggers
      },
    });

    dialogRef.afterClosed().subscribe(() => {
     this.getApplicationEventTriggers(this.selectedApplication._links.eventTriggers.href);
    });
  }

  invokeApplication(application: any): void {
    const dialogRef = this.dialog.open(InvokeQuantumApplicationComponent, {
      data: {
        applicationName: application.name
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.quantumApplicationService.invokeApplication(application._links.self.href, data.applicationParameters).subscribe(() => {
          this.toastService.displayToast('Application invocation was successfully transmitted!');
        });
      }
    });
  }

  downloadApplicationScript(application: any): void {
    const anchor = document.createElement('a');
    const blob = new Blob([atob(application.code)], {type: 'text/plain'});
    anchor.download = application.name + '.py';
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.click();
  }
}
