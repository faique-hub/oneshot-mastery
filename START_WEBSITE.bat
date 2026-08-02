@echo off
cd /d "%~dp0"
python build_content.py
if errorlevel 1 (
  echo.
  echo Python could not run. Make sure Python is installed.
  pause
  exit /b 1
)
start "" http://localhost:8000
python -m http.server 8000
