import {TClinic, TPatient, TSession} from "../types/types";

export  const initialPatientData: TPatient = {
  patientId: 0,
  clinicId: 0,
  names: '',
  surnames: '',
  sessionValue: 0,
  observations: '',
  bornDate: '',
  sessionTime: 0,
  family: [],
  address: {
    fullAddress: '',
    number: '',
    additionalInfo: ''
  },
  schooling: {
    turn: '',
    schedule: {
      since: '',
      to: ''
    },
    institutionObs: '',
    institutionName: '',
    institutionContactDetails: {
      emailAddress: '',
      website: '',
      phoneNumber: '',
      mobilePhoneNumber: ''
    },
    address: {
      fullAddress: '',
      additionalInfo: '',
      number: ''
    }
  }
};

export const initialClinicData: TClinic = {
  clinicId: 0,
  contactDetails: {
    emailAddress: '',
    mobilePhoneNumber: '',
    phoneNumber: '',
    website: ''
  },
  address: {
    fullAddress: '',
    number: '',
    additionalInfo: ''
  },
  clinicName: ''
}

export const monthsArray: string[] = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]

export const initialSessionData: TSession = {
  sessionDate: '',
  patientId: 0,
  clinicId: 0,
  sessionId: 0,
  sessionObs: '',
  sessionValue: 0
}
