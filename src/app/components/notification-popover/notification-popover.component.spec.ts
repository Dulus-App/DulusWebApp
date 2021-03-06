import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotificationPopoverComponent } from './notification-popover.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";

describe('NotificationPopoverComponent', () => {
  let component: NotificationPopoverComponent;
  let fixture: ComponentFixture<NotificationPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationPopoverComponent ],
      imports: [
        IonicModule.forRoot(),
        BrowserModule,
        CommonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
