function generateMatrixInput() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const matrixTable = document.getElementById('matrixTable');
    matrixTable.innerHTML = '';

    const table = document.createElement('table');
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.value = '0';
            input.id = `cell-${i}-${j}`;
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    matrixTable.appendChild(table);
}

function getMatrixFromInput(rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const cellValue = parseFloat(document.getElementById(`cell-${i}-${j}`).value);
            row.push(isNaN(cellValue) ? 0 : cellValue);
        }
        matrix.push(row);
    }
    return matrix;
}

function displayOutput(message) {
    document.getElementById('output').innerText = message;
}

function performGaussianElimination() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const matrix = getMatrixFromInput(rows, cols);

    const solution = gaussElimination(matrix, rows, cols);
    if (solution) {
        let outputMessage = "Solution:\n";
        solution.forEach((val, i) => {
            outputMessage += `x${i + 1} = ${val.toFixed(2)}\n`;
        });
        displayOutput(outputMessage);
    } else {
        displayOutput("No solution found or infinite solutions exist.");
    }
}

function gaussElimination(A, n, m) {
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
        }
        [A[i], A[maxRow]] = [A[maxRow], A[i]];

        if (Math.abs(A[i][i]) < 1e-10) continue;

        for (let k = i + 1; k < n; k++) {
            let factor = A[k][i] / A[i][i];
            for (let j = i; j < m; j++) A[k][j] -= factor * A[i][j];
        }
    }

    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        if (Math.abs(A[i][i]) > 1e-10) {
            x[i] = A[i][m - 1] / A[i][i];
            for (let j = i - 1; j >= 0; j--) A[j][m - 1] -= A[j][i] * x[i];
        } else {
            x[i] = 0;
        }
    }
    return x;
}

function calculateMatrixInverse() {
    const size = parseInt(document.getElementById('rows').value);
    if (size !== parseInt(document.getElementById('cols').value)) {
        displayOutput("Matrix must be square to calculate its inverse.");
        return;
    }
    
    const matrix = getMatrixFromInput(size, size);
    const identity = Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))
    );
    const aug = matrix.map((row, i) => row.concat(identity[i]));

    for (let i = 0; i < size; i++) {
        let pivot = aug[i][i];
        if (Math.abs(pivot) < 1e-10) {
            displayOutput("Matrix is not invertible.");
            return;
        }

        for (let j = 0; j < 2 * size; j++) aug[i][j] /= pivot;

        for (let k = 0; k < size; k++) {
            if (k !== i) {
                let factor = aug[k][i];
                for (let j = 0; j < 2 * size; j++) aug[k][j] -= factor * aug[i][j];
            }
        }
    }

    const inverse = aug.map(row => row.slice(size));
    let outputMessage = "Inverse Matrix:\n";
    inverse.forEach(row => {
        outputMessage += row.map(value => value.toFixed(2)).join(" ") + "\n";
    });
    displayOutput(outputMessage);
}
function gaussElimination(A, n, m) {
    let infiniteSolutions = false;

    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
        }
        [A[i], A[maxRow]] = [A[maxRow], A[i]];

        if (Math.abs(A[i][i]) < 1e-10) continue;

        for (let k = i + 1; k < n; k++) {
            let factor = A[k][i] / A[i][i];
            for (let j = i; j < m; j++) A[k][j] -= factor * A[i][j];
        }
    }

    const x = Array(n).fill(0);
    const isFreeVariable = Array(n).fill(false);

    // Проверяем, есть ли бесконечное количество решений
    for (let i = 0; i < n; i++) {
        if (A[i].slice(0, m - 1).every(val => Math.abs(val) < 1e-10)) {
            if (Math.abs(A[i][m - 1]) > 1e-10) {
                displayOutput("Система не имеет решений.");
                return null;
            } else {
                infiniteSolutions = true;
            }
        }
    }

    // Обратный ход метода Гаусса
    if (infiniteSolutions) {
        let x1_value = parseFloat(prompt("Введите значение для x1: "));
        if (isNaN(x1_value)) {
            displayOutput("Некорректное значение для x1.");
            return null;
        }

        x[0] = x1_value;
        for (let i = n - 1; i >= 0; i--) {
            if (i === 0) continue; // Пропускаем x1, так как оно уже задано

            if (Math.abs(A[i][i]) > 1e-10) {
                x[i] = (A[i][m - 1] - A[i].slice(i + 1, n).reduce((sum, coeff, j) => sum + coeff * x[j + i + 1], 0)) / A[i][i];
            } else {
                x[i] = 0;
                isFreeVariable[i] = true;
            }
        }

        let outputMessage = "Система имеет бесконечное количество решений. Частное решение при x1 = " + x1_value + ":\n";
        x.forEach((val, i) => {
            outputMessage += isFreeVariable[i] ? `x${i + 1} = любое значение (присвоено ${val.toFixed(2)})\n` : `x${i + 1} = ${val.toFixed(2)}\n`;
        });
        displayOutput(outputMessage);
    } else {
        for (let i = n - 1; i >= 0; i--) {
            x[i] = A[i][m - 1];
            for (let j = i + 1; j < n; j++) {
                x[i] -= A[i][j] * x[j];
            }
            x[i] /= A[i][i];
        }
        let outputMessage = "Система имеет одно решение:\n";
        x.forEach((val, i) => {
            outputMessage += `x${i + 1} = ${val.toFixed(2)}\n`;
        });
        displayOutput(outputMessage);
    }

    return x;
}
