import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OtherStatusPage } from './other-status.page';

describe('OtherStatusPage', () => {
  let component: OtherStatusPage;
  let fixture: ComponentFixture<OtherStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherStatusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OtherStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
