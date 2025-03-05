let loadingInterval;

function handlePaste(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
        if (item.type.indexOf("image") === 0) {
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.getElementById("pasted-image");
                img.src = event.target.result;
                img.style.display = "block";
            };
            reader.readAsDataURL(blob);
        }
    }
}

function saveImage() {
    const img = document.getElementById("pasted-image");
    if (img.src) {
        fetch('/save_pasted_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: img.src })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            alert("Image saved successfully!");
        })
        .catch(console.error);
    } else {
        alert("No image to save!");
    }
}

function performOCR() {
    clearOCRResult();
    showLoading();
    disableButton();
    fetch('/imgocr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('ocr-result').innerText = data.result;
        hideLoading();
        enableButton();
    })
    .catch(error => {
        console.error(error);
        hideLoading();
        enableButton();
    });
}

function showLoading() {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';
    let dots = 0;
    loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        loadingElement.innerText = 'Loading' + '.'.repeat(dots);
    }, 500);
}

function hideLoading() {
    clearInterval(loadingInterval);
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'none';
}

function clearOCRResult() {
    document.getElementById('ocr-result').innerText = '';
}

function disableButton() {
    const button = document.querySelector('button[onclick="performOCR()"]');
    button.disabled = true;
    button.style.backgroundColor = '#cccccc';
}

function enableButton() {
    const button = document.querySelector('button[onclick="performOCR()"]');
    button.disabled = false;
    button.style.backgroundColor = '#007bff';
}