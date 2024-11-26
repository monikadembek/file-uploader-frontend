import { Component, ElementRef, computed, signal, viewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { FilesService } from '../files.service';
import { UploadProgress } from '../models';
import { ProgressBarComponent } from '../components/progress-bar.component';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [ProgressBarComponent],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss'
})
export class FilesComponent {
  previewUrl = signal<string | null>(null);
  imageUrl = signal<string | null>(null);
  uploading = signal(false);
  uploadProgress = signal(0);
  errorMessage = signal('');
  fileName = signal('');
  fileInput = viewChild.required<ElementRef>('fileInput');
  
  private selectedFile: File | null = null;
  private cancelUploadFn: (() => void) | null = null;

  uploadButtonDisabled = computed(() => !this.previewUrl() || this.uploading());

  constructor(private filesService: FilesService) { }

  onFileSelected(event: any) {
    this.errorMessage.set('');
    const file = event.target.files[0];
    console.log('file', file);
    if (file) {
      this.selectedFile = file;
      this.fileName.set(file.name);

      // create file preview
      // FileReader - asynchronously reads content of file stored on user's drive,
      // using File or Blob objects
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl.set(e.target.result);
        console.log('file preview: ', this.previewUrl());
      }
      // get image preview url in base64 string format
      // readAsDataURL() - produces data as data:URL representing file's data as a base64 encoded string
      reader.readAsDataURL(file);
    }
  }

  clearPreview() {
    this.previewUrl.set(null);
    this.selectedFile = null;
    this.fileName.set('');

    // reset the file input value,
    // without that change event won't be triggered if we select the same file again
    if (this.fileInput()) {
      this.fileInput().nativeElement.value = '';
    }
  }

  uploadImage() {
    if (this.selectedFile) {
      this.uploading.set(true);
      this.uploadProgress.set(0);
      this.errorMessage.set('');

      const { uploadProgress$, cancelUpload } = this.filesService.upload(this.selectedFile);
      this.cancelUploadFn = cancelUpload;

      uploadProgress$
        .pipe(
          finalize(() => {
            this.uploading.set(false);
            this.cancelUploadFn = null;
          })
        )
        .subscribe({
          next: (event: UploadProgress) => {
            console.log('event: ', event);
            this.uploadProgress.set(event.progress);
             if (event.response) {
              this.imageUrl.set(event.response.url);
              this.clearPreview();
            }
          },
          error: (error) => {
            if (error.name === 'AbortError') {
              this.errorMessage.set('Upload cancelled.');
            } else {
              this.errorMessage.set('Upload failed. Please try again.');
            }
            console.error('Upload failed:', error);
          }
        });
    }
  }

  cancelUpload(): void {
    if (this.cancelUploadFn) {
      this.cancelUploadFn()
      this.clearPreview();
    }
  }

}
