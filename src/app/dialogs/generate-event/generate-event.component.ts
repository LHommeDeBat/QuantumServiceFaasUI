import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FireEventDto } from '../../models/fire-event-dto';
import { IbmqService } from '../../services/ibmq.service';
import { QuantumApplicationService } from '../../services/quantum-application.service';

@Component({
  selector: 'app-generate-event',
  templateUrl: './generate-event.component.html',
  styleUrls: ['./generate-event.component.scss']
})
export class GenerateEventComponent implements OnInit {

  availableDevices: string[] = [];
  quantumApplications: any[] = [];
  loadingDevices: boolean = true;

  parametersNameForm = new FormArray([]);
  parametersValueForm = new FormArray([]);

  form = new FormGroup({
    device: new FormControl('no-devices', [
      Validators.required
    ]),
    eventType: new FormControl(this.data.eventType ? this.data.eventType : 'QUEUE_SIZE', [
      Validators.required
    ]),
    replyTo: new FormControl(this.data.replyTo ? this.data.replyTo : 'JOB.RESULT.QUEUE', [
      Validators.required
    ]),
    queueSize: new FormControl(this.data.additionalProperties && this.data.additionalProperties.queueSize ? this.data.additionalProperties.queueSize : undefined, [
      Validators.required
    ]),
    executedApplication: new FormControl(this.data.executedApplication ? this.data.executedApplication : undefined, [
      Validators.required
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: FireEventDto,
              private ibmqService: IbmqService,
              private quantumApplicationService: QuantumApplicationService,
              private dialogRef: MatDialogRef<GenerateEventComponent>) {
  }

  ngOnInit(): void {
    if (!this.data.additionalProperties) {
      this.data.additionalProperties = {};
    }

    this.quantumApplicationService.getQuantumApplications().subscribe(response => {
      this.quantumApplications = response._embedded ? response._embedded.quantumApplications : [];
    });

    this.ibmqService.getAvailableDevices().subscribe(response => {
      this.loadingDevices = false;
      this.availableDevices = response ? response : [];

      if (this.availableDevices.length > 0) {
        this.device?.setValue(this.availableDevices[0]);
      }
    });

    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.device = this.device ? this.device.value : undefined;
      this.data.eventType = this.eventType ? this.eventType.value : undefined;
      this.data.replyTo = this.replyTo ? this.replyTo.value : undefined;
      if (this.data.eventType === 'QUEUE_SIZE') {
        this.data.additionalProperties.queueSize = this.queueSize ? this.queueSize.value : undefined;
      }
      if (this.data.eventType === 'EXECUTION_RESULT') {
        this.data.additionalProperties.executedApplication = this.executedApplication ? this.executedApplication.value : undefined;
      }
      for (let i = 0; i < this.parametersNameForm.length; i++) {
        this.data.additionalProperties[this.parametersNameForm.at(i).value.toString()] = this.parametersValueForm.at(i).value;
      }
    });
  }

  get device(): AbstractControl | null {
    return this.form ? this.form.get('device') : null;
  }

  get eventType(): AbstractControl | null {
    return this.form ? this.form.get('eventType') : null;
  }

  get replyTo(): AbstractControl | null {
    return this.form ? this.form.get('replyTo') : null;
  }

  get queueSize(): AbstractControl | null {
    return this.form ? this.form.get('queueSize') : null;
  }

  get executedApplication(): AbstractControl | null {
    return this.form ? this.form.get('executedApplication') : null;
  }

  removeParameter(index: number) {
    this.parametersNameForm.removeAt(index);
    this.parametersValueForm.removeAt(index);
  }

  addParameter(): void {
    this.parametersNameForm.push(new FormControl('', Validators.required));
    this.parametersValueForm.push(new FormControl('', Validators.required));
  }

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (
      this.availableDevices.length === 0 ||
      this.device?.errors?.required ||
      this.eventType?.errors?.required ||
      this.replyTo?.errors?.required ||
      (this.eventType?.value === 'QUEUE_SIZE' && this.queueSize?.errors?.required) ||
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
    return false;
  }

  close(): void {
    this.dialogRef.close();
  }

}
