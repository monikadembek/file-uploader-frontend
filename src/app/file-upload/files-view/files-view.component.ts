import { Component } from '@angular/core';
import { FilesManagerComponent } from "../components/files-manager/files-manager.component";

@Component({
  selector: 'app-files-view',
  standalone: true,
  imports: [FilesManagerComponent],
  templateUrl: './files-view.component.html',
  styleUrl: './files-view.component.scss'
})
export class FilesViewComponent {

}
