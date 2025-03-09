let video;

function startWebcam() {
    video = document.getElementById('webcam');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(console.error);
}

function captureImage() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    fetch('/capture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        alert("Image captured successfully!");
        document.getElementById('captured-image').src = imageData;
        document.getElementById('captured-image').style.display = 'block';
    })
    .catch(console.error);
}

function performOCR() {
    clearOCRResult();
    showLoading();
    disableButton();
    fetch('/camocr', {
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
