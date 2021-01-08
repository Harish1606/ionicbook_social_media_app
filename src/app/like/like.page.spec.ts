import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LikePage } from './like.page';

describe('LikePage', () => {
  let component: LikePage;
  let fixture: ComponentFixture<LikePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LikePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
