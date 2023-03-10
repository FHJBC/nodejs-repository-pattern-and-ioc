import { IAttachmentOptions } from '../templates/template.interface';

export interface MailToSendDTO {
  to: string; // Change to your recipient
  from: string; // Change to your verified sender
  subject: string;
  text: string;
  html: string;
}

export interface MailContentToSendDTO {
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
