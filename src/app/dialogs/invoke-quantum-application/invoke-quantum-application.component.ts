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

  parametersNameForm = new FormArray([]);
  parametersValueForm = new FormArray([]);
  parametersTypeForm = new FormArray([]);

  form = new FormGroup({
    device: new FormControl('no-devices', [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: InvokeApplicationForm,
              private ibmqService: IbmqService,
              private dialogRef: MatDialogRef<InvokeQuantumApplicationComponent>) {
  }

  ngOnInit(): void {
    if (!this.data.applicationParameters) {
      this.data.applicationParameters = {};
    }
    this.ibmqService.getAvailableDevices().subscribe(response => {
      this.loadingDevices = false;
      this.availableDevices = response ? response : [];

      if (this.availableDevices.length > 0) {
        this.device?.setValue(this.availableDevices[0]);
      }
    });

    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.applicationParameters['device'] = this.device ? this.device.value : undefined;
      for (let i = 0; i < this.parametersNameForm.length; i++) {
        if (this.parametersTypeForm.at(i).value == 'TEXT') {
          this.data.applicationParameters[this.parametersNameForm.at(i).value.toString()] = this.parametersValueForm.at(i).value;
        } else if (this.parametersTypeForm.at(i).value == 'BOOLEAN') {
          this.data.applicationParameters[this.parametersNameForm.at(i).value.toString()] = JSON.parse(this.parametersValueForm.at(i).value);
        } else {
          this.data.applicationParameters[this.parametersNameForm.at(i).value.toString()] = +this.parametersValueForm.at(i).value;
        }
      }
    });
  }

  get device(): AbstractControl | null {
    return this.form ? this.form.get('device') : null;
  }

  get replyTo(): AbstractControl | null {
    return this.form ? this.form.get('replyTo') : null;
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

export interface InvokeApplicationForm {
  device: string;
  applicationName: string;
  applicationParameters: any;
}
