@echo off
echo ========================================
echo VeriCheck Pro - GitHub Deployment
echo ========================================
echo.

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not found in PATH
    echo Please close this window and open a NEW PowerShell/Command Prompt
    echo Git needs a restart to work after installation
    pause
    exit /b 1
)

echo Git found! Proceeding with deployment...
echo.

REM Initialize Git repository
echo [1/5] Initializing Git repository...
git init
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to initialize Git
    pause
    exit /b 1
)
echo ✓ Git initialized
echo.

REM Add all files
echo [2/5] Adding all files...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)
echo ✓ Files added
echo.

REM Create initial commit
echo [3/5] Creating initial commit...
git commit -m "Initial commit - VeriCheck Pro ready for deployment"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create commit
    pause
    exit /b 1
)
echo ✓ Commit created
echo.

REM Get GitHub username
echo [4/5] GitHub Setup
echo.
set /p GITHUB_USERNAME="Enter your GitHub username: "
if "%GITHUB_USERNAME%"=="" (
    echo ERROR: GitHub username cannot be empty
    pause
    exit /b 1
)

REM Add remote
echo Adding GitHub remote...
git remote add origin https://github.com/%GITHUB_USERNAME%/vericheck-pro.git
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Remote might already exist, trying to set URL...
    git remote set-url origin https://github.com/%GITHUB_USERNAME%/vericheck-pro.git
)
echo ✓ Remote configured
echo.

REM Set main branch
echo [5/5] Pushing to GitHub...
git branch -M main
echo.
echo IMPORTANT: You will be asked for credentials
echo Username: %GITHUB_USERNAME%
echo Password: Use a Personal Access Token (NOT your password!)
echo.
echo To create a token:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Check "repo" permissions
echo 4. Copy the token (starts with ghp_...)
echo 5. Use it as your password below
echo.
pause

REM Push to GitHub
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to push to GitHub
    echo.
    echo Common issues:
    echo 1. Repository doesn't exist on GitHub yet
    echo    - Go to https://github.com/new
    echo    - Create a repository named: vericheck-pro
    echo    - Do NOT initialize with README
    echo    - Then run this script again
    echo.
    echo 2. Wrong credentials
    echo    - Make sure you're using a Personal Access Token
    echo    - Not your GitHub password
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ SUCCESS! Code pushed to GitHub
echo ========================================
echo.
echo Your repository: https://github.com/%GITHUB_USERNAME%/vericheck-pro
echo.
echo NEXT STEPS:
echo 1. Go to: https://vercel.com/signup
echo 2. Sign in with GitHub
echo 3. Import your vericheck-pro repository
echo 4. Add environment variable: GEMINI_API_KEY
echo 5. Deploy!
echo.
echo See DEPLOY_NOW.md for detailed Vercel instructions
echo.
pause
