import { HttpClient, HttpEvent, HttpEventType, HttpContextToken, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { UploadResponse, UploadProgress, GetFilesResponse, Resource, DeleteResponse } from './models';
import { environment } from '../../environments/environment';

const ABORT_SIGNAL = new HttpContextToken<AbortSignal>(() => new AbortController().signal);
const ASSETS_FOLDER = 'profile-photos';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private baseUrl = environment.apiUrl;
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

  getFiles(): Promise<Resource[]> {
    let params = new HttpParams();
    params = params.set('assetFolder', ASSETS_FOLDER);
    const files$: Observable<Resource[]> = this.http.get<GetFilesResponse>(`${this.baseUrl}/files/cloudinary-image`, {
      params
    }).pipe(
      tap((data) => console.log(data)),
      map((response: GetFilesResponse) => response.resources)
    );
    return firstValueFrom(files$);
  }

  deleteFile(fileId: string): Promise<DeleteResponse> {
    let params = new HttpParams();
    params = params.set('publicId', fileId);
    const delete$ = this.http.delete<DeleteResponse>(`${this.baseUrl}/files/cloudinary-image`, {
      params
    });
    return firstValueFrom(delete$);
  }
}
