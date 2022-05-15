import fs from 'fs';
import chalk from 'chalk';
import { Options } from 'nodemailer/lib/smtp-transport';
import { Attachment } from '../types/Attachment';
import ejsHelper from './ejsLayoutHelper';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_PASS,
  SMTP_USER,
  API_EMAIL_NOREPLY,
  API_UPLOADS_PATH,
  NODE_ENV,
} = process.env;


export interface MailHandlerConfig {
  email: string;
  subject: string;
  dictionary?: { language: { [key: string]: string }; values?: { [key: string]: string } };
  attachments?: Attachment[];
  data?: { [key: string]: unknown };
  test?: boolean;
}

interface AttachmentNodemailer {
  filename: string;
  content: fs.ReadStream;
  contentType: string;
}

class MailHandler {
  public error: Error;
  public status: string;
  private readonly data: { [key: string]: unknown };
  private readonly email: string;
  private readonly from: string;
  private readonly subject: string;
  private readonly attachments?: AttachmentNodemailer[];
  private readonly test: boolean;

  constructor(options: MailHandlerConfig) {
    const { email, subject, attachments = [], test, data = {} } = options;
    this.email = email;
    this.subject = subject;
    this.from = API_EMAIL_NOREPLY;
    this.test = test || NODE_ENV === 'test';
    this.data = data;
    this.attachments = attachments.map(
      (element: Attachment): AttachmentNodemailer => ({
        filename: element.filename,
        content: fs.createReadStream(`${API_UPLOADS_PATH}/${element.tmpDir}/${element.filename}`),
        contentType: element.mimetype,
      }),
    );

    this.status = 'created';
  }

  /**
   * Do the action to send a mail
   * @type type {string}
   * @param allowedTypes {Array}
   * @returns {boolean}
   */
  public async send(templateName: string, options?: { force?: boolean }): Promise<boolean | Error> {
    const { force = true } = options || {};
    const optionsNodeMailer: Options = {
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 2525),
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      debug: false, // show debug output
      logger: false, // log information in console
    };

    const mailOptions = {
      from: this.from,
      to: this.email,
      subject: this.subject,
      attachments: this.attachments,
      html: await ejsHelper(templateName, { ...options, ...this.data }),
    };

    if (this.test) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const { createTransport } = require('nodemailer');

    const SMTPTransport = createTransport(optionsNodeMailer);
    return new Promise((resolve, reject) => {
      SMTPTransport.sendMail(mailOptions, (error: Error | null) => {
        if (error) {
          console.error(chalk.yellow.bgBlack('Error al enviar correo:', error));
          this.error = error;
          this.status = 'failed';
          if (force) {
            return reject(error);
          }
          return resolve(false);
        }
        console.info(chalk.green.bgBlack('Email enviado: ', mailOptions.to));
        this.status = 'sended';
        return resolve(true);
      });
    });
  }
}

export default MailHandler;
