npm run dev:infra
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev:ui"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev:bff"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev:agent"
