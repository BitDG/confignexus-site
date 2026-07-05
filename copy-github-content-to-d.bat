@echo off
setlocal

set "DEST_ROOT=D:\configNexus-github-copy"
set "FAILED=0"

mkdir "%DEST_ROOT%" >nul 2>nul

call :copy_one 1 4 "F:\VibeSpace\configNexus-worldshop" "configNexus-worldshop"
call :copy_one 2 4 "F:\VibeSpace\confignexus-promo" "confignexus-promo"
call :copy_one 3 4 "E:\configNexus-site" "configNexus-site"
call :copy_one 4 4 "E:\configNexus-1" "configNexus-1"

echo.
if "%FAILED%"=="1" (
  echo Done with warnings: %DEST_ROOT%
) else (
  echo Done: %DEST_ROOT%
)
pause
exit /b 0

:copy_one
set "STEP=%~1"
set "TOTAL=%~2"
set "SRC=%~3"
set "NAME=%~4"

if not exist "%SRC%\" (
  echo [%STEP%/%TOTAL%] Skip missing: %SRC%
  exit /b 0
)

echo [%STEP%/%TOTAL%] Copying %NAME%...
robocopy "%SRC%" "%DEST_ROOT%\%NAME%" /E /XJ /XD .git .claude .codex node_modules dist build .next out coverage .cache .turbo .vite .parcel-cache .vibespace vframes dev\active .aimon\runtime /XF .env .env.* *.log /R:1 /W:1
if %ERRORLEVEL% GEQ 8 (
  echo [%STEP%/%TOTAL%] Warning: skipped files with copy errors in %SRC%
  set "FAILED=1"
  exit /b 0
)
echo [%STEP%/%TOTAL%] Finished %NAME%
exit /b 0
