import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../services/provider.service';
import { ToastService } from '../services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { EventTriggerDto } from '../models/event-trigger-dto';
import { AddProviderComponent } from '../dialogs/add-provider/add-provider.component';
import { ProviderDto } from '../models/provider-dto';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit {

  providers: any[] = [];

  constructor(private providerService: ProviderService,
              private toastService: ToastService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getProviders();
  }

  getProviders(): void {
    this.providerService.getProviders().subscribe(response => {
      this.providers = response._embedded ? response._embedded.providers : [];
    });
  }

  addProvider(): void {
    const dialogRef = this.dialog.open(AddProviderComponent, {
      data: {
        name: '',
        basicUsername: '',
        basicPassword: '',
        baseUrl: '',
        namespace: ''
      }
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        const dto: ProviderDto = {
          name: data.name,
          baseUrl: data.baseUrl,
          basicCredentials: data.basicUsername + ':' + data.basicPassword,
          namespace: data.namespace
        };

        this.providerService.createProvider(dto).subscribe(() => {
          this.getProviders();
        });
      }
    });
  }

  deleteProvider(url: string): void {
    this.providerService.deleteProvider(url).subscribe(() => {
      this.getProviders();
    })
  }
}
