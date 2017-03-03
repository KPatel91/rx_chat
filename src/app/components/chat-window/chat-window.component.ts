import { Component, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { MessagesService, ThreadsService, UserService } from '../../services/services'
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Thread } from '../../models/thread';
import { Message } from '../../models/message';

@Component({
  selector: 'chat-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-window.component.html'
})
export class ChatWindowComponent implements OnInit {
  messages: Observable<any>;
  currentThread: Thread;
  draftMessage: Message;
  currentUser: User;

  constructor(public messagesService: MessagesService,
    public threadsService: ThreadsService,
    public userService: UserService,
    public el: ElementRef) { }


  ngOnInit(): void {
    this.messages = this.threadsService.currentThreadMessages;
    this.draftMessage = new Message();

    this.threadsService.currentThread.subscribe((thread: Thread) => this.currentThread = thread);

    this.userService.currentUser.subscribe((user: User) => this.currentUser = user)

    this.messages
      .subscribe(
      (messages: Array<Message>) => setTimeout(
        () => this.scrollToBottom()));
  }

  onEnter(event: any): void {
    this.sendMessage();
    event.preventDefault();
  }

  sendMessage(): void {
    let m: Message = this.draftMessage;
    m.author = this.currentUser;
    m.thread = this.currentThread;
    m.isRead = true;
    this.messagesService.addMessage(m);
    this.draftMessage = new Message();
  }

  scrollToBottom(): void {
    let scrollPane: any = this.el.nativeElement.querySelector('.msg-container-base');
    scrollPane.scrollTop = scrollPane.scrollHeight;
  }

}
