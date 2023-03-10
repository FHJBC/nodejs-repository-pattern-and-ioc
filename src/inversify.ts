import { MailService } from '@sendgrid/mail';
import { Container } from 'inversify';
import UserController from './controllers/user.controller';
import UserRepository, { IUserRepository } from './repositories/user.repository';
import { SendgridEmailService } from './services/email.service';
import { IEmailService } from './services/service.interface';
import UserService, { IUserService } from './services/user.service';
import { TYPES } from './types';

const container = new Container({ defaultScope: 'Singleton' });
container.bind(UserController).to(UserController);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);


container.bind(TYPES.MailService).to(MailService);
container.bind<IEmailService>(SendgridEmailService).to(SendgridEmailService);

export default container;
