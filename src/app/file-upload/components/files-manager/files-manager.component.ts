import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FilesService } from '../../files.service';
import { Resource } from '../../models';
import { UploadingStateService } from '../../uploading-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-files-manager',
  standalone: true,
  imports: [],
  templateUrl: './files-manager.component.html',
  styleUrl: './files-manager.component.scss'
})
export class FilesManagerComponent {
  files = signal<Resource[]>([]);
  errorMessage = signal('');

  readonly filesService = inject(FilesService);
  readonly uploadingStateService = inject(UploadingStateService);
  readonly dialog = inject(MatDialog);
  readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.getFiles();
    this.refreshFiles();
  }

  async getFiles(): Promise<void> {
    try {
      const files = await this.filesService.getFiles();
      this.files.set(files);
      this.errorMessage.set('');
      console.log('files: ', this.files());
    } catch(error) {
      console.log('error: ', error);
      this.errorMessage.set('Displaying files was not possible');
    }
  }

  openDeleteConfirmationDialog(fileId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
    dialogRef.afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(shouldDelete => {
      if (shouldDelete) {
        this.deleteFile(fileId);
      }
    })
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      const { message, publicId } = await this.filesService.deleteFile(fileId);
      console.log('delete response: ', message, publicId);
      
      this.files.update((files) => {
        return files.filter(file => file.public_id !== publicId);
      });

      this.errorMessage.set('');
    } catch (error) {
      console.log('error: ', error);
      this.errorMessage.set('Deleting file was not possible');
    }
  }

  private refreshFiles(): void {
    this.uploadingStateService.shouldRefreshFiles$
      .pipe(takeUntilDestroyed())
      .subscribe(shouldRefresh => {
        if (shouldRefresh) {
          this.getFiles();
        }
      })
  }
}
