import { HttpInterceptorFn } from '@angular/common/http';
import { SkipLoading } from '../loading/skip-loading';
import { LoadingService } from '../loading/loading.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // check http context tokens for SkipLoading token,
  // if it's present then don't turn on loading indicator
  if (req.context.get(SkipLoading)) {
    return next(req);
  }

  const loadingService = inject(LoadingService);
  loadingService.switchOnLoading();

  return next(req).pipe(
    finalize(() => {
      loadingService.switchOffLoading();
    })
  );
};
