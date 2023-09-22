import { Injectable } from '@angular/core';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarConfigService {

  constructor() { }

  commonSnackBarConfig: MatSnackBarConfig = {
    verticalPosition: 'top',
    horizontalPosition: 'center',
    duration: 3000,
  };
}
