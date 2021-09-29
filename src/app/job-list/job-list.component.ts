import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { JobService } from '../services/job.service';
import { MatDrawer } from '@angular/material/sidenav';
import { QuantumApplicationService } from '../services/quantum-application.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit, OnDestroy {

  // Pagination variables
  page: number = 0;
  pageSize: number = 25;
  sort: any = {
    scriptExecutionDate: 'desc'
  };
  jobTimer: any;
  reader: FileReader = new FileReader();

  // Filter variables
  availableStatuses: string[] = [
    'CREATING',
    'CREATED',
    'VALIDATING',
    'VALIDATED',
    'RUNNING',
    'COMPLETED'
  ];
  statusFilter: string[] = [];

  jobs: any[] = [];
  selectedJob: any = undefined;
  sortedJobStatuses: any[] = [];
  @ViewChild('drawer') public drawer: MatDrawer | undefined;

  paginationLinks: any = undefined;
  paginationDetails: any = undefined;

  constructor(private jobService: JobService, private quantumApplicationService: QuantumApplicationService) { }

  ngOnInit(): void {
    this.getJobs();
    this.startJobTimer();

    this.reader.addEventListener('loadend', (e) => {
      if (e.target) {
        this.selectedJob.quantumApplication.script = e.target.result;
      }
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startJobTimer(): void {
    this.jobTimer = setInterval(() => {
      this.getJobs();
    },10000)
  }

  stopTimer(): void {
    clearInterval(this.jobTimer);
  }

  getJobs(url?: string): void {
    this.jobService.getJobs(this.page, this.pageSize, this.sort, this.statusFilter, url).subscribe(response => {
      this.jobs = response._embedded ? response._embedded.jobs : [];
      this.paginationLinks = response._links ? response._links : undefined;
      this.paginationDetails = response.page ? response.page : undefined;

      for (const job of this.jobs) {
        this.jobService.getJobApplication(job._links.quantumApplication.href).subscribe(response => {
          job.quantumApplication = response ? response : undefined;
        });
      }
    });
  }

  downloadApplicationScript(application: any): void {
    this.quantumApplicationService.downloadApplicationScript(application._links.script.href).subscribe(response => {
      this.reader.readAsText(response);
    });
  }

  selectJob(job: any) {
    if (!this.selectedJob || this.selectedJob.id !== job.id) {
      this.selectedJob = job;

      for (const key of Object.keys(this.selectedJob.statusDetails)) {
        console.log(key);
        this.selectedJob.statusDetails[key].status = key;
      }
      // @ts-ignore
      this.sortedJobStatuses = Object.values(this.selectedJob.statusDetails).sort((a, b) => (a.statusReached > b.statusReached) ? 1 : ((b.statusReached > a.statusReached) ? -1 : 0));

      this.downloadApplicationScript(this.selectedJob.quantumApplication);
    }
    this.drawer?.open();
  }

  closeDetailsView(): void {
    this.drawer?.close();
    this.selectedJob = undefined;
    this.sortedJobStatuses = [];
  }

  parseResult(result: string): any {
    return JSON.parse(result);
  }

  checkSort(field: string) {
    // Check if sorting is enabled for field
    if (this.sort[field]) {
      return this.sort[field];
    }
    return 'none';
  }

  changeSort(field: string): void {
    if (this.checkSort(field) === 'none') {
      this.sort[field] = 'asc';
    } else if (this.checkSort(field) === 'asc') {
      this.sort[field] = 'desc';
    } else if (this.checkSort(field) === 'desc') {
      delete this.sort[field];
    }
    this.getJobs();
  }

  prettyPrintLogs(errorLogs: string[]): string {
    let output = '';
    for (const line of errorLogs){
      output += line + '\n';
    }
    return output;
  }
}
