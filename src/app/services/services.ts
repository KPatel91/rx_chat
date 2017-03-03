import {messageServiceInjectables} from './MessagesService';
import {threadsServiceInjectables} from './ThreadsService';
import {userServiceInjectables} from './UserService';

export * from './MessagesService';
export * from './ThreadsService';
export * from './UserService';

export var servicesInjectables: Array<any> = [
    messageServiceInjectables,
    threadsServiceInjectables,
    userServiceInjectables
];