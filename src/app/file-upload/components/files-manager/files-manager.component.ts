import { Component, inject, signal } from '@angular/core';
import { FilesService } from '../../files.service';
import { Resource } from '../../models';

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

  filesService = inject(FilesService);

  constructor() {
    this.getFiles();
  }

  async getFiles() {
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

  async deleteFile(fileId: string) {
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
}
