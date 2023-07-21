window.addEventListener("load", () => updateDeliveryDate(1));

function formatMoney(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".").concat(',- Kč');
}

function animateValue(obj, start, end, duration, moneyFormat = false) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        let newValue = Math.floor(progress * (end - start) + start);
        if (moneyFormat) {
            newValue = formatMoney(newValue);
        }
        obj.innerHTML = newValue;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

const countInput = document.getElementById('count');
const priceElement = document.getElementById('price');

countInput.addEventListener('input', () => {
    let count = parseInt(countInput.value);
    if (isNaN(count) || count <= 0) {
        count = 1;
    }

    const startPrice = parseInt(priceElement.textContent.replace(/\D/g, ''));

    const endPrice = getPrice(count);

    animateValue(priceElement, startPrice, endPrice, 1000, true);
    updateDeliveryDate(count);
});

function getPrice(quantity) {
    if (quantity <= 0) {
        return 0;
    } else if (quantity === 1) {
        return 7083978;
    } else if (quantity === 2) {
        return 7083978 + 6775979;
    } else {
        const priceForTwoPieces = 7083978 + 6775979;
        const pricePerPiece = 6591180;
        return priceForTwoPieces + (quantity - 2) * pricePerPiece;
    }
}

function findLatestDate() {
    // Najdeme tabulku podle jejího ID
    const table = document.getElementById("orderTable");

    // Pokud je tabulka prázdná nebo neexistuje, vrátíme null
    if (!table) {
        return null;
    }

    // Najdeme všechny buňky s datem dodání
    const dateCells = table.querySelectorAll("td[data-date]");

    // Pokud nejsou žádná data, vrátíme null
    if (dateCells.length === 0) {
        return null;
    }

    // Nastavíme výchozí hodnotu pro nejnovější datum jako první buňku
    let latestDate = new Date(dateCells[0].getAttribute("data-date"));

    // Projdeme všechny buňky s daty a porovnáme jejich hodnoty
    dateCells.forEach(cell => {
        const cellDate = new Date(cell.getAttribute("data-date"));
        if (cellDate > latestDate) {
            latestDate = cellDate;
        }
    });

    return latestDate;
}

// Funkce pro získání data o počtu dní v budoucnosti
function getDeliveryDate(count) {
    const latestDate = findLatestDate();

    // Pokud nemáme žádná data v tabulce, použijeme aktuální datum
    if (latestDate === null) {
        const today = new Date();
        today.setDate(today.getDate() + count + 1);
        return today;
    }

    // Přidáme počet dní k poslednímu datumu
    const deliveryDate = new Date(latestDate);
    deliveryDate.setDate(deliveryDate.getDate() + count + 1);
    return deliveryDate;
}

// Funkce pro aktualizaci zobrazeného data
function updateDeliveryDate(count) {
    const deliveryDate = getDeliveryDate(count);

    const deliveryDateElement = document.getElementById("delivery-date");
    deliveryDateElement.textContent = deliveryDate.toLocaleDateString();
}