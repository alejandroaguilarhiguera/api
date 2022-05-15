import { Moment } from 'moment';

export interface Attachment {
  id?: number | string;
  filename: string;
  tmpDir: string;
  mimetype: string;
  size: number;
  extension?: string;
  uploadedBy: number;
  uploadedAt: string | Date | Moment;
  temp?: string;
  thumbnail?: string;
  url?: string;
}
