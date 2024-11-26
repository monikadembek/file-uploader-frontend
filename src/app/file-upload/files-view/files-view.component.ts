import { Component } from '@angular/core';
import { FilesUploaderComponent } from "../components/files-uploader/files-uploader.component";

@Component({
  selector: 'app-files-view',
  standalone: true,
  imports: [FilesUploaderComponent],
  templateUrl: './files-view.component.html',
  styleUrl: './files-view.component.scss'
})
export class FilesViewComponent {

}
