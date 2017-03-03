import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ThreadsService } from '../../services/services';

@Component({
  selector: 'chat-threads',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="row">
    <div class="conversation-wrap">

      <chat-thread *ngFor="let thread of threads | async" [thread]="thread">
      </chat-thread>
    </div>

  </div>
  `
})
export class ChatThreadsComponent {
  threads: Observable<any>;
  constructor(public threadsService: ThreadsService) {
    this.threads = threadsService.orderedThreads;
  }
}
