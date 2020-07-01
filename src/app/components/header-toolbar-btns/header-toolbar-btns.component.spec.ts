import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HeaderToolbarBtnsComponent } from './header-toolbar-btns.component';

describe('HeaderToolbarBtnsComponent', () => {
  let component: HeaderToolbarBtnsComponent;
  let fixture: ComponentFixture<HeaderToolbarBtnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderToolbarBtnsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderToolbarBtnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
