import {inject, Injectable} from "@angular/core";
import {addDoc, collection, Firestore, getDoc, getDocs, query, where} from "@angular/fire/firestore";
import {TBackup, TGeneralConfig, TUserData} from "../types/types";
import dayjs from "dayjs";


@Injectable({
  providedIn: 'root'
})

export class FirestoreBackupService {
  firestore = inject(Firestore);

  constructor() {
  }

  /**
   * Method to init backup service, will check if backup is needed
   */
  public async initBackupService(uid: string, generalConfig: TGeneralConfig, userData: TUserData) {
    if (uid && generalConfig) {
      const res = await this._getTodayBackup(uid, this._getTodayDateFormatted());
      if (res === 'no-backups') {
        await this._requestNewBackupCreation(uid, [], userData);
      } else {
        if (res !== 'error' && this._shouldCreateNewBackup(res, generalConfig)) {
          await this._requestNewBackupCreation(uid, res, userData)
        } else {
          this._handleErrors(res as string);
        }
      }

    }
  }

  /**
   * Create new backup object and call method that saves backup
   * @param uid
   * @param currentBackups
   * @param userData
   * @private
   */
  private async _requestNewBackupCreation(uid: string, currentBackups: TBackup[], userData: TUserData) {
    const newBackup: TBackup = {
      creationDate: this._getTodayDateFormatted(),
      creationTime: this._getCurrentTime(),
      backupId: this._getNewBackupId(currentBackups),
      userData: userData
    };

    await this._saveBackup(uid, newBackup);
  }

  /**
   * Evaluates if should create new backup
   * @param backups
   * @param generalConfig
   * @private
   */
  private _shouldCreateNewBackup(backups: TBackup[], generalConfig: TGeneralConfig): boolean {
    if ((generalConfig?.backupsLimitDay) && (backups.length >= generalConfig?.backupsLimitDay)) {
      console.warn(`Should I create a backup? No, daily limit of ${generalConfig.backupsLimitDay} has been reached.`);
      return false;
    }

    const higherDateTimeDoc = backups.map((doc: TBackup) => ({...doc, formattedDate: dayjs(`${doc.creationDate}T${doc.creationTime}`)}));
    const highestDate = higherDateTimeDoc.reduce((prev, current) => prev.formattedDate.isAfter(current.formattedDate) ? prev : current);

    const dateNow = dayjs(new Date());
    const minutesDiff = dateNow.diff(highestDate.formattedDate, 'minutes');

    if ((generalConfig?.minutesBetweenBackups) && (minutesDiff < generalConfig?.minutesBetweenBackups)) {
      console.warn(`Should I create a backup? No, time passed since last backup is ${minutesDiff} mins of ${generalConfig.minutesBetweenBackups} mins`);
      return false;
    }

    console.warn(`Should I create a backup? Yes! Current backup is ${backups.length + 1} of ${generalConfig?.backupsLimitDay}`);
    return true;
  }

  private _handleErrors(error: string) {

  }

  /**
   * Method to save backup
   * @private
   */
  private async _saveBackup(uid: string, backup: TBackup) {
    const setCollection = collection(this.firestore, 'manage-sessions', uid, 'backups');
    return addDoc(setCollection, backup).then(() => {
      console.warn('Backup registered successfully');
    }).catch(() => false);
  }

  /**
   * Method to get today's date formatted
   * @private
   */
  private _getTodayDateFormatted(): string {
    const _date = new Date();
    const [year, month, day] = [_date.getFullYear(), _date.getMonth() + 1, _date.getDate()];
    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
  }

  /**
   * Returns current time with hh:mm format
   * @private
   */
  private _getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return hours + ':' + minutes;
  }

  /**
   * Get new backup's id
   * @param backups
   * @private
   */
  private _getNewBackupId(backups: TBackup[]) {
    return backups.length === 0 ? 1 :
      Math.max(... (backups.map((backup: TBackup) => backup.backupId))) + 1
  }

  /**
   * Get today's backup by creation date
   * @param uid
   * @param date
   * @private
   */
  private async _getTodayBackup(uid: string, date: string) {
    const _collection = collection(this.firestore, 'manage-sessions', uid, 'backups');
    if (_collection) {
      const _query = query(_collection, where('creationDate', '==', date));
      if (_query) {
        const res = await getDocs(_query);
        if (res.empty) {
          return 'no-backups';
        }

        const _docs: TBackup[] = [];

        res.docs.forEach(doc => {
          _docs.push(doc.data() as TBackup);
        });

        return _docs;
      } else {
        return 'error';
      }
    } else {
      return 'error';
    }
  }
}
