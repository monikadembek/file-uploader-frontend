import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FilesService } from './files.service';
import { HttpEventType } from '@angular/common/http';

describe('FilesService', () => {
  let service: FilesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FilesService]
    });
    service = TestBed.inject(FilesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('test_upload_file_progress', () => {
    const mockFile = new File([''], 'test-file.jpg');
    const { uploadProgress$ } = service.upload(mockFile);

    uploadProgress$.subscribe(progress => {
      if (progress.progress === 100) {
        expect(progress.response).toEqual({ url: 'http://example.com', imagePublicId: '123', message: 'Success' });
      } else {
        expect(progress.progress).toBeGreaterThanOrEqual(0);
        expect(progress.progress).toBeLessThanOrEqual(100);
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/files/cloudinary-image-upload');
    expect(req.request.method).toBe('POST');

    req.event({
      type: HttpEventType.UploadProgress,
      loaded: 50,
      total: 100
    });

    req.flush({ url: 'http://example.com', imagePublicId: '123', message: 'Success' }, { type: HttpEventType.Response });
  });

  it('test_upload_file_cancellation', () => {
    const mockFile = new File([''], 'test-file.jpg');
    const { uploadProgress$, cancelUpload } = service.upload(mockFile);

    uploadProgress$.subscribe({
      next: () => fail('Should not emit after cancellation'),
      error: () => fail('Should not error after cancellation'),
      complete: () => fail('Should not complete after cancellation')
    });

    cancelUpload();

    const req = httpMock.expectOne('http://localhost:3000/files/cloudinary-image-upload');
    expect(req.request.method).toBe('POST');
    expect(req.cancelled).toBeTrue();
  });

  it('test_get_files', () => {
    const mockFiles = [{ name: 'file1.jpg' }, { name: 'file2.jpg' }];

    service.getFiles().subscribe(files => {
      expect(files).toEqual(mockFiles);
    });

    const req = httpMock.expectOne('http://localhost:3000/files');
    expect(req.request.method).toBe('GET');
    req.flush(mockFiles);
  });
});
