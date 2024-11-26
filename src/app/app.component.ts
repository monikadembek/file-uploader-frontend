import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { FilesUploaderComponent } from './file-upload/components/files-uploader/files-uploader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly dialog = inject(MatDialog);

  openUploadDialog() {
    const dialogRef = this.dialog.open(FilesUploaderComponent, {
      height: '600px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe();
  }
}
