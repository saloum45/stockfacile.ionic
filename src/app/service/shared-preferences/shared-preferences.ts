import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
@Injectable({
  providedIn: 'root'
})
export class SharedPreferences {
    private local_storage_prefixe = 'stockf_';
  // --- Lire une valeur ---
  async get_from_preferences(key: string): Promise<any> {
    const { value } = await Preferences.get({ key: this.local_storage_prefixe + key });
    try {
      return value ? JSON.parse(value) : null;   // si tu stockes des objets
    } catch {
      return value;
    }
  }

  // --- Sauvegarder une valeur ---
  async save_on_preferences(key: string, value: any): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await Preferences.set({
      key: this.local_storage_prefixe + key,
      value: stringValue,
    });
  }

  // --- Supprimer une valeur ---
  async delete_from_preferences(key: string): Promise<void> {
    await Preferences.remove({ key: this.local_storage_prefixe + key });
  }
}
