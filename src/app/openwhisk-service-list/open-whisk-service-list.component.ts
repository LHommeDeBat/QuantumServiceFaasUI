import { Component, OnInit } from '@angular/core';
import { OpenWhiskServiceService } from '../services/open-whisk-service.service';
import { ToastService } from '../services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { AddOpenWhiskServiceComponent } from '../dialogs/add-openwhisk-service/add-open-whisk-service.component';
import { OpenWhiskServiceDto } from '../models/open-whisk-service-dto';

@Component({
  selector: 'app-provider-list',
  templateUrl: './open-whisk-service-list.component.html',
  styleUrls: ['./open-whisk-service-list.component.scss']
})
export class OpenWhiskServiceListComponent implements OnInit {

  openWhiskServices: any[] = [];

  constructor(private openWhiskServiceService: OpenWhiskServiceService,
              private toastService: ToastService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getOpenWhiskServices();
  }

  getOpenWhiskServices(): void {
    this.openWhiskServiceService.getOpenWhiskServices().subscribe(response => {
      this.openWhiskServices = response._embedded ? response._embedded.openWhiskServices : [];
    });
  }

  addProvider(): void {
    const dialogRef = this.dialog.open(AddOpenWhiskServiceComponent, {
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
        const dto: OpenWhiskServiceDto = {
          name: data.name,
          baseUrl: data.baseUrl,
          basicCredentials: data.basicUsername + ':' + data.basicPassword,
          namespace: data.namespace
        };

        this.openWhiskServiceService.createOpenWhiskService(dto).subscribe(() => {
          this.getOpenWhiskServices();
        });
      }
    });
  }

  deleteProvider(url: string): void {
    this.openWhiskServiceService.deleteOpenWhiskService(url).subscribe(() => {
      this.getOpenWhiskServices();
    })
  }
}
