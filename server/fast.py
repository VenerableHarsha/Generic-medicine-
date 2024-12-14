import easyocr
import pandas as pd
from rapidfuzz import process, fuzz
import re
from fastapi import FastAPI, File, UploadFile, Body
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn

# Input model for JSON request
class InputModel(BaseModel):
    name: str

app = FastAPI()

def clean_text(text):
    if pd.isna(text):
        return ""
    # Remove non-alphanumeric characters except spaces, convert to lowercase
    return re.sub(r'[^a-zA-Z0-9\s]', '', str(text).lower()).strip()

def normalize_text(text):
    # Sort words alphabetically after cleaning
    return " ".join(sorted(clean_text(text).split()))

def preprocess_dataset(dataset_names):
    return [normalize_text(name) for name in dataset_names]

def find_word_level_matches(input_name, dataset_names, normalized_dataset, limit=5):
    # Normalize the input only for matching purposes
    normalized_input = normalize_text(input_name)
    # Use rapidfuzz to find the best matches with normalized dataset
    matches = process.extract(normalized_input, normalized_dataset, scorer=fuzz.token_set_ratio, limit=limit)
    # Retrieve original names using match indices
    results = [(dataset_names[idx], score) for _, score, idx in matches]
    return results

@app.post("/image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # OCR processing
        reader = easyocr.Reader(['en'])
        result = reader.readtext(await file.read(), detail=0)  # Only extract text
        full_text = " ".join(result)  # Combine detected text

        # Load dataset and preprocess
        file_path = "generic.csv"  # Replace with your file path
        data = pd.read_csv(file_path)
        if 'DRUG NAME' not in data.columns:
            return JSONResponse(content={"error": "The CSV file must contain a 'DRUG NAME' column."}, status_code=400)
        
        dataset_names = data['DRUG NAME'].tolist()
        normalized_dataset = preprocess_dataset(dataset_names)

        # Find matches
        matches = find_word_level_matches(full_text, dataset_names, normalized_dataset)
        respond = {original_name: data.loc[data['DRUG NAME'] == original_name, 'DRUG PRICE'].iloc[0]
                   for original_name, score in matches}
        return JSONResponse(content=respond)

    except FileNotFoundError:
        return JSONResponse(content={"error": f"The file '{file_path}' was not found."}, status_code=404)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/submit-json/")
async def submit_json(input: InputModel = Body(...)):
    try:
        # Load dataset and preprocess
        file_path = "generic.csv"  # Replace with your file path
        data = pd.read_csv(file_path)
        if 'DRUG NAME' not in data.columns:
            return JSONResponse(content={"error": "The CSV file must contain a 'DRUG NAME' column."}, status_code=400)
        
        dataset_names = data['DRUG NAME'].tolist()
        normalized_dataset = preprocess_dataset(dataset_names)

        # Find matches
        input_name = input.name
        matches = find_word_level_matches(input_name, dataset_names, normalized_dataset)
        respond = {original_name: data.loc[data['DRUG NAME'] == original_name, 'DRUG PRICE'].iloc[0]
                   for original_name, score in matches}
        return JSONResponse(content=respond)

    except FileNotFoundError:
        return JSONResponse(content={"error": f"The file '{file_path}' was not found."}, status_code=404)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Run the application
if __name__ == "__main__":
    uvicorn.run("fast:app", host="0.0.0.0", port=8000, reload=True)
