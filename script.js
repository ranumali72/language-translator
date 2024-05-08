let lastRequestTime = 0;
const REQUEST_INTERVAL = 1000; // 1 second

async function translateText() {
    const text = inputText.value;
    const sourceLang = await detectLanguage(text); // Detect input language
    const targetLang = targetLangSelect.value; // Get target language from dropdown

    // Check if it's been less than 1 second since the last request
    if (Date.now() - lastRequestTime < REQUEST_INTERVAL) {
        console.log('Too many requests. Please wait before making another request.');
        return;
    }

    // If it's been at least 1 second, proceed with the request
    lastRequestTime = Date.now();

    const translation = await translate(text, sourceLang, targetLang); // Translate text

    outputText.textContent = translation;
}

async function detectLanguage(text) {
    const url = 'https://google-translate1.p.rapidapi.com/language/translate/v2/detect';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Key': '6a1f95eee7msh37ef0d2ae99fc57p1dbe71jsn2f43fd90d6c0',
            'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        },
        body: new URLSearchParams({
            q: text
        })
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Failed to detect language');
        }
        const result = await response.json();
        return result.data.detections[0][0].language;
    } catch (error) {
        console.error('Language detection error:', error);
        return null;
    }
}

async function translate(text, sourceLang, targetLang) {
    const url = 'https://google-translate1.p.rapidapi.com/language/translate/v2';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Key': '6a1f95eee7msh37ef0d2ae99fc57p1dbe71jsn2f43fd90d6c0',
            'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        },
        body: new URLSearchParams({
            q: text,
            target: targetLang,
            source: sourceLang
        })
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Failed to translate text');
        }
        const result = await response.json();
        return result.data.translations[0].translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        return 'Translation error';
    }
}

// Function to fetch supported languages and populate dropdowns
async function fetchSupportedLanguages() {
    const url = 'https://google-translate1.p.rapidapi.com/language/translate/v2/languages';
    const options = {
        method: 'GET',
        headers: {
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Key': '6a1f95eee7msh37ef0d2ae99fc57p1dbe71jsn2f43fd90d6c0',
            'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        const languages = result.data.languages;

        languages.forEach(language => {
            // Create option element for source language
            const sourceOption = document.createElement('option');
            sourceOption.value = language.language;
            sourceOption.textContent = language.name;
            document.getElementById('sourceLang').appendChild(sourceOption);

            // Create option element for target language
            const targetOption = document.createElement('option');
            targetOption.value = language.language;
            targetOption.textContent = language.name;
            document.getElementById('targetLang').appendChild(targetOption);
        });
    } catch (error) {
        console.error('Error fetching supported languages:', error);
    }
}

// Call fetchSupportedLanguages function to populate dropdowns
fetchSupportedLanguages();

const inputText = document.getElementById('inputText');
const targetLangSelect = document.getElementById('targetLang');
const outputText = document.getElementById('outputText');

inputText.addEventListener('input', translateText);
targetLangSelect.addEventListener('change', translateText);
