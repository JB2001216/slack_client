import { app, protocol, shell, BrowserWindow, Tray, Menu, ipcMain, dialog } from 'electron';
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
const isDevelopment = process.env.NODE_ENV !== 'production';
const urlScheme = process.env.VUE_APP_URL_SCHEME;

log.transports.file.level = 'info';
log.info('App starting...');
function sendStatusToWindow(text: string) {
  log.info(text);
}

// autoUpdater
if (!process.env.WEBPACK_DEV_SERVER_URL) {
  autoUpdater.logger = log;
  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
  });
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
  });
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
  });
  autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
  });
  autoUpdater.on('download-progress', (progressObj) => {
    let message = 'Download speed: ' + progressObj.bytesPerSecond;
    message = message + ' - Downloaded ' + progressObj.percent + '%';
    message = message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
    sendStatusToWindow(message);
  });
  autoUpdater.on('update-downloaded', () => {
    sendStatusToWindow('Update downloaded');
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Yes', 'No'],
      defaultId: 0,
      message: `The new version has been downloaded. Are you sure you want to restart ${process.env.VUE_APP_TITLE}?`,
      title: 'Update available',
    }, (response) => {
      if (response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
  app.on('ready', () => {
    autoUpdater.allowDowngrade = false;
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.checkForUpdates();
  });
}


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null = null;
let tray: Tray | null = null;
let quitting = false;

declare var __static: string;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

// 実行パラメーターからOpenURL取得
function getOpenURLFromArgv(argv: string[] = []) {
  for (let arg of argv) {
    if (arg.match(new RegExp(`^${urlScheme}://`))) {
      return arg;
    }
  }
  return null;
}

// OpenURLをwindowに通知
function emitOpenURL(url: string | null) {
  if (!url) return;
  if (win && win.webContents) {
    win.webContents.send('open-url', url);
  }
}

// 初期起動時に指定されたOpenURL
let initOpenURL = getOpenURLFromArgv(process.argv);

if (!app.requestSingleInstanceLock()) {
  // 2重起動防止
  app.quit();
} else {
  // CustomURLSchemeをOSに登録(Windowsの場合はレジストリに登録される)
  if (!process.env.WEBPACK_DEV_SERVER_URL) {
    // OSXはinfo.plistに自動追加してくれるので除外
    if (process.platform !== 'darwin') {
      if (!app.isDefaultProtocolClient(urlScheme)) {
        app.setAsDefaultProtocolClient(urlScheme);
      }
    }
  }

  // 2重起動検知
  app.on('second-instance', (event, argv, cwd) => {
    // 2重起動時は既存ウインドウにフォーカス
    showWindow();
    // OpenURLで起動された場合はwindowに通知
    const url = getOpenURLFromArgv(argv);
    emitOpenURL(url);
  });
}

app.on('will-finish-launching', () => {
  // OSXのOpenURL検知
  app.on('open-url', (e, url) => {
    e.preventDefault();
    if (!app.isReady()) {
      initOpenURL = url;
    } else {
      showWindow();
      emitOpenURL(url);
    }
  });
});

function createWindow(this: any) {
  if (win) return;

  // Create the browser window.
  win = new BrowserWindow({
    ...(process.env.WEBPACK_DEV_SERVER_URL ? {
      width: 1524,
      height: 576,
    } : {
      width: 1280,
      height: 720,
    }),
    minWidth: 1024,
    minHeight: 576,
    icon: path.join(__static, 'img', 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: false,
    },
  });

  // 新規ウインドウはアプリ外で起動する
  win.webContents.on('new-window', (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.webContents.on('did-finish-load', () => {
    win!.webContents.send('window-id', win!.id);
    if (initOpenURL) {
      emitOpenURL(initOpenURL);
      initOpenURL = null;
    }
  });

  win.on('close', (e) => {
    // アプリを終了する場合以外の閉じる処理はウインドウの非表示で対応
    if (!quitting) {
      e.preventDefault();
      win!.hide();
    }
  });

  win.on('closed', () => {
    // 開放
    win = null;
    tray = null;
  });
}

function showWindow() {
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.show();
  }
}

function createTask() {
  if (process.platform === 'darwin') return;
  if (tray) return;

  tray = new Tray(path.join(__static, 'img', 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => showWindow() },
    { role: 'quit' },
  ]);
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (win) {
      win.isVisible() ? win.hide() : win.show();
    }
  });
}

app.on('activate', () => {
  showWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('before-quit', () => {
  // アプリの終了処理中であることを記録
  quitting = true;
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async() => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools();
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
  createTask();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }

  // デバッグメニューからのopen-url
  ipcMain.on('open-url', (ev: Event, url: string) => {
    emitOpenURL(url);
  });
}
