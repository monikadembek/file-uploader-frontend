export interface UploadResponse {
  url: string;
  imagePublicId: string;
  message: string;
}

export interface UploadProgress {
  progress: number;
  response?: UploadResponse;
}

export interface GetFilesResponse {
  resources: Resource[]
}

export interface Resource {
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  placeholder: boolean;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  backup: boolean;
  access_mode: string;
  url: string;
  secure_url: string;
  tags: Array<string>;
  context: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
  next_cursor: string;
  derived_next_cursor: string;
  exif: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
  image_metadata: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
  media_metadata: object;
  faces: number[][];
  quality_analysis: number;
  colors: [string, number][];
  derived: Array<string>;
  moderation: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
  phash: string;
  predominant: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
  coordinates: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
  access_control: Array<string>;
  pages: number;

  [futureKey: string]: any;
}

export interface DeleteResponse {
  message: string;
  publicId: string;
}