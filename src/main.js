const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const si = require('systeminformation');
const tmp = require('tmp');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'PcVerify'
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.removeMenu();

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

ipcMain.handle('start-scan', async () => {
  try {
    const suspiciousFiles = await checkSuspiciousFiles();
    
    const suspiciousExes = await checkSuspiciousExecutables();
    
    const devices = await checkDevices();
    
    const cacheCleanup = await cleanCache();
    
    const systemInfo = await getSystemInfo();
    
    return {
      success: true,
      suspiciousFiles,
      suspiciousExes,
      devices,
      cacheCleanup,
      systemInfo
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

async function checkSuspiciousFiles() {
  const userHome = os.homedir();
  const suspiciousExtensions = ['.composium', '.bin', '.dll', '.sys', '.vbs'];
  const suspiciousFiles = [];
  
  const foldersToCheck = [
    path.join(userHome, 'Downloads'),
    path.join(userHome, 'Documents'),
    path.join(userHome, 'Desktop'),
    path.join(os.tmpdir())
  ];
  
  for (const folder of foldersToCheck) {
    if (fs.existsSync(folder)) {
      const files = fs.readdirSync(folder);
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (suspiciousExtensions.includes(ext)) {
          suspiciousFiles.push(path.join(folder, file));
        }
      }
    }
  }
  
  return suspiciousFiles;
}

async function checkSuspiciousExecutables() {
  const userHome = os.homedir();
  const suspiciousExes = [];
  
  const foldersToCheck = [
    path.join(userHome, 'Downloads'),
    path.join(userHome, 'Desktop'),
    path.join(userHome, 'AppData', 'Local', 'Temp'),
    path.join(os.tmpdir())
  ];
  
  for (const folder of foldersToCheck) {
    if (fs.existsSync(folder)) {
      const files = fs.readdirSync(folder);
      for (const file of files) {
        if (file.endsWith('.exe')) {
          const fileName = file.toLowerCase();
          if (fileName.includes('crack') || 
              fileName.includes('keygen') || 
              fileName.includes('serial') || 
              fileName.includes('patch') ||
              fileName.includes('free_') ||
              fileName.includes('hack')) {
            suspiciousExes.push(path.join(folder, file));
          }
        }
      }
    }
  }
  
  return suspiciousExes;
}

async function checkDevices() {
  const devices = await si.usb();
  return devices;
}

async function cleanCache() {
  const tempDir = os.tmpdir();
  const cacheFolders = [
    path.join(tempDir),
    path.join(os.homedir(), 'AppData', 'Local', 'Temp')
  ];
  
  let deletedFiles = 0;
  let freedSpace = 0;
  
  for (const folder of cacheFolders) {
    if (fs.existsSync(folder)) {
      const files = fs.readdirSync(folder);
      for (const file of files) {
        try {
          const filePath = path.join(folder, file);
          const stats = fs.statSync(filePath);
          
          if (stats.isFile() && !isFileInUse(filePath)) {
            fs.unlinkSync(filePath);
            deletedFiles++;
            freedSpace += stats.size;
          }
        } catch (error) {
          console.error(`Error deleting file: ${error.message}`);
        }
      }
    }
  }
  
  freedSpace = Math.round(freedSpace / (1024 * 1024));
  
  return { deletedFiles, freedSpace };
}

function isFileInUse(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
    return false;
  } catch (error) {
    return true;
  }
}

async function getSystemInfo() {
  const [cpu, mem, osInfo, disk] = await Promise.all([
    si.cpu(),
    si.mem(),
    si.osInfo(),
    si.fsSize()
  ]);
  
  return {
    cpu: `${cpu.manufacturer} ${cpu.brand} (${cpu.cores} cores)`,
    memory: `${Math.round(mem.total / (1024 ** 3))} GB`,
    os: `${osInfo.distro} ${osInfo.release} (${osInfo.arch})`,
    disk: disk.map(d => ({
      fs: d.fs,
      size: Math.round(d.size / (1024 ** 3)),
      used: Math.round(d.used / (1024 ** 3)),
      use: d.use
    }))
  };
}