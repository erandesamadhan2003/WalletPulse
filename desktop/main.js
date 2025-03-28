import { app, BrowserWindow } from "electron";

// Disable GPU acceleration to avoid VSync errors
app.disableHardwareAcceleration();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "WalletPulse",  // ✅ Set the title here
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL("http://localhost:5173");
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
