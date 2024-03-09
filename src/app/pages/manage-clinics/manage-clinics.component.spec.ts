import {ManageClinicsComponent} from "./manage-clinics.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {CommunicationService} from "../../services/communication.service";
import {AppDataService} from "../../services/app-data.service";
import {ErrorHandlerService} from "../../services/error-handler.service";
import {FirestoreQueriesService} from "../../services/firestore-queries.service";
import {provideAnimations} from "@angular/platform-browser/animations";
import {importProvidersFrom} from "@angular/core";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../../../environments/environment";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {getStorage, provideStorage} from "@angular/fire/storage";
import {getFunctions, provideFunctions} from "@angular/fire/functions";
import {FirestoreSubscribeService} from "../../services/firestore-subscribe.service";
import {TPatient, TUserData} from "../../types/types";
const userData = require('../../mocks/userData.json');

describe('ManageClinicsComponent', () => {
  let component: ManageClinicsComponent;
  let fixture: ComponentFixture<ManageClinicsComponent>;
  let communicationService: CommunicationService;
  let appDataService: AppDataService;
  let errorHandlerService: ErrorHandlerService;
  let firestoreQueriesService: FirestoreQueriesService;
  let firestoreSubscribeService: FirestoreSubscribeService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ ManageClinicsComponent ],
      providers: [
        CommunicationService,
        AppDataService,
        FirestoreQueriesService,
        ErrorHandlerService,
        provideAnimations(),
        importProvidersFrom([
          provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
          provideFirestore(() => getFirestore()),
          provideAuth(() => getAuth()),
          provideStorage(() => getStorage()),
          provideFunctions(() => getFunctions()),
        ])
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageClinicsComponent);
    component = fixture.componentInstance;

    communicationService = TestBed.inject(CommunicationService);
    appDataService = TestBed.inject(AppDataService);
    errorHandlerService = TestBed.inject(ErrorHandlerService);
    firestoreQueriesService = TestBed.inject(FirestoreQueriesService);
    firestoreSubscribeService = TestBed.inject(FirestoreSubscribeService);

    appDataService.clearLocalStorage();
    communicationService.emitNewUserData(userData);
  }));


  describe('Manage clinics - basic functionality', () => {

    it('On component mount store should be subscribed', done => {
      appDataService.setUserId('1235');
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          communicationService.subscribeUserData$
            .subscribe(data => {
              expect(data).toEqual(userData);
              done();
            })
        });
    });
  });

  describe('Add clinic - basic functionality', () => {

    it('Clinic name can be changed and button will be enabled', done => {
      const button = document.getElementById('submitButton');
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.addClinicCustomComponent?.nameInput?.onChange.emit('asdf');
          fixture.detectChanges();
          expect(button?.getAttribute('disabled')).not.toEqual("true");
          done();
        });
    });

    it('If clinic name is empty submit button will remain disabled', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.addClinicCustomComponent?.addressInput?.onChange.emit('address');
          component.addClinicCustomComponent?.numberInput?.onChange.emit('1234');
          component.addClinicCustomComponent?.additionalInfoInput?.onChange.emit('additional info');
          component.addClinicCustomComponent?.emailInput?.onChange.emit('a@a.com');
          component.addClinicCustomComponent?.mobilePhoneInput?.onChange.emit('52452345');
          component.addClinicCustomComponent?.phoneInput?.onChange.emit('324234324');
          component.addClinicCustomComponent?.websiteInput?.onChange.emit('wwww.a.com');
          fixture.detectChanges();
          expect(component.addClinicCustomComponent?.submitButtonDisabled).toEqual(true);
          done();
        });
    });

    it('Clicking on submit button should open spinner', done => {
      communicationService.openSpinner = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve(true));
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.addClinicCustomComponent?.nameInput?.onChange.emit('aadsf');
          fixture.detectChanges();
          document.getElementById('submitButton')?.click();
          expect(communicationService.openSpinner).toHaveBeenCalled();
          done();
        });
    });

    it('If clinic was submitted correctly spinner should be closed', done => {
      communicationService.closeSpinner = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve(true));
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.addClinicCustomComponent?.nameInput?.onChange.emit('aadsf');
          fixture.detectChanges();
          document.getElementById('submitButton')?.click();
          setTimeout(() => {
            expect(communicationService.closeSpinner).toHaveBeenCalled();
            done();
          })
        });
    });

    it('If clinic was submitted correctly alert should be opened', done => {
      communicationService.emitAlertData = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve(true));
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.addClinicCustomComponent?.nameInput?.onChange.emit('aadsf');
          fixture.detectChanges();
          document.getElementById('submitButton')?.click();
          setTimeout(() => {
            expect(communicationService.emitAlertData).toHaveBeenCalledWith({
              id: '',
              type: 'success',
              message: '¡Clínica agregada con éxito!',
              clearTimeMs: 3000
            });
            done();
          });
        });
    });

    it('If there was an error while submitting new clinic spinner should be closed', done => {
      communicationService.closeSpinner = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.reject());
      errorHandlerService.validateError = jasmine.createSpy().and.callFake(() => {});
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.addClinicCustomComponent?.nameInput?.onChange.emit('aadsf');
          fixture.detectChanges();
          document.getElementById('submitButton')?.click();
          setTimeout(() => {
            expect(communicationService.closeSpinner).toHaveBeenCalled();
            done();
          })
        });
    });

    it('If there was an error while submitting new clinic error alert should be shown', done => {
      communicationService.emitAlertData = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.reject());
      errorHandlerService.validateError = jasmine.createSpy().and.callFake(() => {});
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.addClinicCustomComponent?.nameInput?.onChange.emit('aadsf');
          fixture.detectChanges();
          document.getElementById('submitButton')?.click();
          setTimeout(() => {
            expect(communicationService.emitAlertData).toHaveBeenCalledWith({
              id: '',
              type: 'danger',
              message: 'Ha ocurrido un error al agregar la clínica',
              clearTimeMs: 3000
            });
            done();
          });
        });
    });

    it('If there was an error while submitting new clinic validateError from error handler service should be called', done => {
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.reject());
      errorHandlerService.validateError = jasmine.createSpy().and.callFake(() => {});
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.addClinicCustomComponent?.nameInput?.onChange.emit('aadsf');
          fixture.detectChanges();
          document.getElementById('submitButton')?.click();
          setTimeout(() => {
            expect(errorHandlerService.validateError).toHaveBeenCalled();
            done();
          });
        });
    });

    it('After submitting new clinic elements should be cleared', done => {
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve());
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          if (component.addClinicCustomComponent) {
            component.addClinicCustomComponent.clearValues = jasmine.createSpy();
          }
          component.addClinicCustomComponent?.nameInput?.onChange.emit('aadsf');
          fixture.detectChanges();
          document.getElementById('submitButton')?.click();
          setTimeout(() => {
            expect(component.addClinicCustomComponent?.clearValues).toHaveBeenCalled();
            done();
          });
        });
    });

    it('If there are no clinics, new clinic id should be 1', done => {
      communicationService.emitNewUserData({
        ...userData,
        clinics: []
      });

      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve());

      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.addClinicCustomComponent?.nameInput?.onChange.emit('asdf');
          fixture.detectChanges();
          document.getElementById('submitButton')?.click();
          setTimeout(() => {
            expect(firestoreQueriesService.saveData).toHaveBeenCalledWith('',{
              ...userData,
              clinics: [{
                "address": {
                  "number": "",
                  "additionalInfo": "",
                  "fullAddress": ""
                },
                "contactDetails": {
                  "emailAddress": '',
                  "website": '',
                  "phoneNumber": '',
                  "mobilePhoneNumber": ''
                },
                "clinicId": 1,
                "clinicName": "asdf"
              }]
            })
            done();
          })
        })
    });
  });

  describe('Update clinic - basic functionality', () => {
    it('Selecting a clinic on the search input should show update button', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          fixture.detectChanges();
          expect(document.getElementById('updateButton')).not.toEqual(null);
          done();
        });
    });

    it('When selecting a clinic update button should start disabled', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          fixture.detectChanges();
          expect(document.getElementById('updateButton')?.getAttribute('disabled')).toEqual('true');
          done();
        });
    });

    it('Updating any value should enable update button', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          component.addClinicCustomComponent?.nameInput?.onChange.emit('asdfasdf');
          expect(document.getElementById('updateButton')?.getAttribute('disabled')).not.toEqual('true');
          done();
        });
    });

    it('Updating any value and returning it to its original value should disabled update button', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          fixture.detectChanges();
          component.addClinicCustomComponent?.nameInput?.onChange.emit('asdfasdf');
          fixture.detectChanges();
          component.addClinicCustomComponent?.nameInput?.onChange.emit('asadf');
          fixture.detectChanges();
          expect(document.getElementById('updateButton')?.getAttribute('disabled')).toEqual('true');
          done();
        })
    });

    it('Clicking on update clinic should open dialog with specific configuration', done => {
      communicationService.emitDialogData = jasmine.createSpy();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          component.addClinicCustomComponent?.nameInput?.onChange.emit('asdfasdf');
          fixture.detectChanges();
          document.getElementById('updateButton')?.click();
          expect(communicationService.emitDialogData).toHaveBeenCalledWith({
            title: 'Confirmar operación',
            content: 'Modificar clínica',
            size: 'sm',
            primaryButtonLabel: 'Confirmar',
            secondaryButtonLabel: 'Cancelar',
            primaryButtonEvent: 'confirm-operation',
            secondaryButtonEvent: 'reject-operation'
          });
          done();
        });
    });

    it('Accepting dialog should open spinner', done => {
      communicationService.openSpinner = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve());
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          component.addClinicCustomComponent?.nameInput?.onChange.emit('asdfasdf');
          fixture.detectChanges();
          document.getElementById('updateButton')?.click();
          communicationService.emitDialogCallbackEvent('confirm-operation');
          expect(communicationService.openSpinner).toHaveBeenCalled();
          done();
        });
    });

    it('If clinic update was successful spinner should be closed', done => {
      communicationService.closeSpinner = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve());
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          component.addClinicCustomComponent?.nameInput?.onChange.emit('asdfasdf');
          fixture.detectChanges();
          document.getElementById('updateButton')?.click();
          communicationService.emitDialogCallbackEvent('confirm-operation');
          setTimeout(() => {
            expect(communicationService.closeSpinner).toHaveBeenCalled();
            done();
          })
        });
    });

    it('If clinic update was successful alert should be opened', done => {
      communicationService.emitAlertData = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve());
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          component.addClinicCustomComponent?.nameInput?.onChange.emit('asdfasdf');
          fixture.detectChanges();
          document.getElementById('updateButton')?.click();
          communicationService.emitDialogCallbackEvent('confirm-operation');
          setTimeout(() => {
            expect(communicationService.emitAlertData).toHaveBeenCalledWith({
              id: '',
              type: 'success',
              message: '¡Clínica modificada con éxito!',
              clearTimeMs: 3000
            });
            done();
          })
        });
    });

    it('If clinic update was not successful spinner should be closed', done => {
      communicationService.closeSpinner = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.reject());
      errorHandlerService.validateError = jasmine.createSpy().and.callFake(() => {});
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          component.addClinicCustomComponent?.nameInput?.onChange.emit('asdfasdf');
          fixture.detectChanges();
          document.getElementById('updateButton')?.click();
          communicationService.emitDialogCallbackEvent('confirm-operation');
          setTimeout(() => {
            expect(communicationService.closeSpinner).toHaveBeenCalled();
            done();
          })
        });
    });

    it('If clinic update was not successful error alert should be opened', done => {
      communicationService.emitAlertData = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.reject());
      errorHandlerService.validateError = jasmine.createSpy().and.callFake(() => {});
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          component.addClinicCustomComponent?.nameInput?.onChange.emit('asdfasdf');
          fixture.detectChanges();
          document.getElementById('updateButton')?.click();
          communicationService.emitDialogCallbackEvent('confirm-operation');
          setTimeout(() => {
            expect(communicationService.emitAlertData).toHaveBeenCalledWith({
              id: '',
              type: 'danger',
              message: 'Ha ocurrido un error al modificar la clínica',
              clearTimeMs: 3000
            });
            done();
          })
        });
    });

    it('If clinic update was not successful validateError method should be called', done => {
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.reject());
      errorHandlerService.validateError = jasmine.createSpy().and.callFake(() => {});
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          component.addClinicCustomComponent?.nameInput?.onChange.emit('asdfasdf');
          fixture.detectChanges();
          document.getElementById('updateButton')?.click();
          communicationService.emitDialogCallbackEvent('confirm-operation');
          setTimeout(() => {
            expect(errorHandlerService.validateError).toHaveBeenCalled();
            done();
          })
        });
    });

    it('After updating a clinic elements should be cleared', done => {
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve());
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          if (component.addClinicCustomComponent) {
            component.addClinicCustomComponent.clearValues = jasmine.createSpy();
          }
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          component.addClinicCustomComponent?.nameInput?.onChange.emit('aadsf');
          fixture.detectChanges();
          document.getElementById('updateButton')?.click();
          communicationService.emitDialogCallbackEvent('confirm-operation');
          setTimeout(() => {
            expect(component.addClinicCustomComponent?.clearValues).toHaveBeenCalled();
            done();
          });
        });
    });
  });

  describe('Delete clinic - basic functionality', () => {
    it('Selecting a clinic on the search input should show delete button', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          fixture.detectChanges();
          expect(document.getElementById('deleteButton')).not.toEqual(null);
          done();
        });
    });

    it('Delete button should always be enabled', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          fixture.detectChanges();
          expect(document.getElementById('deleteButton')?.getAttribute('disabled')).not.toEqual('true');
          done();
        });
    });

    it('Clicking at delete button should open confirm dialog', done => {
      communicationService.emitDialogData = jasmine.createSpy();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          fixture.detectChanges();
          document.getElementById('deleteButton')?.click();
          expect(communicationService.emitDialogData).toHaveBeenCalledWith({
            title: 'Confirmar eliminación',
            content: 'Si eliminas la clínica también se eliminaran los pacientes registrados con sus respectivas sesiones.',
            size: 'sm',
            primaryButtonLabel: 'Confirmar',
            secondaryButtonLabel: 'Cancelar',
            primaryButtonEvent: 'confirm-deletion',
            secondaryButtonEvent: 'reject-deletion'
          });
          done();
        });
    });

    it('Before deleting clinic spinner should be opened', done => {
      communicationService.openSpinner = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve());
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          fixture.detectChanges();
          document.getElementById('deleteButton')?.click();
          communicationService.emitDialogCallbackEvent('confirm-deletion');
          expect(communicationService.openSpinner).toHaveBeenCalled();
          done();
        });
    });

    it('If deletion was successful spinner should be closed', done => {
      communicationService.closeSpinner = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve());
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          fixture.detectChanges();
          document.getElementById('deleteButton')?.click();
          communicationService.emitDialogCallbackEvent('confirm-deletion');
          setTimeout(() => {
            expect(communicationService.closeSpinner).toHaveBeenCalled();
            done();
          });
        });
    });

    it('If deletion was successful alert should be opened', done => {
      communicationService.emitAlertData = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve());
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          fixture.detectChanges();
          document.getElementById('deleteButton')?.click();
          communicationService.emitDialogCallbackEvent('confirm-deletion');
          setTimeout(() => {
            expect(communicationService.emitAlertData).toHaveBeenCalledWith({
              id: '',
              type: 'success',
              message: '¡Clínica eliminada con éxito!',
              clearTimeMs: 3000
            });
            done();
          });
        });
    });

    it('If deletion was not successful spinner should be closed', done => {
      communicationService.closeSpinner = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.reject());
      errorHandlerService.validateError = jasmine.createSpy().and.callFake(() => {});
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          fixture.detectChanges();
          document.getElementById('deleteButton')?.click();
          communicationService.emitDialogCallbackEvent('confirm-deletion');
          setTimeout(() => {
            expect(communicationService.closeSpinner).toHaveBeenCalled();
            done();
          });
        });
    });

    it('If deletion was successful not error alert should be opened', done => {
      communicationService.emitAlertData = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.reject());
      errorHandlerService.validateError = jasmine.createSpy().and.callFake(() => {});
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          fixture.detectChanges();
          document.getElementById('deleteButton')?.click();
          communicationService.emitDialogCallbackEvent('confirm-deletion');
          setTimeout(() => {
            expect(communicationService.emitAlertData).toHaveBeenCalledWith({
              id: '',
              type: 'danger',
              message: 'Ha ocurrido un error al eliminar la clínica',
              clearTimeMs: 3000
            });
            done();
          });
        });
    });

    it('If deletion was successful validateError method should be called', done => {
      communicationService.emitAlertData = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.reject());
      errorHandlerService.validateError = jasmine.createSpy().and.callFake(() => {});
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          fixture.detectChanges();
          document.getElementById('deleteButton')?.click();
          communicationService.emitDialogCallbackEvent('confirm-deletion');
          setTimeout(() => {
            expect(errorHandlerService.validateError).toHaveBeenCalled();
            done();
          });
        });
    });

    it('After deletion process elements should be cleared', done => {
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve());
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          if(component.addClinicCustomComponent) {
            component.addClinicCustomComponent.clearValues = jasmine.createSpy();
          }
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          fixture.detectChanges();
          document.getElementById('deleteButton')?.click();
          communicationService.emitDialogCallbackEvent('confirm-deletion');
          setTimeout(() => {
            expect(component.addClinicCustomComponent?.clearValues).toHaveBeenCalled();
            done();
          });
        });
    });
  });

  describe('List patients on clinic - basic functionality', () => {
    it('If there are patients registered should be listed', done => {
      const patients = (userData as TUserData).patients.filter((patient: TPatient) => patient.clinicId === 1);

      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('1');
          document.getElementById('patient-list-btn')?.click();
          fixture.detectChanges();
          expect(document.querySelectorAll('#mat-accordion').length).toEqual(patients.length);
          done();
        })
    });

    it('If there are not patients registered information message should be shown', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('3');
          document.getElementById('patient-list-btn')?.click();
          fixture.detectChanges();
          expect(document.getElementById('no-patients-message')).not.toEqual(null);
          done();
        });
    });

    it('Clicking on the manage clinics button should show the form', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.autocompleteCustomComponent?.selectedValue.emit('3');
          document.getElementById('patient-list-btn')?.click();
          fixture.detectChanges();
          document.getElementById('manage-clinics-btn')?.click();
          fixture.detectChanges();
          expect(document.getElementById('updateButton')).not.toEqual(null);
          done();
        });
    });
  });
});
