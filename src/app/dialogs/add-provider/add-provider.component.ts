import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-provider',
  templateUrl: './add-provider.component.html',
  styleUrls: ['./add-provider.component.scss']
})
export class AddProviderComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl(this.data.name, [
      Validators.required
    ]),
    baseUrl: new FormControl(this.data.baseUrl, [
      Validators.required
    ]),
    basicUsername: new FormControl(this.data.basicUsername, [
      Validators.required
    ]),
    basicPassword: new FormControl(this.data.basicPassword, [
      Validators.required
    ]),
    namespace: new FormControl(this.data.namespace, [
      Validators.required
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dialogRef: MatDialogRef<AddProviderComponent>) {
  }

  ngOnInit() {
    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.name = this.name ? this.name.value : undefined;
      this.data.baseUrl = this.baseUrl ? this.baseUrl.value : undefined;
      this.data.basicUsername = this.basicUsername ? this.basicUsername.value : undefined;
      this.data.basicPassword = this.basicPassword ? ':' + this.basicPassword.value : undefined;
      this.data.namespace = this.namespace ? this.namespace.value : undefined;
    });
  }

  get name(): AbstractControl | null {
    return this.form ? this.form.get('name') : null;
  }

  get baseUrl(): AbstractControl | null {
    return this.form ? this.form.get('baseUrl') : null;
  }

  get basicUsername(): AbstractControl | null {
    return this.form ? this.form.get('basicUsername') : null;
  }

  get basicPassword(): AbstractControl | null {
    return this.form ? this.form.get('basicPassword') : null;
  }

  get namespace(): AbstractControl | null {
    return this.form ? this.form.get('namespace') : null;
  }

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (this.name.errors?.required || this.baseUrl.errors?.required || this.basicUsername?.errors?.required || this.basicPassword?.errors?.required || this.namespace?.errors?.required);
  }

  close(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  name: string;
  baseUrl: string;
  basicUsername: any;
  basicPassword: any;
  namespace?: any;
}
