const transformString = (str, N) => {
    if (N <= 0) N = 1;
    const skipPositions = new Set();
    
    // Populate positions to skip
    for (let i = 1; i <= str.length; i++) {
        if (i % N === 0) skipPositions.add(i - 1);
    }

    // Prepare characters to reverse
    const charsToReverse = [...str].filter((_, i) => !skipPositions.has(i));
    const reversedChars = [...charsToReverse].reverse();

    // Rebuild the string
    return [...str].map((char, i) => 
        skipPositions.has(i) ? char : reversedChars.shift()
    ).join('');
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mainForm');
    const historyList = document.getElementById('historyList');
    const toggle = document.getElementById('toggleMode');

    // Toggle between roll number and custom N
    toggle.addEventListener('change', () => {
        document.getElementById('rollGroup').style.display = 
            toggle.checked ? 'none' : 'block';
        document.getElementById('customNGroup').style.display = 
            toggle.checked ? 'block' : 'none';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Input values
        const inputString = document.getElementById('inputString').value;
        const useCustom = toggle.checked;
        
        // Calculate N
        let N;
        if (useCustom) {
            N = parseInt(document.getElementById('customN').value, 10) || 1;
        } else {
            const rollNumber = document.getElementById('rollNumber').value;
            const digits = [...rollNumber].filter(c => /\d/.test(c)).map(Number);
            N = digits.reduce((acc, val) => acc + val, 0) || 1;
        }

        // Transform string
        const transformed = transformString(inputString, N);
        
        // Add to history
        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `
            <div>
                <strong>Original:</strong> ${inputString}<br>
                <strong>Transformed:</strong> ${transformed}
            </div>
            <small>N=${N}</small>
        `;
        historyList.prepend(li);

        // Clear inputs
        form.reset();
        document.getElementById('rollNumber').value = '22F-3672';
    });
});