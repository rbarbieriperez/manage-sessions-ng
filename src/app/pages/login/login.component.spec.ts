import {LoginComponent} from "./login.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {CommunicationService} from "../../services/communication.service";
import {FirestoreLoginService} from "../../services/firestore-login.service";
import {AppDataService} from "../../services/app-data.service";
import {ErrorHandlerService} from "../../services/error-handler.service";
import {FirestoreQueriesService} from "../../services/firestore-queries.service";
import {importProvidersFrom} from "@angular/core";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../../../environments/environment";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {getStorage, provideStorage} from "@angular/fire/storage";
import {getFunctions, provideFunctions} from "@angular/fire/functions";


const _gmailClick = () => {
  const button: HTMLElement | null = document.getElementById('login-with-google');

  if (button) {
    button.dispatchEvent(new Event('click'));
  } else {
    fail('Button element with id login-with-google not found.');
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let communicationService: CommunicationService;
  let loginService: FirestoreLoginService;
  let appDataService: AppDataService;
  let errorHandlerService: ErrorHandlerService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        CommunicationService,
        AppDataService,
        FirestoreQueriesService,
        FirestoreLoginService,
        ErrorHandlerService,
        importProvidersFrom([
          provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
          provideFirestore(() => getFirestore()),
          provideAuth(() => getAuth()),
          provideStorage(() => getStorage()),
          provideFunctions(() => getFunctions()),
        ]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    communicationService = TestBed.inject(CommunicationService);
    loginService = TestBed.inject(FirestoreLoginService);
    appDataService = TestBed.inject(AppDataService);
    errorHandlerService = TestBed.inject(ErrorHandlerService);

    spyOn(errorHandlerService, 'handleError').and.callFake(() => {});
  }));

  describe('Login with gmail', () => {

    beforeEach(() => {
      appDataService.clearLocalStorage();
    });

    it('should open spinner when clicking on the login with gmail button', done => {
      const openSpinnerSpy = spyOn(communicationService, 'openSpinner');
      fixture.detectChanges();
      _gmailClick();
      expect(openSpinnerSpy).toHaveBeenCalled();
      done();
    });

    it('should call the gmailAuth method', done => {
      const gmailAuthSpy = spyOn(loginService, 'gmailAuth').and.returnValue(Promise.resolve(false));
      fixture.detectChanges();
      _gmailClick();
      expect(gmailAuthSpy).toHaveBeenCalled();
      done();
    });

    it('should call the setUserId method from appDataService service', done => {
      loginService.gmailAuth = jasmine.createSpy().and.returnValue({
        user: {
          displayName: 'name',
          email: 'example@example.com',
        }
      } as any);
      const setUserIdSpy = spyOn(appDataService, 'setUserId');
      _gmailClick();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(setUserIdSpy).toHaveBeenCalledWith('example@example.com');
          done();
        })
    });
  });

  it('should call the setUserName method from appDataService service', done => {
    loginService.gmailAuth = jasmine.createSpy().and.returnValue({
      user: {
        displayName: 'name',
        email: 'example@example.com',
      }
    } as any);
    const setUserNameSpy = spyOn(appDataService, 'setUserName');
    _gmailClick();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        expect(setUserNameSpy).toHaveBeenCalledWith('name');
        done();
      })
  });

  it('should call the emitLoginSuccess function from communication service', done => {
    loginService.gmailAuth = jasmine.createSpy().and.returnValue({
      user: {
        displayName: 'name',
        email: 'example@example.com',
      }
    } as any);
    const emitLoginSuccessSpy = spyOn(communicationService, 'emitLoginSuccess');
    _gmailClick();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        expect(emitLoginSuccessSpy).toHaveBeenCalled();
        done();
      });
  });

  it('handleError method from error handle service should be called if no response from gmail auth', done => {
    loginService.gmailAuth = jasmine.createSpy().and.returnValue(Promise.resolve(false));
    errorHandlerService.handleError = jasmine.createSpy().and.returnValue(null);
    _gmailClick();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        expect(errorHandlerService.handleError).toHaveBeenCalledWith('close-session');
        done();
      });
  });
});
