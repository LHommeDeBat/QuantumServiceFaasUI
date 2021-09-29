import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventTriggerDto } from '../../models/event-trigger-dto';
import { QuantumApplicationService } from '../../services/quantum-application.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event-trigger.component.html',
  styleUrls: ['./add-event-trigger.component.scss']
})
export class AddEventTriggerComponent implements OnInit {

  availableQuantumApplications: any[] = [];

  form = new FormGroup({
    name: new FormControl(this.data.name ? this.data.name : '', [
      Validators.required
    ]),
    eventType: new FormControl(this.data.eventType ? this.data.eventType : 'QUEUE_SIZE', [
      Validators.required
    ]),
    queueSize: new FormControl(this.data.queueSize ? this.data.queueSize : undefined, [
      Validators.required
    ]),
    executedApplication: new FormControl(this.data.executedApplication ? this.data.executedApplication : undefined, [
      Validators.required
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: EventTriggerDto,
              private quantumApplicationService: QuantumApplicationService,
              private dialogRef: MatDialogRef<AddEventTriggerComponent>) {
  }

  ngOnInit(): void {
    this.quantumApplicationService.getQuantumApplications(true).subscribe(response => {
      this.availableQuantumApplications = response._embedded ? response._embedded.quantumApplications : [];
    });

    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.name = this.name ? this.name.value : undefined;
      this.data.eventType = this.eventType ? this.eventType.value : undefined;
      if (this.data.eventType === 'QUEUE_SIZE') {
        this.data.queueSize = this.queueSize ? this.queueSize.value : undefined;
      }
      if (this.data.eventType === 'EXECUTION_RESULT') {
        this.data.executedApplication = this.executedApplication ? this.executedApplication.value : undefined;
      }
    });
  }

  get name(): AbstractControl | null {
    return this.form ? this.form.get('name') : null;
  }

  get eventType(): AbstractControl | null {
    return this.form ? this.form.get('eventType') : null;
  }

  get queueSize(): AbstractControl | null {
    return this.form ? this.form.get('queueSize') : null;
  }

  get executedApplication(): AbstractControl | null {
    return this.form ? this.form.get('executedApplication') : null;
  }

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (
      this.name?.errors?.required ||
      this.eventType?.errors?.required ||
      (this.eventType?.value === 'QUEUE_SIZE' && this.queueSize?.errors?.required) ||
      (this.eventType?.value === 'EXECUTION_RESULT' && this.executedApplication?.errors?.required)
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
