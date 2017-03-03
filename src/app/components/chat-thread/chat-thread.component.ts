import { Component, OnInit, Input } from '@angular/core';
import { Thread } from '../../models/thread';
import { Observable } from 'rxjs';
import { ThreadsService } from '../../services/services';

@Component({
  selector: 'chat-thread',
  templateUrl: './chat-thread.component.html'
})
export class ChatThreadComponent implements OnInit {
  @Input() thread: Thread;
  selected: boolean = false;

  constructor(public threadsService: ThreadsService) { }

  ngOnInit() {
    this.threadsService.currentThread
      .subscribe(
      (currentThread: Thread) => {
        this.selected = currentThread && this.thread && (currentThread.id === this.thread.id);
      });
  }

  clicked(event: any): void{
    this.threadsService.setCurrentThread(this.thread);
    event.preventDefault();
  }
}
