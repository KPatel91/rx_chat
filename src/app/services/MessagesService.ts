import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { User } from '../models/user';
import { Thread } from '../models/thread';
import { Message } from '../models/message';

let initialMessages: Message[] = [];

interface IMessagesOperation extends Function {
    (messages: Message[]): Message[];
}

@Injectable()
export class MessagesService {
    // a stream that only publishes new messages once
    newMessages = new Subject<Message>();

    //messages is a stream that emits an array of most up to date messages
    messages: Observable<Message[]>;

    //updates receives operations to be applied to our messages
    // we can perform changes on ALL messages
    updates = new Subject<any>();

    //action streams
    create = new Subject<Message>();
    markThreadAsRead = new Subject<any>();

    constructor() {
        this.messages = this.updates // watch updates and accumulate operations
            .scan(
            (messages: Message[], operation: IMessagesOperation) => operation(messages),
            initialMessages) // make sure we can share most recent list of messages across anyone
            .publishReplay(1) // who is interested in subscribing and cache last known list of messages
            .refCount();

        /*  'Create' takes a Message and puts an operation (inner function) on the updates
            stream to add Message to list of messages.

            That is, for each item that gets added to create (by using 'next') this stream
            emits a concat operation function.

            Next we subscribe 'this.updates' to listen to this stream, which means that it will
            receive each operation that is created.

            Note that it would be acceptable to simply modify the addMessage function below
            to simply add inner operation function to the update stream directly and get rid of this 
            extra action stream entirely. The pros are that it is potentially clearer. Cons are that
            stream is no longer composable.
        */
        this.create
            .map(function (message: Message): IMessagesOperation {
                return (messages: Message[]) => {
                    return messages.concat(message);
                };
            })
            .subscribe(this.updates);

        this.newMessages
            .subscribe(this.create);

        // markThreadAsRead takes a thread and then puts an operation on the updates stream
        // to mark messages as read.
        this.markThreadAsRead
            .map((thread: Thread) => {
                return (messages: Message[]) => {
                    return messages.map((message: Message) => {
                        // note we're manipulating 'message' directly
                        // would be better if this was immutable
                        if (message.thread.id === thread.id) {
                            message.isRead = true;
                        }
                        return message;
                    });
                };
            })
            .subscribe(this.updates);
    }

    // an imperative function call to this action stream
    addMessage(message: Message): void {
        this.newMessages.next(message);
    }

    messagesForThreadUser(thread: Thread, user: User): Observable<Message>{
        return this.newMessages
            .filter((message: Message) => {
                // belongs to this thread
                return (message.thread.id === thread.id) &&
                // and isn't authored by this user
                (message.author.id !== user.id);
            });
    }
}

export var messageServiceInjectables : Array<any> = [
    MessagesService
];