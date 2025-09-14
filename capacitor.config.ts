import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'chitaritech.stockfacile.com',
  appName: 'Stock Facile',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000, // Durée d'affichage (1 seconde)
      backgroundColor: "#ffffffff", // Couleur de fond : blanc
      androidScaleType: "CENTER_CROP", // Ajuste l'image au centre en conservant les proportions
      showSpinner: false, // Désactive le spinner pour un affichage plus propre
      splashFullScreen: true, // Active le mode plein écran
      splashImmersive: true, // Supprime la barre de navigation/status pendant le splash
    },
  },
};

export default config;
