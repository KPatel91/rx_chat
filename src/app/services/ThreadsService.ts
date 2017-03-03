import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { Thread } from '../models/thread';
import { Message } from '../models/message';
import { MessagesService } from './MessagesService';
import * as _ from 'underscore';

@Injectable()
export class ThreadsService {

    //threads is an observable that contains the most up to date list of threads
    threads: Observable<{ [key: string]: Thread }>;

    //orderedThreads contains a newest-first chronological list of threads
    orderedThreads: Observable<Thread[]>;

    //currentThread contains the currently selected thread
    currentThread: Subject<Thread> =
    new BehaviorSubject<Thread>(new Thread());

    //currentThreadMessages contains set of messages for currently selected thread
    currentThreadMessages: Observable<Message[]>;

    constructor(public messagesService: MessagesService) {
        this.threads = messagesService.messages
            .map((messages: Message[]) => {
                let threads: { [key: string]: Thread } = {};

                //store messages thread in our accumulator 'threads'
                messages.map((message: Message) => {
                    threads[message.thread.id] = threads[message.thread.id] || message.thread;

                    // cache most recent message for each thread
                    let messagesThread: Thread = threads[message.thread.id];
                    if (!messagesThread.lastMessage ||
                        messagesThread.lastMessage.sentAt < message.sentAt) {
                        messagesThread.lastMessage = message;
                    }
                });
                return threads;
            });

        this.orderedThreads = this.threads
            .map((threadGroups: { [key: string]: Thread }) => {
                let threads: Thread[] = _.values(threadGroups);
                return _.sortBy(threads, (t: Thread) => t.lastMessage.sentAt).reverse();
            });

        this.currentThreadMessages = this.currentThread
            .combineLatest(messagesService.messages,
            (currentThread: Thread, messages: Message[]) => {
                if (currentThread && messages.length > 0) {
                    return _.chain(messages)
                        .filter((message: Message) =>
                            (message.thread.id === currentThread.id))
                        .map((message: Message) => {
                            message.isRead = true;
                            return message;
                        })
                        .value();

                } else {
                    return [];
                }
            });

        this.currentThread.subscribe(this.messagesService.markThreadAsRead);
    }

    setCurrentThread(newThread: Thread): void{
        this.currentThread.next(newThread);
    }
}

export var threadsServiceInjectables: Array<any> = [
    ThreadsService
];