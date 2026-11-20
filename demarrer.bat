@echo off
setlocal
cd /d "%~dp0"

if not exist ".env" (
    echo Attention : le fichier .env est absent.
    echo Copiez .env.example vers .env et adaptez les parametres de la base.
    echo.
)

where php >nul 2>nul
if %errorlevel%==0 (
    echo Demarrage du serveur PHP sur http://127.0.0.1:8000 ...
    php -S 127.0.0.1:8000 -t public
    pause
    goto :fin
)

if exist "C:\xampp\php\php.exe" (
    echo Demarrage avec le PHP de XAMPP sur http://127.0.0.1:8000 ...
    "C:\xampp\php\php.exe" -S 127.0.0.1:8000 -t public
    pause
    goto :fin
)

echo PHP est introuvable.
echo Installez XAMPP ou ajoutez php.exe au PATH de Windows.
echo Voir GUIDE_PROFESSEUR.md, section 2.
pause

:fin
endlocal
