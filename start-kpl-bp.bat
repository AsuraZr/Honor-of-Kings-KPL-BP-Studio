@echo off
setlocal
cd /d "%~dp0"

set "PYTHON_EXE="
set "PYTHON_ARGS="

rem Prefer a portable runtime shipped next to this script.
if exist "%~dp0runtime\python.exe" (
  set "PYTHON_EXE=%~dp0runtime\python.exe"
)

rem Validate real Python. Windows Store aliases can exist in PATH but fail.
if not defined PYTHON_EXE (
  py -3 --version >nul 2>nul
  if not errorlevel 1 (
    set "PYTHON_EXE=py"
    set "PYTHON_ARGS=-3"
  )
)

if not defined PYTHON_EXE (
  python --version >nul 2>nul
  if not errorlevel 1 set "PYTHON_EXE=python"
)

set "PYTHON_FALLBACK=C:\Users\99356\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe"
if not defined PYTHON_EXE (
  if exist "%PYTHON_FALLBACK%" (
    "%PYTHON_FALLBACK%" --version >nul 2>nul
    if not errorlevel 1 set "PYTHON_EXE=%PYTHON_FALLBACK%"
  )
)

if not defined PYTHON_EXE (
  echo.
  echo [ERROR] Python 3.10+ not found.
  echo Install Python from https://www.python.org/downloads/
  echo or place a portable runtime at runtime\python.exe.
  echo.
  pause
  exit /b 1
)

echo.
echo Python: %PYTHON_EXE% %PYTHON_ARGS%
"%PYTHON_EXE%" %PYTHON_ARGS% -c "import sys; print(sys.version.split()[0])"

powershell -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:5170/api/health' -TimeoutSec 2; if ($r.StatusCode -eq 200) { Start-Process 'http://127.0.0.1:5170'; exit 0 } } catch { }; exit 1" >nul 2>nul
if not errorlevel 1 (
  echo.
  echo KPL BP Studio is already running.
  echo Opening http://127.0.0.1:5170
  exit /b 0
)

echo.
echo Starting KPL BP Studio...
echo URL: http://127.0.0.1:5170
echo Close this window to stop the local server.
echo.
"%PYTHON_EXE%" %PYTHON_ARGS% server.py --open

if errorlevel 1 (
  echo.
  echo Server failed to start. Check whether port 5170 is in use.
  pause
)
endlocal
