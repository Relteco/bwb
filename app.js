const { app, BrowserWindow, protocol, screen, Menu, ipcMain, url, webContents, BrowserView,nativeTheme } = require('electron')

const path = require('path'),
  fs = require('fs');
const homedir = app.getPath('home');


let AppWin;
const isMac = process.platform === 'darwin'



// ** TR **
// Electron projelerinde webview için klavye ve mouse dinlemeleri kapalıdır.
// (webview.addEventListener("key##",()={}) NOT WORKING)
// ayrıca bknz -> https://www.electronjs.org/docs/latest/api/webview-tag
// > Internal implementation > You can not add keyboard, mouse, and scroll event listeners to webview.

// bu yüzden klavye kısayollarında hiyeraşi sağlamanın en kolay yolu
//menu içinde "Accelerator " özniteliğini kullanmaktır. 
//bknz -> https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts


// ** EN **
// In Electron projects, keyboard and mouse listening are turned off for webview.
//(webview.addEventListener("key##",()={}) NOT WORKING)
// see also  -> https://www.electronjs.org/docs/latest/api/webview-tag
// > Internal implementation > You can not add keyboard, mouse, and scroll event listeners to webview.

//so the easiest way to maintain hierarchy in keyboard shortcuts is to use the "Accelerator " attributein the menu.


const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    label: 'Functions',
    submenu: [
      {
        label: 'Open Menu',
        accelerator: 'CmdOrCtrl+Return',
        click: () => {
          AppWin.webContents.send('key', '13')
        }
      },
      {
        label: 'Close Menu',
        accelerator: 'CmdOrCtrl+Backspace',
        click: () => {
          AppWin.webContents.send('key', '8')
        }
      },
      {
        label: 'Prev Page',
        accelerator: 'CmdOrCtrl+K',
        click: () => {
          AppWin.webContents.send('key', '75')
        }
      },
      {
        label: 'Next Page',
        accelerator: 'CmdOrCtrl+L',
        click: () => {
          AppWin.webContents.send('key', '76')
        }
      },
      {
        label: 'Help Page',
        accelerator: 'CmdOrCtrl+J',
        click: () => {
          AppWin.webContents.send('key', '74')
        }
      },
      {
        label: 'Reload Page',
        accelerator: 'CmdOrCtrl+Alt+R',
        click: () => {
          AppWin.webContents.send('key', '82')
        }
      },
      {
        label: 'Home Page',
        accelerator: 'CmdOrCtrl+H',
        click: () => {
          AppWin.webContents.send('key', '72')
        }
      }
    ]
  }

]

// menu oluştur
// create custom menu

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)



function initApp() {

  AppWin = new BrowserWindow({
    frame: false, // menubar ı gizle  // hide menubar
    backgroundColor: "#101215",

    webPreferences: { darkTheme: true, nodeIntegration: true, contextIsolation: false, webviewTag: true, devTools: true, preload: path.join(__dirname, 'preload.js') }
  })

  AppWin.loadFile('index.html')

// koyu tema dinleyici
// dark theme listener

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })



}










app.whenReady().then(() => {
  initApp()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    initApp()
  }
})



