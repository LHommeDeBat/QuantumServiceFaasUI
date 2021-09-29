import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  defaultDuration = 3000;
  defaultAction = 'Close';

  constructor(private snackBar: MatSnackBar) {}

  displayToast(message: string, action?: string, duration?: number): void {
    this.snackBar.open(message, action ? action : this.defaultAction, {
      duration: duration ? duration : this.defaultDuration
    });
  }
}
