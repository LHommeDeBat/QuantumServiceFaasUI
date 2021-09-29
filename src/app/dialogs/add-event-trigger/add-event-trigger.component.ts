import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuantumApplicationService } from '../../services/quantum-application.service';
import { ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event-trigger.component.html',
  styleUrls: ['./add-event-trigger.component.scss']
})
export class AddEventTriggerComponent implements OnInit {

  availableQuantumApplications: any[] = [];
  availableProviders : any[] = [];
  loadingProviders: boolean = true;

  form = new FormGroup({
    name: new FormControl(this.data.name ? this.data.name : '', [
      Validators.required
    ]),
    provider: new FormControl(this.data.provider ? this.data.provider : '', [
      Validators.required
    ]),
    eventType: new FormControl(this.data.eventType ? this.data.eventType : 'BASIC', [
      Validators.required
    ]),
    sizeThreshold: new FormControl(this.data.sizeThreshold ? this.data.sizeThreshold : undefined, [
      Validators.required
    ]),
    executedApplication: new FormControl(this.data.executedApplication ? this.data.executedApplication : undefined, [
      Validators.required
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private providerService: ProviderService,
              private quantumApplicationService: QuantumApplicationService,
              private dialogRef: MatDialogRef<AddEventTriggerComponent>) {
  }

  ngOnInit(): void {
    this.providerService.getProviders().subscribe(response => {
      this.availableProviders = response._embedded ? response._embedded.providers : [];
      if (this.availableProviders.length > 0) {
        this.provider?.setValue(this.availableProviders[0]);
      }
      this.loadingProviders = false;
    });
    this.quantumApplicationService.getQuantumApplications(true).subscribe(response => {
      this.availableQuantumApplications = response._embedded ? response._embedded.quantumApplications : [];
    });

    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.name = this.name ? this.name.value : undefined;
      this.data.provider = this.provider ? this.provider.value : undefined;
      this.data.eventType = this.eventType ? this.eventType.value : undefined;
      if (this.data.eventType === 'QUEUE_SIZE') {
        this.data.sizeThreshold = this.sizeThreshold ? this.sizeThreshold.value : undefined;
      }
      if (this.data.eventType === 'EXECUTION_RESULT') {
        this.data.executedApplication = this.executedApplication ? this.executedApplication.value : undefined;
      }
    });
  }

  get name(): AbstractControl | null {
    return this.form ? this.form.get('name') : null;
  }

  get provider(): AbstractControl | null {
    return this.form ? this.form.get('provider') : null;
  }

  get eventType(): AbstractControl | null {
    return this.form ? this.form.get('eventType') : null;
  }

  get sizeThreshold(): AbstractControl | null {
    return this.form ? this.form.get('sizeThreshold') : null;
  }

  get executedApplication(): AbstractControl | null {
    return this.form ? this.form.get('executedApplication') : null;
  }

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (
      this.name?.errors?.required ||
      this.eventType?.errors?.required ||
      this.provider?.errors?.required ||
      (this.eventType?.value === 'QUEUE_SIZE' && this.sizeThreshold?.errors?.required) ||
      (this.eventType?.value === 'EXECUTION_RESULT' && this.executedApplication?.errors?.required)
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  name: string;
  provider: any;
  eventType: string;
  sizeThreshold: number;
  executedApplication: any;
}
