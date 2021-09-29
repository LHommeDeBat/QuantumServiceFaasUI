import { EventTriggerService } from '../services/event-trigger.service';
import { Component, OnInit } from '@angular/core';
import { EventTriggerDto } from '../models/event-trigger-dto';
import { MatDialog } from '@angular/material/dialog';
import { AddEventTriggerComponent } from '../dialogs/add-event-trigger/add-event-trigger.component';
import { FireEventDto } from '../models/fire-event-dto';
import { GenerateEventComponent } from '../dialogs/generate-event/generate-event.component';
import { ToastService } from '../services/toast.service';
import { QuantumApplicationService } from '../services/quantum-application.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-trigger-list.component.html',
  styleUrls: ['./event-trigger-list.component.scss']
})
export class EventTriggerListComponent implements OnInit {

  eventTriggers: any[] = [];

  constructor(private eventTriggerService: EventTriggerService,
              private quantumApplicationService: QuantumApplicationService,
              private toastService: ToastService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getEventTriggers();
  }

  getEventTriggers(): void {
    this.eventTriggerService.getEventTriggers().subscribe(response => {
      this.eventTriggers = response._embedded ? response._embedded.eventTriggers : [];

      for (const eventTrigger of this.eventTriggers) {
        if (eventTrigger.eventType === 'EXECUTION_RESULT') {
          this.quantumApplicationService.getQuantumApplication(eventTrigger._links.executedApplication.href).subscribe( response => {
            eventTrigger.executedApplication = response ? response : undefined;
          });
        }
      }
    });
  }

  addEventTrigger(): void {
    const dialogRef = this.dialog.open(AddEventTriggerComponent, {
      data: {
        name: '',
        eventType: '',
        additionalProperties: {}
      },
    });

    dialogRef.afterClosed().subscribe((data: EventTriggerDto) => {
      if (data) {
        const dto: EventTriggerDto = {
          name: data.name,
          eventType: data.eventType,
          queueSize: data.queueSize,
          executedApplication: data.executedApplication
        };

        this.eventTriggerService.createEventTrigger(dto).subscribe(() => {
          this.getEventTriggers();
        });
      }
    });
  }

  deleteEventTrigger(url: string): void {
    this.eventTriggerService.deleteEventTrigger(url).subscribe(() => {
      this.getEventTriggers();
    })
  }

  generateTypeDisplay(eventTrigger: any): string {
    if (eventTrigger.eventType === 'QUEUE_SIZE') {
      return eventTrigger.eventType + ' <= ' + eventTrigger.queueSize;
    }

    if (eventTrigger.eventType === 'EXECUTION_RESULT') {
      return eventTrigger.eventType + ' (' + eventTrigger.executedApplication.name + ')';
    }

    return eventTrigger.eventType;
  }

  fireEvent(): void {
    const dialogRef = this.dialog.open(GenerateEventComponent, {
      data: {
        additionalProperties: {}
      },
    });

    dialogRef.afterClosed().subscribe((data: FireEventDto) => {
      if (data) {
        const dto: FireEventDto = {
          device: data.device,
          replyTo: data.replyTo,
          eventType: data.eventType,
          additionalProperties: data.additionalProperties,
        };

        this.eventTriggerService.fireEvent(dto).subscribe(() => {
          this.toastService.displayToast('Event was successfully fired!');
        });
      }
    });
  }
}
