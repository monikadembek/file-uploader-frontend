import { Component, ViewChild, ElementRef } from '@angular/core';
import { finalize } from 'rxjs';
import { FilesService } from '../files.service';
import { NgIf } from '@angular/common';
import { ProgressBarComponent } from '../components/progress-bar.component';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [ProgressBarComponent, NgIf],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss'
})
export class FilesComponent {
  previewUrl: string | null = null;
  imageUrl: string | null = null;
  uploading = false;
  uploadProgress = 0;
  fileName = '';
  errorMessage = '';
  selectedFile: File | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;

  private cancelUploadFn: (() => void) | null = null;

  constructor(private filesService: FilesService) { }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log('file', file);
    if (file) {
      this.selectedFile = file;

      // create file preview
      // FileReader - asynchronously reads content of file stored on user's drive,
      // using File or Blob objects
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
        console.log('file preview: ', this.previewUrl);
      }
      // get image preview url in base64 string format
      // readAsDataURL() - produces data as data:URL representing file's data as a base64 encoded string
      reader.readAsDataURL(file);
    }
  }

  clearPreview() {
    this.previewUrl = null;
    this.selectedFile = null;

    // reset the file input value,
    // without that change event won't be triggered if we select the same file again
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  uploadImage() {
    if (this.selectedFile) {
      this.uploading = true;
      this.uploadProgress = 0;
      this.errorMessage = '';

      const { uploadProgress$, cancelUpload } = this.filesService.upload(this.selectedFile);
      this.cancelUploadFn = cancelUpload;

      uploadProgress$
        .pipe(
          finalize(() => {
            this.uploading = false;
            this.cancelUploadFn = null;
          })
        )
        .subscribe({
          next: (event) => {
            console.log('event: ', event);
            this.uploadProgress = event.progress;
             if (event.response) {
              this.imageUrl = event.response.url;
              this.clearPreview();
            }
          },
          error: (error) => {
            if (error.name === 'AbortError') {
              this.errorMessage = 'Upload cancelled.';
            } else {
              this.errorMessage = 'Upload failed. Please try again.';
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
