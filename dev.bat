@echo off
echo CAD.io Development Server Manager

:menu
cls
echo.
echo 1. Start Development Server
echo 2. Restart Development Server (Clean)
echo 3. Clean and Reinstall
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto restart
if "%choice%"=="3" goto clean
if "%choice%"=="4" goto end

:start
echo Starting development server...
npm run dev
goto end

:restart
echo Stopping any running processes...
taskkill /F /IM node.exe >nul 2>&1
echo Clearing cache...
rd /s /q .next >nul 2>&1
rd /s /q node_modules\.cache >nul 2>&1
echo Starting development server...
npm run dev
goto end

:clean
echo Performing clean installation...
echo Stopping any running processes...
taskkill /F /IM node.exe >nul 2>&1
echo Cleaning project...
rd /s /q .next >nul 2>&1
rd /s /q node_modules >nul 2>&1
del package-lock.json >nul 2>&1
echo Installing dependencies...
npm install
echo Starting development server...
npm run dev
goto end

:end
if "%choice%"=="4" (
    echo Goodbye!
    exit
) else (
    echo.
    echo Press any key to return to menu...
    pause >nul
    goto menu
) 