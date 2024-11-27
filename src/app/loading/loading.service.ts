import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  #loadingSignal = signal(false);
  isLoading = this.#loadingSignal.asReadonly();

  constructor() { }

  switchOnLoading() {
    this.#loadingSignal.set(true);
  }

  switchOffLoading() {
    this.#loadingSignal.set(false);
  }
}
