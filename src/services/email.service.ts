// import { MailToSendDTO } from './../dto/mailToSend.dto';
import { inject, injectable } from 'inversify';
import { EmailEventStatusEnum, ICheckIntegrationResponse, IEmailEventBody, IEmailOptions, IEmailService, ISendMessageSuccessResponse } from './service.interface';

import { MailDataRequired, MailService } from '@sendgrid/mail';
import { ChannelTypeEnum } from '../templates/template.interface';
import { TYPES } from '../types';
import { CheckIntegrationResponseEnum } from './service.enum';


const mapResponse = (statusCode: number) => {
  switch (statusCode) {
    case 400:
    case 401:
      return CheckIntegrationResponseEnum.BAD_CREDENTIALS;
    case 403:
      return CheckIntegrationResponseEnum.INVALID_EMAIL;
    default:
      return CheckIntegrationResponseEnum.FAILED;
  }
};

@injectable()
export class SendgridEmailService implements IEmailService {
  id = 'sendgrid';

  channelType = ChannelTypeEnum.EMAIL as ChannelTypeEnum.EMAIL;

  @inject(TYPES.MailService)
  private sendgridMail: MailService;

  constructor(
    private config: {
      apiKey: string;
      from: string;
      senderName: string;
      ipPoolName?: string;
    } ) {
    // this.sendgridMail = new MailService();
    this.sendgridMail.setApiKey(this.config.apiKey);
  }

  async sendMessage( options: IEmailOptions ): Promise<ISendMessageSuccessResponse> {
    const mailData = this.createMailData(options);
    const response = await this.sendgridMail.send(mailData);

    return {
      id: options.id || response[0]?.headers['x-message-id'],
      date: response[0]?.headers?.date,
    };
  }

  async checkIntegration( options: IEmailOptions ): Promise<ICheckIntegrationResponse> {
    try {
      const mailData = this.createMailData(options);

      const response = await this.sendgridMail.send(mailData);

      if (response[0]?.statusCode === 202) {
        return {
          success: true,
          message: 'Integration Successful',
          code: CheckIntegrationResponseEnum.SUCCESS,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error?.response?.body?.errors[0]?.message,
        code: mapResponse(error?.code),
      };
    }
  }

  private createMailData(options: IEmailOptions) {
    const mailData: Partial<MailDataRequired> = {
      from: {
        email: options.from || this.config.from,
        name: this.config.senderName,
      },
      ipPoolName: this.config.ipPoolName,
      to: options.to.map((email) => ({ email })),
      cc: options.cc?.map((ccItem) => ({ email: ccItem })),
      bcc: options.bcc?.map((ccItem) => ({ email: ccItem })),
      html: options.html,
      subject: options.subject,
      substitutions: {},
      customArgs: {
        id: options.id,
      },
      attachments: options.attachments?.map((attachment) => {
        return {
          content: attachment.file.toString('base64'),
          filename: attachment.name,
          type: attachment.mime,
        };
      }),
    };

    if (options.replyTo) {
      mailData.replyTo = options.replyTo;
    }

    return mailData as MailDataRequired;
  }

  getMessageId(body: any | any[]): string[] {
    if (Array.isArray(body)) {
      return body.map((item) => item.id);
    }

    return [body.id];
  }

  parseEventBody( body: any | any[], identifier: string ): IEmailEventBody | undefined {
    if (Array.isArray(body)) {
      body = body.find((item) => item.id === identifier);
    }

    if (!body) {
      return undefined;
    }

    const status = this.getStatus(body.event);

    if (status === undefined) {
      return undefined;
    }

    return {
      status: status,
      date: new Date().toISOString(),
      externalId: body.id,
      attempts: body.attempt ? parseInt(body.attempt, 10) : 1,
      response: body.response ? body.response : '',
      row: body,
    };
  }

  private getStatus(event: string): EmailEventStatusEnum | undefined {
    switch (event) {
      case 'open':
        return EmailEventStatusEnum.OPENED;
      case 'bounce':
        return EmailEventStatusEnum.BOUNCED;
      case 'click':
        return EmailEventStatusEnum.CLICKED;
      case 'dropped':
        return EmailEventStatusEnum.DROPPED;
      case 'delivered':
        return EmailEventStatusEnum.DELIVERED;
    }
  }
}

