import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../models/message';
import { User } from '../../models/user';
import { UserService } from '../../services/services';

@Component({
  selector: 'chat-message',
  templateUrl: './chat-message.component.html'
})
export class ChatMessageComponent implements OnInit {
  @Input() message: Message;
  currentUser: User;
  incoming: Boolean;

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser
      .subscribe(
      (user: User) => {
        this.currentUser = user;
        if (this.message.author && user) {
          this.incoming = this.message.author.id !== user.id;
        }
      });
  }
}
