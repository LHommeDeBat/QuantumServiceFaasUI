import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OpenWhiskServiceService } from '../../services/open-whisk-service.service';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-quantum-application.component.html',
  styleUrls: ['./add-quantum-application.component.scss']
})
export class AddQuantumApplicationComponent implements OnInit {

  availableOpenWhiskServices : any[] = [];
  loadingOpenWhiskServices: boolean = true;

  form = new FormGroup({
    name: new FormControl(this.data.name, [
      Validators.required
    ]),
    openWhiskService: new FormControl(this.data.openWhiskService, [
      Validators.required
    ]),
    dockerImage: new FormControl(this.data.dockerImage),
    file: new FormControl(this.data.name, [
      Validators.required
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private openWhiskServiceService: OpenWhiskServiceService,
              private dialogRef: MatDialogRef<AddQuantumApplicationComponent>) {
  }

  ngOnInit(): void {
    this.openWhiskServiceService.getOpenWhiskServices().subscribe(response => {
      this.availableOpenWhiskServices = response._embedded ? response._embedded.openWhiskServices : [];
      if (this.availableOpenWhiskServices.length > 0) {
        this.openWhiskService?.setValue(this.availableOpenWhiskServices[0]);
      }
      this.loadingOpenWhiskServices = false;
    });
    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.name = this.name ? this.name.value : undefined;
      this.data.file = this.file ? this.file.value : undefined;
      this.data.openWhiskService = this.openWhiskService ? this.openWhiskService.value : undefined;
      this.data.dockerImage = this.dockerImage ? this.dockerImage.value : undefined;
    });
  }

  get name(): AbstractControl | null {
    return this.form ? this.form.get('name') : null;
  }

  get file(): AbstractControl | null {
    return this.form ? this.form.get('file') : null;
  }

  get openWhiskService(): AbstractControl | null {
    return this.form ? this.form.get('openWhiskService') : null;
  }

  get dockerImage(): AbstractControl | null {
    return this.form ? this.form.get('dockerImage') : null;
  }

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (this.name.errors?.required || this.openWhiskService.errors?.required || this.file.errors?.required);
  }

  close(): void {
    this.dialogRef.close();
  }

}

export interface DialogData {
  title: string;
  name: string;
  openWhiskService: any;
  dockerImage: string;
  notificationAddress: string;
  file: any;
  parameters?: any;
}
