import { Component } from '@angular/core';
import { MessagesService, ThreadsService, UserService } from './services/services';
import { ChatExampleData } from './ChatExampleData';

@Component({
  selector: 'chat-app',
  template: `
  <div>
    <chat-nav-bar></chat-nav-bar>
    <div class="container">
      <chat-threads></chat-threads>
      <chat-window></chat-window>
    </div>
  </div>
  `
})
export class ChatApp {
  constructor(public messagesService: MessagesService,
    public threadsService: ThreadsService,
    public userService: UserService) {
    ChatExampleData.init(messagesService, threadsService, userService);
  }
}
