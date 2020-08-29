import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileServicosPage } from './profile-servicos.page';

describe('ProfileServicosPage', () => {
  let component: ProfileServicosPage;
  let fixture: ComponentFixture<ProfileServicosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileServicosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileServicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
