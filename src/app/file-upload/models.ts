export interface UploadResponse {
  url: string;
  imagePublicId: string;
  message: string;
}

export interface UploadProgress {
  progress: number;
  response?: UploadResponse;
}