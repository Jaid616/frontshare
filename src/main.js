import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { screen } from 'electron';

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const { workAreaSize } = screen.getPrimaryDisplay();

  const mainWindow = new BrowserWindow({
    // width: workAreaSize.width,
    // height: workAreaSize.height,
     width : 600,
     height : 400,
    icon: path.join(__dirname, 'assets/logo.ico'),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: true,
      allowRunningInsecureContent: false,
      nodeIntegration: false,
      contextIsolation: true
    },
    // fullscreen: true,
  });

  // Set CSP headers
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self';" +
          "connect-src 'self' * data: https: https://accounts.google.com https://*.gstatic.com https://www.googleapis.com;" +
          "img-src 'self' data: https: blob:;" +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://*.gstatic.com https://www.google.com;" +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com;" + // Added https://www.gstatic.com
          "font-src 'self' https://fonts.gstatic.com;" +
          "frame-src 'self' https://accounts.google.com https://www.google.com https://*.google.com;" +
          "worker-src 'self' blob:;"
        ],
      },
    });
  });
  

  // Enable permissions for specific features if needed
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowedPermissions = ['notifications', 'geolocation'];
    callback(allowedPermissions.includes(permission));
  });
  
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});