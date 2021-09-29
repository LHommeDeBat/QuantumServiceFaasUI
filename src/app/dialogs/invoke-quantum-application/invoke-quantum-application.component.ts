import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IbmqService } from '../../services/ibmq.service';

@Component({
  selector: 'app-invoke-action',
  templateUrl: './invoke-quantum-application.component.html',
  styleUrls: ['./invoke-quantum-application.component.scss']
})
export class InvokeQuantumApplicationComponent implements OnInit {

  availableDevices: string[] = [];
  loadingDevices: boolean = true;
  parametersForm = new FormArray([]);

  form = new FormGroup({
    device: new FormControl('no-devices', [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ]),
    replyTo: new FormControl(this.data.replyTo ? this.data.replyTo : 'JOB.RESULT.QUEUE', [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: InvokeApplicationForm,
              private ibmqService: IbmqService,
              private dialogRef: MatDialogRef<InvokeQuantumApplicationComponent>) {
  }

  ngOnInit(): void {
    for (const parameter in this.data.applicationParameters) {
      this.parametersForm.push(new FormControl('', Validators.required));
    }
    this.ibmqService.getAvailableDevices().subscribe(response => {
      this.loadingDevices = false;
      this.availableDevices = response ? response : [];

      if (this.availableDevices.length > 0) {
        this.device?.setValue(this.availableDevices[0]);
      }
    });

    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.device = this.device ? this.device.value : undefined;
      this.data.replyTo = this.replyTo ? this.replyTo.value : undefined;
      this.data.applicationParameters = this.parametersAvailable() ? this.buildParameters() : undefined;
    });
  }

  get device(): AbstractControl | null {
    return this.form ? this.form.get('device') : null;
  }

  get replyTo(): AbstractControl | null {
    return this.form ? this.form.get('replyTo') : null;
  }

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (this.availableDevices.length === 0 || this.device?.errors?.required || this.replyTo?.errors?.required || this.checkParameters());
  }

  checkParameters(): boolean {
    for (const control of this.parametersForm.controls) {
      if (control.errors?.required) {
        return true;
      }
    }
    return false;
  }

  close(): void {
    this.dialogRef.close();
  }

  parametersAvailable(): boolean {
    return this.data.applicationParameters && Object.keys(this.data.applicationParameters).length > 0;
  }

  getParameterList(): string[] {
    return this.data.applicationParameters ? Object.keys(this.data.applicationParameters) : [];
  }

  getInputType(parameter: string): string {
    const type = this.getParameterType(parameter);
    return type === 'FLOAT' || type === 'INTEGER' ? 'number' : 'text';
  }

  getParameterType(parameter: string): string {
    return this.data.applicationParameters[parameter].type;
  }

  buildParameters(): any {
    let parameters = {};

    let i = 0;
    for (const key in this.data.applicationParameters) {
      // @ts-ignore
      parameters[key] = this.parametersForm.at(i).value;
      i++;
    }
    return parameters;
  }
}

export interface InvokeApplicationForm {
  applicationName: string;
  applicationParameters: any;
  device: string;
  replyTo: string;
}
