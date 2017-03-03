import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { pipesInjectables } from './pipes/pipes';
import { servicesInjectables } from './services/services';
import { ChatApp } from './app.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatThreadsComponent } from './components/chat-threads/chat-threads.component';
import { ChatNavBarComponent } from './components/chat-nav-bar/chat-nav-bar.component';
import { ChatThreadComponent } from './components/chat-thread/chat-thread.component';

@NgModule({
  declarations: [
    ChatApp,
    pipesInjectables,
    ChatWindowComponent,
    ChatMessageComponent,
    ChatThreadsComponent,
    ChatNavBarComponent,
    ChatThreadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [servicesInjectables],
  bootstrap: [ChatApp]
})
export class ChatAppModule { }


