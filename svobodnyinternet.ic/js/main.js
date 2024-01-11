let currentReward = 0;
let level = 1;

class PriceCalculator {
    constructor() {
        this.prices = {
            iron: [3700, 7800, 10920],
            zinc: [4100, 7800, 10920],
            aluminium: [2100, 3500, 4550],
            copper: [3900, 7800, 10920],
            gold: [40000, 40000, 40000],
            tin: [9900, 11000, 13000],
        };
    }

    getPrice(material, count, level) {
        if (!(material in this.prices)) {
            throw new Error('Zadaný materiál není podporován.');
        }

        const materialPrices = this.prices[material];
        if (level < 1 || level > materialPrices.length) {
            throw new Error('Zadaný level není podporován.');
        }
        const materialPrice = materialPrices[level - 1];

        return materialPrice * count;
    }
}

function calculateTotalPrice() {
    const ironCount = parseInt(document.getElementById('ironCount').value, 10) || 0;
    const zincCount = parseInt(document.getElementById('zincCount').value, 10) || 0;
    const aluminiumCount = parseInt(document.getElementById('aluminiumCount').value, 10) || 0;
    const copperCount = parseInt(document.getElementById('copperCount').value, 10) || 0;
    const goldCount = parseInt(document.getElementById('goldCount').value, 10) || 0;
    const tinCount = parseInt(document.getElementById('tinCount').value, 10) || 0;

    const calculator = new PriceCalculator();

    try {
        const ironPrice = calculator.getPrice('iron', ironCount, level);
        const zincPrice = calculator.getPrice('zinc', zincCount, level);
        const aluminiumPrice = calculator.getPrice('aluminium', aluminiumCount, level);
        const copperPrice = calculator.getPrice('copper', copperCount, level);
        const goldPrice = calculator.getPrice('gold', goldCount, level);
        const tinPrice = calculator.getPrice('tin', tinCount, level);

        const totalPrice = ironPrice + zincPrice + aluminiumPrice + copperPrice + goldPrice + tinPrice;

        const rewardElement = document.getElementById('reward');
        animateValue(rewardElement, currentReward, totalPrice, 1000, true);

        currentReward = totalPrice;
    } catch (error) {
        console.error(`Došlo k chybě: ${error.message}`);
    }
}

const inputElements = document.querySelectorAll('input');
inputElements.forEach((input) => {
    input.addEventListener('input', calculateTotalPrice);
});

calculateTotalPrice();

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