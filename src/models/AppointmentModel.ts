import { Moment } from 'moment';
import mongoose, { Schema, Document } from 'mongoose';

export interface AppointmentAttributes extends Document {
  readonly id: number;
  name?: string;
  email?: string;
  date?: string;
  cancelledAt: Date | string | number | Moment;
}

export interface AppointmentInstance extends AppointmentAttributes {}

export interface Appointment extends mongoose.Model<AppointmentAttributes> {
}

const schemaAppointment: Schema = new Schema({
  name: {
    type: 'string',
    default: '',
  },
  email: {
    type: 'string',
    default: null,
  },
  date: {
    type: 'string',
    default: null,
  },
  cancelledAt: {
    type: 'string',
    default: null,
  },
});

const Appointment = mongoose.model<AppointmentInstance, Appointment>('Appointment', schemaAppointment);
Appointment.prototype.toJSON = function toJSON() {
  const result = this.toObject();
  delete result.__v;
  return result;
};
export default Appointment;

