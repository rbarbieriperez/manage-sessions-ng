export type TUserData = {
  name: string;
  surname: string;
  clinics: Array<TClinic>;
  patients: Array<TPatient>;
  sessions: Array<TSession>;
  admConfig: TAdmConfig;
}


export type TAdmConfig = {
  isActive: boolean;
}

export type TPatient = {
  patientId: number;
  names: string;
  surnames: string;
  clinicId: number;
  bornDate: string;
  sessionValue: number;
  sessionTime: number;
  observations: string;
  address: TAddress;
  family: Array<TFamily>;
  schooling: TPatientSchooling // cambiar a estricto
};

export type TPatientSchooling = {
  institutionName: string;
  turn: string,
  schedule: TSchedule;
  institutionContactDetails: TInstitutionContactDetails;
  institutionObs: string;
  address: TAddress;
}

export type TSchedule = {
  since: string;
  to: string;
}

export type TInstitutionContactDetails = {
  mobilePhoneNumber: '',
  phoneNumber: '',
  emailAddress: '',
  website: ''
}

export type TOption = {
  value: string;
  viewValue: string;
}

export type TSession = {
  sessionId: number;
  patientId: number;
  clinicId: number;
  sessionValue: number;
  sessionDate: string;
  sessionObs: string;
}


export type TClinic = {
  clinicId: number;
  clinicName: string;
  address: TAddress;
  contactDetails: TClinicContactDetail
}

export type TClinicContactDetail = {
  mobilePhoneNumber: string,
  phoneNumber: string,
  emailAddress: string,
  website: string
}

export type TSessionType = {
  sessionTypeId: number;
  sessionType: string;
}

export type TFamily = {
  relationType: string;
  names: string;
  surnames: string;
  contactType: string;
  contactDetail: string;
};

export type TContactDetail = {
  contactMethodInfo?: string;
  contactType: string;
  contactDetail: string;
}

export type TAddress = {
  fullAddress: string;
  number: string;
  additionalInfo: string;
}

export type TPages = 'login' | 'home' | 'manage-clinics' | 'manage-patients'| 'reports' | 'other-settings' | 'registration-screen';


export type TDataCategories = {
  header: string,
  values: string[]
}


export type TNotificationToastConfig = {
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center',
  autoClose?: number,
  hiddeProgressBar?: boolean,
  closeButton?:boolean,
  closeOnClick?: boolean,
  rtl?: boolean,
  pauseOnFocusLoss?: boolean,
  dragabble?: boolean,
  pauseOnHover?: boolean,
  theme?: 'colored' | 'dark' | 'light',
  type: 'info' | 'success' | 'warning' | 'error',
  message: string
};

export type TNotificationToastEvent = {
  event: string;
  detail: TNotificationToastConfig
};


export type TModalType = 'alert' | 'success' | 'info';



export type TSnapshotDataEvent = {
  event: string,
  detail: {
    data: 'no-id' | 'no-data' | TUserData
  }
}

export type TBackup = {
  creationDate: string,
  creationTime: string,
  backupId: number;
  userData: TUserData;
}

export type TGeneralConfig = {
  backupsLimitDay: number;
  minutesBetweenBackups: number;
}



export type TAlert = {
  type: 'success' | 'info' | 'warning' | 'danger',
  message: string,
  id: string,
  clearTimeMs: number
}

export type TDialog = {
  title?: string,
  content?: string,
  primaryButtonLabel?: string,
  secondaryButtonLabel?: string,
  primaryButtonEvent?: string,
  secondaryButtonEvent?: string,
  modalCloseEvent?: string,
  size: 'sm' | 'lg' | 'xl'
}

export type TMenuCustom = {
  title: string;
  options: Array<{
    icon?: string,
    text?: string,
    redirectTo?: string
  }>
}
