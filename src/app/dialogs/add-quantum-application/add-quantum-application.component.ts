import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, Form, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-quantum-application.component.html',
  styleUrls: ['./add-quantum-application.component.scss']
})
export class AddQuantumApplicationComponent implements OnInit {

  parametersNameForm = new FormArray([]);
  parametersDefaultValueForm = new FormArray([]);
  parametersTypeForm = new FormArray([]);

  form = new FormGroup({
    name: new FormControl(this.data.name, [
      Validators.required
    ]),
    file: new FormControl(this.data.name, [
      Validators.required
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dialogRef: MatDialogRef<AddQuantumApplicationComponent>) {
  }

  ngOnInit(): void {
    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.name = this.name ? this.name.value : undefined;
      this.data.file = this.file ? this.file.value : undefined;
      this.data.parameters = this.buildParameters();
    });
  }

  private buildParameters(): any {
    const parameters = {};
    for (let i = 0; i < this.parametersDefaultValueForm.length; i++) {
      // @ts-ignore
      parameters[this.parametersNameForm.at(i).value.toString()] = {
        type: this.parametersTypeForm.at(i).value,
        defaultValue: this.parametersDefaultValueForm.at(i).value
      }
    }
    return parameters;
  }

  get name(): AbstractControl | null {
    return this.form ? this.form.get('name') : null;
  }

  get file(): AbstractControl | null {
    return this.form ? this.form.get('file') : null;
  }

  removeParameter(index: number) {
    this.parametersNameForm.removeAt(index);
    this.parametersTypeForm.removeAt(index);
    this.parametersDefaultValueForm.removeAt(index);
  }

  addParameter(): void {
    this.parametersNameForm.push(new FormControl('', Validators.required));
    this.parametersTypeForm.push(new FormControl('STRING', Validators.required));
    this.parametersDefaultValueForm.push(new FormControl('', Validators.required));
  }

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (this.name.errors?.required || this.file.errors?.required || this.checkParameters());
  }

  checkParameters(): boolean {
    for (const control of this.parametersNameForm.controls) {
      if (control.errors?.required) {
        return true;
      }
    }
    for (const control of this.parametersTypeForm.controls) {
      if (control.errors?.required) {
        return true;
      }
    }
    for (const control of this.parametersDefaultValueForm.controls) {
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

export interface DialogData {
  title: string;
  name: string;
  file: any;
  parameters?: any;
}
