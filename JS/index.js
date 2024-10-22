const lineSelect = document.getElementById('lineSelect');
const directionSelect = document.getElementById('directionSelect');
const lineDiv = document.getElementById('line');
const stopIdContainer = document.getElementById('stopIdContainer');
const stopInfo = document.getElementById('stopInfo');
const confirmButton = document.getElementById('confirmButton');
const terminalDiv = document.getElementById('terminal');
const lineTimeDiv = document.getElementById('lineTime');

let selectedLineNumber = '1';
let selectedDirection = 'up';

function updateLineInfo() {
    Papa.parse('../busLine.csv', {
        download: true,
        header: false,
        complete: function(results) {
            const csvData = results.data;
            const selectedStops = csvData.filter(row => row[0] === selectedLineNumber && row[1] === selectedDirection);
            const stopNames = selectedStops.map(row => row[2]);
            lineDiv.textContent = selectedLineNumber;
            stopIdContainer.innerHTML = '';
            stopInfo.innerHTML = '';
            stopNames.forEach((stopName, index) => {
                const stopIdSpan = document.createElement('span');
                stopIdSpan.classList.add('stopId');
                stopIdSpan.textContent = index + 1;
                stopIdContainer.appendChild(stopIdSpan);
                const stopNameSpan = document.createElement('span');
                stopNameSpan.classList.add('stopName');
                stopNameSpan.textContent = stopName;
                if (stopName.length >= 8) {
                    stopNameSpan.classList.add('scroll-up-animation');
                }
                stopInfo.appendChild(stopNameSpan);
            });
            const terminalStop = stopNames[stopNames.length - 1];
            terminalDiv.textContent = terminalStop;
            if (terminalStop.length > 8) {
                terminalDiv.classList.add('scroll-left-animation');
            } else {
                terminalDiv.classList.remove('scroll-left-animation');
            }
        }
    });
}

function loadInitialTime() {
    Papa.parse('../busTime.csv', {
        download: true,
        header: false,
        complete: function(results) {
            const csvData = results.data;
            const initialTimeStops = csvData.filter(row => row[0] === selectedLineNumber && row[1] === selectedDirection);
            if (initialTimeStops.length > 0) {
                const time = initialTimeStops[0][2];
                lineTimeDiv.textContent = time;
            }
        }
    });
}

Papa.parse('../busLine.csv', {
    download: true,
    header: false,
    complete: function(results) {
        const csvData = results.data;
        const uniqueLineNumbers = [];
        csvData.forEach(row => {
            if (!uniqueLineNumbers.includes(row[0])) {
                uniqueLineNumbers.push(row[0]);
            }
        });
        uniqueLineNumbers.forEach(lineNumber => {
            const option = document.createElement('option');
            option.value = lineNumber;
            option.textContent = lineNumber;
            lineSelect.appendChild(option);
            if (lineNumber === selectedLineNumber) {
                option.selected = true;
            }
        });

        directionSelect.value = selectedDirection;

        updateLineInfo();
        loadInitialTime();
    }
});

directionSelect.addEventListener('change', () => {
    selectedDirection = directionSelect.value;
});

lineSelect.addEventListener('change', () => {
    selectedLineNumber = lineSelect.value;
});

confirmButton.addEventListener('click', () => {
    if (selectedLineNumber && selectedDirection) {

        Papa.parse('../busTime.csv', {
            download: true,
            header: false,
            complete: function(results) {
                const csvData = results.data;
                const selectedStops = csvData.filter(row => row[0] === selectedLineNumber && row[1] === selectedDirection);
                if (selectedStops.length > 0) {
                    const time = selectedStops[0][2];
                    lineTimeDiv.textContent = time;
                }
            }
        });
        updateLineInfo();
    }
});
