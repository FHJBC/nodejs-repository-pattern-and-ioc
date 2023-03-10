import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { inject, injectable } from 'inversify';
import { MailContentToSendDTO } from '../dto/mailToSend.dto';
import { TYPES } from '../types';

@injectable()
export default class EmailNotificationController {

  @inject(TYPES.MailService) private sgMailService;

  /**
   * Send email notification
   *
   * @requires to An array of email addresses
   * @requires subject A subject string
   * @requires html A template string
   **/
  public async notify(req: ExpressRequest, res: ExpressResponse) {

    // if (!req.body.email) {
    //   throw new MissingFieldError('email');
    // }

    // if (!req.body.username) {
    //   throw new MissingFieldError('username');
    // }

    // if (!isEmail(req.body.email)) {
    //   throw new BadRequestError(StaticStringKeys.INVALID_EMAIL);
    // }

    // if (!isLength(req.body.password.trim(), { min: 4, max: 20 })) {
    //   throw new BadRequestError(StaticStringKeys.INVALID_PASSWORD);
    // }

    const { to, subject, html } = req.body;

    const mailOptions: MailContentToSendDTO = {
      to,
      subject,
      html,
    };

    await this.sgMailService.sendMessage(mailOptions);

    res.sendStatus(201);
  }
}
