import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CanaisPage } from './canais.page';

describe('CanaisPage', () => {
  let component: CanaisPage;
  let fixture: ComponentFixture<CanaisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanaisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CanaisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
