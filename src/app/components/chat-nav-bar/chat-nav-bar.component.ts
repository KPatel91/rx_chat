import { Component, OnInit } from '@angular/core';
import { MessagesService, ThreadsService } from '../../services/services';
import { Message } from '../../models/message';
import { Thread } from '../../models/thread';
import * as _ from 'underscore';

@Component({
  selector: 'chat-nav-bar',
  templateUrl: './chat-nav-bar.component.html'
})
export class ChatNavBarComponent implements OnInit {
  unreadMessagesCount: number;
  constructor(public messagesService: MessagesService,
    public threadsService: ThreadsService) { }

  ngOnInit(): void {
    this.messagesService.messages.combineLatest(
      this.threadsService.currentThread, 
      (messages: Message[], currentThread: Thread) => [currentThread, messages])
      .subscribe(([currentThread, messages]: [Thread, Message[]]) => {
        this.unreadMessagesCount =
          _.reduce(
            messages,
            (sum: number, m: Message) => {
              let messageIsInCurrentThread: boolean = m.thread && currentThread && (currentThread.id === m.thread.id);
              if (m && !m.isRead && !messageIsInCurrentThread) {
                sum = sum + 1;
              }
              return sum;
            },
            0);
      });
  }

}
