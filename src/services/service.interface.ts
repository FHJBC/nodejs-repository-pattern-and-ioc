import {
  ChannelTypeEnum,
  IAttachmentOptions,
} from '../templates/template.interface';
import { CheckIntegrationResponseEnum } from './service.enum';

export interface IService {
  id: string;
  channelType: ChannelTypeEnum;
}

export interface IEmailOptions {
  to: string[];
  subject: string;
  html: string;
  from?: string;
  text?: string;
  attachments?: IAttachmentOptions[];
  id?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

export interface ISmsOptions {
  to: string;
  content: string;
  from?: string;
  attachments?: IAttachmentOptions[];
  id?: string;
}
export interface IPushOptions {
  target: string[];
  title: string;
  content: string;
  payload: object;
  overrides?: {
    type?: 'notification' | 'data';
    data?: { [key: string]: string };
    tag?: string;
    body?: string;
    icon?: string;
    badge?: number;
    color?: string;
    sound?: string;
    title?: string;
    bodyLocKey?: string;
    bodyLocArgs?: string;
    clickAction?: string;
    titleLocKey?: string;
    titleLocArgs?: string;
    ttl?: number;
    expiration?: number;
    priority?: 'default' | 'normal' | 'high';
    subtitle?: string;
    channelId?: string;
    categoryId?: string;
    mutableContent?: boolean;
    android?: { [key: string]: { [key: string]: string } };
    apns?: { payload: { aps: { [key: string]: { [key: string]: string } } } };
  };
}

export interface IChatOptions {
  webhookUrl: string;
  content: string;
}

export interface ISendMessageSuccessResponse {
  id?: string;
  ids?: string[];
  date?: string;
}

export enum EmailEventStatusEnum {
  OPENED = 'opened',
  REJECTED = 'rejected',
  SENT = 'sent',
  DEFERRED = 'deferred',
  DELIVERED = 'delivered',
  BOUNCED = 'bounced',
  DROPPED = 'dropped',
  CLICKED = 'clicked',
  BLOCKED = 'blocked',
  SPAM = 'spam',
  UNSUBSCRIBED = 'unsubscribed',
}

export enum SmsEventStatusEnum {
  CREATED = 'created',
  DELIVERED = 'delivered',
  ACCEPTED = 'accepted',
  QUEUED = 'queued',
  SENDING = 'sending',
  SENT = 'sent',
  FAILED = 'failed',
  UNDELIVERED = 'undelivered',
  REJECTED = 'rejected',
}

export interface IEventBody {
  status: EmailEventStatusEnum | SmsEventStatusEnum;
  date: string;
  externalId?: string;
  attempts?: number;
  response?: string;
  // Contains the raw content from the provider webhook
  row?: string;
}

export interface IEmailEventBody extends IEventBody {
  status: EmailEventStatusEnum;
}

export interface ISMSEventBody extends IEventBody {
  status: SmsEventStatusEnum;
}

export interface IEmailService extends IService {
  channelType: ChannelTypeEnum.EMAIL;

  sendMessage(options: IEmailOptions): Promise<ISendMessageSuccessResponse>;

  getMessageId?: (body: any | any[]) => string[];

  parseEventBody?: (
    body: any | any[],
    identifier: string
  ) => IEmailEventBody | undefined;

  checkIntegration(options: IEmailOptions): Promise<ICheckIntegrationResponse>;
}

export interface ISmsService extends IService {
  sendMessage(options: ISmsOptions): Promise<ISendMessageSuccessResponse>;

  channelType: ChannelTypeEnum.SMS;

  getMessageId?: (body: any) => string[];

  parseEventBody?: (
    body: any | any[],
    identifier: string
  ) => ISMSEventBody | undefined;
}

export interface IChatService extends IService {
  sendMessage(options: IChatOptions): Promise<ISendMessageSuccessResponse>;
  channelType: ChannelTypeEnum.CHAT;
}

export interface IPushService extends IService {
  sendMessage(options: IPushOptions): Promise<ISendMessageSuccessResponse>;

  channelType: ChannelTypeEnum.PUSH;
}

export interface ICheckIntegrationResponse {
  success: boolean;
  message: string;
  code: CheckIntegrationResponseEnum;
}
