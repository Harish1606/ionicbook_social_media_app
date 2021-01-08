import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProdSearchPage } from './prod-search.page';

describe('ProdSearchPage', () => {
  let component: ProdSearchPage;
  let fixture: ComponentFixture<ProdSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProdSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
