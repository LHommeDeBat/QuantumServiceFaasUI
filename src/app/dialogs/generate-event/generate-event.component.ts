import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FireEventDto } from '../../models/fire-event-dto';
import { IbmqService } from '../../services/ibmq.service';
import { QuantumApplicationService } from '../../services/quantum-application.service';
import { EventTriggerService } from '../../services/event-trigger.service';

@Component({
  selector: 'app-generate-event',
  templateUrl: './generate-event.component.html',
  styleUrls: ['./generate-event.component.scss']
})
export class GenerateEventComponent implements OnInit {

  availableDevices: string[] = [];
  quantumApplications: any[] = [];
  eventTriggers: any[] = [];
  loadingDevices: boolean = true;

  parametersNameForm = new FormArray([]);
  parametersValueForm = new FormArray([]);
  parametersTypeForm = new FormArray([]);

  form = new FormGroup({
    device: new FormControl('no-devices', [
      Validators.required
    ]),
    eventType: new FormControl(this.data.eventType ? this.data.eventType : 'BASIC', [
      Validators.required
    ]),
    queueSize: new FormControl(this.data.queueSize ? this.data.queueSize: undefined, [
      Validators.required
    ]),
    executedApplicationName: new FormControl(this.data.executedApplicationName ? this.data.executedApplicationName : undefined, [
      Validators.required
    ]),
    triggerName: new FormControl(this.data.triggerName ? this.data.triggerName : undefined, [
      Validators.required
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: FireEventDto,
              private ibmqService: IbmqService,
              private quantumApplicationService: QuantumApplicationService,
              private eventTriggerService: EventTriggerService,
              private dialogRef: MatDialogRef<GenerateEventComponent>) {
  }

  ngOnInit(): void {
    if (!this.data.additionalProperties) {
      this.data.additionalProperties = {};
    }

    if (!this.data.eventPayloadProperties) {
      this.data.eventPayloadProperties = {};
    }

    this.quantumApplicationService.getQuantumApplications().subscribe(response => {
      this.quantumApplications = response._embedded ? response._embedded.quantumApplications : [];

      if (this.quantumApplications.length > 0) {
        this.executedApplicationName?.setValue(this.quantumApplications[0].name);
      }
    });

    this.eventTriggerService.getEventTriggers().subscribe(response => {
      this.eventTriggers = response._embedded ? response._embedded.eventTriggers : [];

      if (this.eventTriggers.length > 0) {
        this.triggerName?.setValue(this.eventTriggers[0].name);
      }
    });

    this.ibmqService.getAvailableDevices().subscribe(response => {
      this.loadingDevices = false;
      this.availableDevices = response ? response : [];

      if (this.availableDevices.length > 0) {
        this.device?.setValue(this.availableDevices[0]);
      }
    });

    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.eventPayloadProperties['device'] = this.device ? this.device.value : undefined;
      this.data.eventType = this.eventType ? this.eventType.value : undefined;
      if (this.data.eventType === 'BASIC') {
        this.data.additionalProperties.triggerName = this.triggerName ? this.triggerName.value : undefined;
      }
      if (this.data.eventType === 'QUEUE_SIZE') {
        this.data.additionalProperties.queueSize = this.queueSize ? this.queueSize.value : undefined;
      }
      if (this.data.eventType === 'EXECUTION_RESULT') {
        this.data.additionalProperties.executedApplicationName = this.executedApplicationName ? this.executedApplicationName.value : undefined;
      }
      for (let i = 0; i < this.parametersNameForm.length; i++) {
        if (this.parametersTypeForm.at(i).value == 'TEXT') {
          this.data.eventPayloadProperties[this.parametersNameForm.at(i).value.toString()] = this.parametersValueForm.at(i).value;
        } else if (this.parametersTypeForm.at(i).value == 'BOOLEAN') {
          this.data.eventPayloadProperties[this.parametersNameForm.at(i).value.toString()] = JSON.parse(this.parametersValueForm.at(i).value);
        } else {
          this.data.eventPayloadProperties[this.parametersNameForm.at(i).value.toString()] = +this.parametersValueForm.at(i).value;
        }
      }
    });
  }

  get device(): AbstractControl | null {
    return this.form ? this.form.get('device') : null;
  }

  get eventType(): AbstractControl | null {
    return this.form ? this.form.get('eventType') : null;
  }

  get queueSize(): AbstractControl | null {
    return this.form ? this.form.get('queueSize') : null;
  }

  get executedApplicationName(): AbstractControl | null {
    return this.form ? this.form.get('executedApplicationName') : null;
  }

  get triggerName(): AbstractControl | null {
    return this.form ? this.form.get('triggerName') : null;
  }

  removeParameter(index: number) {
    this.parametersNameForm.removeAt(index);
    this.parametersValueForm.removeAt(index);
    this.parametersTypeForm.removeAt(index);
  }

  addParameter(): void {
    this.parametersNameForm.push(new FormControl('', Validators.required));
    this.parametersValueForm.push(new FormControl('', Validators.required));
    this.parametersTypeForm.push(new FormControl('TEXT', Validators.required));
  }

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (
      this.availableDevices.length === 0 ||
      this.device?.errors?.required ||
      this.eventType?.errors?.required ||
      (this.eventType?.value === 'QUEUE_SIZE' && this.queueSize?.errors?.required) ||
      (this.eventType?.value === 'EXECUTION_RESULT' && this.executedApplicationName?.errors?.required) ||
      (this.eventType?.value === 'BASIC' && this.triggerName?.errors?.required) ||
      this.checkParameters()
    );
  }

  checkParameters(): boolean {
    for (const control of this.parametersNameForm.controls) {
      if (control.errors?.required) {
        return true;
      }
    }
    for (const control of this.parametersValueForm.controls) {
      if (control.errors?.required) {
        return true;
      }
    }
    for (const control of this.parametersTypeForm.controls) {
      if (control.errors?.required) {
        return true;
      }
    }
    return false;
  }

  close(): void {
    this.dialogRef.close();
  }

}
