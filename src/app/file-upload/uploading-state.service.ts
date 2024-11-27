import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadingStateService {
  private shouldRefreshFiles = new BehaviorSubject<boolean>(false);
  shouldRefreshFiles$ = this.shouldRefreshFiles.asObservable();

  setFilesNeedRefresh() {
    this.shouldRefreshFiles.next(true);
  }

  setFilesUpToDate() {
    this.shouldRefreshFiles.next(false);
  }
}