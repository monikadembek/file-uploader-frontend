import { HttpClient, HttpEvent, HttpEventType, HttpContextToken, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { UploadResponse, UploadProgress } from './models';

const ABORT_SIGNAL = new HttpContextToken<AbortSignal>(() => new AbortController().signal);

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private baseUrl = 'http://localhost:3000';
  private abortController: AbortController | null = null;

  constructor(private http: HttpClient) {}

  upload(file: File): { 
    uploadProgress$: Observable<UploadProgress>, 
    cancelUpload: () => void 
  } {
    this.abortController = new AbortController();
    const cancelSignal$ = new Subject<void>();
    
    const formData: FormData = new FormData();
    formData.append('file', file);

    const uploadProgress$ = this.http.post<UploadResponse>(
      `${this.baseUrl}/files/cloudinary-image-upload`,
      formData, 
      {
        reportProgress: true,
        observe: 'events',
        context: new HttpContext().set(ABORT_SIGNAL, this.abortController.signal),
      }
    ).pipe(
      map((event: HttpEvent<UploadResponse>): UploadProgress => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
            return { progress };
          case HttpEventType.Response:
            return { 
              progress: 100, 
              response: event.body || undefined 
            };
          default:
            return { progress: 0 };
        }
      }),
      takeUntil(cancelSignal$)
    );

    const cancelUpload = () => {
      if (this.abortController) {
        this.abortController.abort();
        cancelSignal$.next();
        cancelSignal$.complete();
      }
    };

    return { uploadProgress$, cancelUpload };
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
