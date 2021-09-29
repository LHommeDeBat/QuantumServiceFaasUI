import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-quantum-application.component.html',
  styleUrls: ['./add-quantum-application.component.scss']
})
export class AddQuantumApplicationComponent implements OnInit {

  parametersNameForm = new FormArray([]);
  parametersDefaultValueForm = new FormArray([]);
  parametersTypeForm = new FormArray([]);
  availableProviders : any[] = [];
  loadingProviders: boolean = true;

  form = new FormGroup({
    name: new FormControl(this.data.name, [
      Validators.required
    ]),
    provider: new FormControl(this.data.provider, [
      Validators.required
    ]),
    dockerImage: new FormControl(this.data.dockerImage),
    notificationAddress: new FormControl(this.data.notificationAddress),
    file: new FormControl(this.data.name, [
      Validators.required
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private providerService: ProviderService,
              private dialogRef: MatDialogRef<AddQuantumApplicationComponent>) {
  }

  ngOnInit(): void {
    this.providerService.getProviders().subscribe(response => {
      this.availableProviders = response._embedded ? response._embedded.providers : [];
      if (this.availableProviders.length > 0) {
        this.provider?.setValue(this.availableProviders[0]);
      }
      this.loadingProviders = false;
    });
    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.name = this.name ? this.name.value : undefined;
      this.data.file = this.file ? this.file.value : undefined;
      this.data.provider = this.provider ? this.provider.value : undefined;
      this.data.dockerImage = this.dockerImage ? this.dockerImage.value : undefined;
      this.data.notificationAddress = this.notificationAddress ? this.notificationAddress.value : undefined;
    });
  }

  get name(): AbstractControl | null {
    return this.form ? this.form.get('name') : null;
  }

  get file(): AbstractControl | null {
    return this.form ? this.form.get('file') : null;
  }

  get provider(): AbstractControl | null {
    return this.form ? this.form.get('provider') : null;
  }

  get dockerImage(): AbstractControl | null {
    return this.form ? this.form.get('dockerImage') : null;
  }

  get notificationAddress(): AbstractControl | null {
    return this.form ? this.form.get('notificationAddress') : null;
  }

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (this.name.errors?.required || this.provider.errors?.required || this.file.errors?.required);
  }

  close(): void {
    this.dialogRef.close();
  }

}

export interface DialogData {
  title: string;
  name: string;
  provider: any;
  dockerImage: string;
  notificationAddress: string;
  file: any;
  parameters?: any;
}
