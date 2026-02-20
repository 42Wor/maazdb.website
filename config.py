import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    
    # MAAZDB PROJECT SETTINGS
    LATEST_VERSION = "12.0.0"
    
    # Construct filenames dynamically based on version
    INSTALLER_WIN = f"MaazDB_Setup_Windows_x64_{LATEST_VERSION.replace('.', '')}.exe"
    INSTALLER_LINUX = f"maazdb_{LATEST_VERSION}_linux_amd64.deb"
    INSTALLER_MAC = f"MaazDB_{LATEST_VERSION}_macOS.dmg"