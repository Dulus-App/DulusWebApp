import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileNamesPage } from './profile-names.page';

describe('ProfileNamesPage', () => {
  let component: ProfileNamesPage;
  let fixture: ComponentFixture<ProfileNamesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileNamesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileNamesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
