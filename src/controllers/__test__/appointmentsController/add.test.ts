import SuperTest from 'supertest';
import faker from 'faker';
import mongoose from 'mongoose';
import Appointment from '../../../models/AppointmentModel';
import expectUtils from '../utils/expectUtils';
import getAgent from '../utils/agent';

expectUtils();
let agent: SuperTest.SuperTest<SuperTest.Test>;

beforeAll(async () => {
  agent = await getAgent();
});

afterAll(() => mongoose.disconnect());
describe('Add an appointment', () => {
  let AppointmentId: string = null;

  const addAppointmentSuccess = async () => {
    const appointment = {
      name: faker.name.title(),
      email: faker.internet.email(),
      date: new Date().toJSON(),
    };
    const response = await agent.post('/appointments').send(appointment);
    expect(response).httpValidator({ status: 201 });
    AppointmentId = response.body.appointment._id;
    // const { error } = schemaAppointmentsGet.validate(response.body.address);
    // expect(error).toBeUndefined();
    expect(response.body.appointment.name).toBe(appointment.name);
    expect(response.body.appointment.email).toBe(appointment.email);
    expect(response.body.appointment.date).toBe(appointment.date);
    expect(response.body.appointment.cancelledAt).toBeNull();


  };

  const addAddressFail = async () => {
    AppointmentId = null;
    const appointment = {
      name: faker.name.title(),
      email: 'bad_email@@',
    };
    const response = await agent.post('/appointments').send(appointment);
    expect(response).httpValidator({ status: 422 });
  };
  afterEach(async () => {
    await Appointment.remove({ _id: AppointmentId });
  });
  test('Appointment add success', () => addAppointmentSuccess());
  test('Appointment add fail', () => addAddressFail());
});
