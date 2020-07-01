import { Component, OnInit } from '@angular/core';

export class notify {
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-notification-popover',
  templateUrl: './notification-popover.component.html',
  styleUrls: ['./notification-popover.component.scss'],
})
export class NotificationPopoverComponent implements OnInit {

  public notifications;

  constructor() { }

  ngOnInit() {
    
    this.notifications = {
      title: "titulo 1",
      subtitle: "subtitle 1",
    },
    {
      title: "titulo 2",
      subtitle: "subtitle 2",
    }

    console.log(this.notifications);
  }
  
}
