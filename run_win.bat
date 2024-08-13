@echo off
SET REPO_DIR=Pick_to_light_app

IF NOT EXIST %REPO_DIR% (
    echo Repository not found. Cloning repository...
    git clone https://github.com/wylupek/Pick_to_light_app %REPO_DIR%
    IF ERRORLEVEL 1 (
        echo Failed to clone the repository. Exiting...
        pause
        exit /b
    )
) ELSE (
    echo Repository exists. Pulling changes...
    cd %REPO_DIR%
    git fetch --all
    git reset --hard origin/main
    IF ERRORLEVEL 1 (
        echo Failed to reset the repository. Exiting...
        pause
        exit /b
    )
    cd ..
)
cd %REPO_DIR%\client

echo Installing client dependencies...
call npm install
IF ERRORLEVEL 1 (
    echo Failed to install client dependencies. Exiting...
    pause
    exit /b
)


echo Installing serve...
call npm install -g serve
IF ERRORLEVEL 1 (
    echo Failed to install serve. Exiting...
    pause
    exit /b
)

echo Building the client...
call npm run build
IF ERRORLEVEL 1 (
    echo Failed to build the client. Exiting...
    pause
    exit /b
)

echo Running the client...
start "" /B "cmd /c serve -s build"
IF ERRORLEVEL 1 (
    echo Failed to serve the client. Exiting...
    pause
    exit /b
)

cd ../server
echo Installing server dependencies...
call npm install
IF ERRORLEVEL 1 (
    echo Failed to install server dependencies. Exiting...
    pause
    exit /b
)

echo Setting up database...
node setup.js
IF ERRORLEVEL 1 (
    echo Failed to set up database. Exiting...
    pause
    exit /b
)

echo Running the server...
@REM start "" "cmd /c node index.js"
node index.js
IF ERRORLEVEL 1 (
    echo Failed to serve the server. Exiting...
    pause
    exit /b
)

echo Server and client are running...
pause