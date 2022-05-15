import { AppointmentInstance } from '../models/AppointmentModel';
import { FileConfig } from './FileConfig';

export interface Locals {
  tmpDir?: string;
  filesConfig?: FileConfig;
  appointment?: AppointmentInstance,
}
