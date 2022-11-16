import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr'; // import signalR
import { Message } from '../Models/Message';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private connection: any = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7031/chatHub') // mapping to the chathub as in startup.cs
    .configureLogging(signalR.LogLevel.Information)
    .build();
  //   readonly POST_URL = 'https://localhost:7031/api/chat/send';

  private receivedMessage: Message = new Message();
  private sharedObj = new Subject<Message>();

  constructor() {
    this.connection.onclose(async () => {
      await this.start();
    });
    this.connection.on('ReceiveMessage', (user: string, message: string) => {
      this.mapReceivedMessage(user, message);
    });
    this.start();
  }

  // Strart the connection
  public async start() {
    try {
      await this.connection.start();
      console.log('connected');
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  }

  private mapReceivedMessage(user: string, message: string): void {
    this.receivedMessage.User = user;
    this.receivedMessage.MsgText = message;
    this.sharedObj.next(this.receivedMessage);
  }

  public broadcastMessage(msg: any) {
    // method 1: with http request
    // this.http.post(this.POST_URL, msg).subscribe((data) => console.log(data));

    // method 2: with signalr directly
    this.connection
      .invoke('SendMessage', msg)
      .catch((err: any) => console.error(err));
  }

  public retrieveMappedObject(): Observable<Message> {
    return this.sharedObj.asObservable();
  }
}
