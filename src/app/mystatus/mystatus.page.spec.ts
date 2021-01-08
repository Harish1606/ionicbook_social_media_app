import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MystatusPage } from './mystatus.page';

describe('MystatusPage', () => {
  let component: MystatusPage;
  let fixture: ComponentFixture<MystatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MystatusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MystatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
