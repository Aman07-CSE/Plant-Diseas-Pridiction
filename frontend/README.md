# Plant Disease Prediction - Run Guide


Live Link : "https://plant-diseas-pridiction-1.onrender.com"

This project has:
- Backend: Flask + PyTorch + Gemini API
- Frontend: React + Vite

The frontend calls backend APIs through Vite proxy at `/api` -> `http://localhost:5000`.

## 1. Prerequisites

Install these first:
- Python 3.14
- Node.js 18+
- npm

## 2. Open project root

Open terminal in:

`D:\College\Plant Diseas Pridiction`

## 3. Setup backend

Open Terminal 1 and run:

```powershell
Set-Location "D:\College\Plant Diseas Pridiction"

# Create virtual environment once (skip if already exists)
py -3.14 -m venv .venv

# Activate environment
.\.venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r .\backend\requirements.txt
```

## 4. Add Gemini API key (optional but recommended)

Create file `backend/.env` with:

```env
GEMINI_API_KEY=your_real_api_key_here
```

If API key is missing, basic backend still runs but Gemini chat/recommendation features are limited.

## 5. Run backend

In Terminal 1:

```powershell
Set-Location "D:\College\Plant Diseas Pridiction\backend"
..\.venv\Scripts\python.exe app.py
```

Backend should run on:
- `http://127.0.0.1:5000`

## 6. Setup and run frontend

Open Terminal 2 and run:

```powershell
Set-Location "D:\College\Plant Diseas Pridiction\frontend"
npm install
npm run dev
```

Frontend should run on:
- `http://127.0.0.1:5173`

## 7. Quick checks

Health check (new terminal):

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/health" -Method Get
```

Expected key values:
- `status: ok`
- `model_loaded: True`

## 8. Common issues

- `ModuleNotFoundError: No module named 'torch'`
	- Activate `.venv` and reinstall with `pip install -r .\backend\requirements.txt`

- Gemini `503 UNAVAILABLE`
	- This is temporary model overload from Gemini side. Retry after some time.

- Frontend cannot reach backend
	- Ensure backend is running on port 5000.
	- Ensure frontend is run from `frontend` folder so Vite proxy works.

## 9. Build frontend for production

```powershell
Set-Location "D:\College\Plant Diseas Pridiction\frontend"
npm run build
```
