import { Response, Request, NextFunction } from 'express';
import Boom from '@hapi/boom';
import Appointment from '../models/AppointmentModel';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  ControllerMiddleware,
  Middleware,
} from '../types/decorators';
import { BaseController } from '../types/BaseController';
import joiValidation from '../middlewares/joiValidation';
import appointmentSchema from '../schemas/appointments.schema';


@Controller('appointments')
@ControllerMiddleware([
  async function loadAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    if (id) {
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        throw Boom.notFound('Appointment not found');
      }
      req.setLocal('appointment', appointment);
    }
    next();
  },
])
export default class AppointmentsController extends BaseController {
  /**
   * @api {get} /appointments
   * @name getAppointments
   * @description get all appointments
   * @param req
   * @param res
   */
  @Get()
  private async index(req: Request, res: Response): Promise<Response> {
    const appointments = await Appointment.find();
    return res.json(appointments);
  }


  /**
   * @api {get} /appointments/:id
   * @name show
   * @description show details of appointment
   * @param req
   * @param res
   */
  @Get(':id')
  private async show(req: Request, res: Response): Promise<Response> {
    const { appointment } = req.locals;
    return res.json(appointment);
  }

  /**
   * @api {post} /appointments
   * @name add
   * @description Add a new appointment
   * @param req
   * @param res
   */
  @Post()
  @Middleware([joiValidation(appointmentSchema.post)])
  private async add(req: Request, res: Response): Promise<Response> {
    const appointment = new Appointment(req.body);
    await appointment.save();
    return res.status(201).json({ message: 'Appointment added', appointment });
  }

  /**
   * @api {patch} /appointments/:id
   * @name edit
   * @description Edit appointment
   * @param req
   * @param res
   */
  @Patch(':id')
  @Middleware([joiValidation(appointmentSchema.patch)])
  private async edit(req: Request, res: Response): Promise<Response> {
    const { appointment } = req.locals;
    Object.entries(req.body).forEach(([key, value]) => appointment.set(key, value));
    await appointment.save();
    return res.json({ message: 'The appointment was updated', appointment});
  }

  /**
   * @api {delete} /appointments/:id
   * @name delete
   * @description An appointment is deleted
   * @param req
   * @param res
   */
  @Delete(':id')
  private async delete(req: Request, res: Response): Promise<Response> {
    const { appointment } = req.locals;
    await appointment.remove();
    return res.json({ message: 'Appointment deleted'});
  }


  /**
  * @api {patch} /appointments/:id
  * @name patch
  * @description Canceled Appointment
  * @param req
  * @param res
  */
  @Patch('cancelled/:id')
  private async cancelled(req: Request, res: Response): Promise<Response> {
    const { appointment } = req.locals;
    appointment.update({
     cancelledAt: new Date().toJSON(),
    });
    await appointment.save();
    return res.json({ message: 'Appointment cancelled', appointment });
  }
}
