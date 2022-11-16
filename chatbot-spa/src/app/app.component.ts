import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Message } from 'src/app/Models/Message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService
      .retrieveMappedObject()
      .subscribe((receivedObj: Message) => {
        this.addToInbox(receivedObj);
      });
  }

  message: Message = new Message();
  msgInboxArray: Message[] = [];

  send(): void {
    if (this.message) {
      if (this.message.User.length == 0 || this.message.User.length == 0) {
        window.alert('Both fields are required.');
        return;
      } else {
        this.chatService.broadcastMessage(this.message);
      }
    }
  }

  addToInbox(obj: Message) {
    let newObj = new Message();
    newObj.User = obj.User;
    newObj.MsgText = obj.MsgText;
    this.msgInboxArray.push(newObj);
  }
}
