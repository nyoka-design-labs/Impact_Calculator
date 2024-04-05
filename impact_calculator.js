let gwpChart;
let pecChart;


document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from causing a page reload
    calculateAndDisplayWaste();
});

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from causing a page reload
    calculateAndDisplayWaste();

    // Scroll to the top of the form
    window.scrollTo({
        top: event.target.offsetTop,
        behavior: 'smooth'
    });
});

function multiplyMapValues(map, factor) {
    let sum = 0;
    map.forEach((value) => {
      sum += value * factor;
    });
    return sum;
  }
  function updateChart(chart, newData) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data = newData; // Update the dataset data
    });
    chart.update();
}

function calculateAndDisplayWaste() {
    const numberOfGlowSticks = document.getElementById("numberOfGlowSticks").value;
    const csl_weight = 20 / 1000; // kg/product PLACEHOLDER VALUE
    const lb_weight = 20 / 1000; // kg/product PLACEHOLDER VALUE

    const csl_pi = new Map([ // Cyulum snap lights product impact
        ["p", 15], // g
        ["pp", 2], // g
        ["hr", 10.6] // ml
    ])

    const csl_gwp = new Map([ // Cyulum snap lights global warming potential (kg CO2/kg product)
        ["ldpe", 0.0798],
        ["h202", 0.01743],
        ["glass", 0.1271646424]
    ])

    const csl_pec = new Map([ // Cyulum snap lights primary energy consumption (MJ/kg product)
        ["ldpe", 1.281],
        ["h202", 0.307468],
        ["glass", 0.0219]
    ])

    const lb_gwp = new Map([ // Lux bio glow global warming potential (kg CO2/kg product)
        ["pha", 0],
        ["average_enzyme", 0.01446]
    ])

    const lb_pec = new Map([ // Lux bio glow primary energy consumption (MJ/kg product)
        ["pha", 0],
        ["average_enzyme", 0.189]
    ])
    // Raw values Production Imapct
    csl_gwp_total = multiplyMapValues(csl_gwp, (csl_weight * numberOfGlowSticks));
    csl_pec_total = multiplyMapValues(csl_pec, (csl_weight * numberOfGlowSticks));

    lb_gwp_total = multiplyMapValues(lb_gwp, (lb_weight * numberOfGlowSticks));
    lb_pec_total = multiplyMapValues(lb_pec, (lb_weight * numberOfGlowSticks));


    // Percecnt Difference Values Production Imapct
    gwp_per_diff = ((lb_gwp_total - csl_gwp_total) / (lb_gwp_total + csl_gwp_total)) * 100;
    pec_per_diff = ((lb_pec_total - csl_pec_total) / (lb_pec_total + csl_pec_total)) * 100;

    // Raw Values Product Impact
    csl_p = (csl_pi.get("p") + csl_pi.get("pp")) * numberOfGlowSticks;
    csl_hr = csl_pi.get("hr") * numberOfGlowSticks;
    
    const resultHTML = `
        <h3 style="text-align: center;">Impact Comparison</h3>
        <p><strong>Global Warming Potential (kg CO2):</strong></p>
        <p>Cyulum Snap Lights: ${Number(csl_gwp_total.toFixed(3)).toLocaleString()} kg</p>
        <p>Lux Bio Glow: ${Number(lb_gwp_total.toFixed(3)).toLocaleString()} kg<p>
        <p>Percent Difference: ${Number(gwp_per_diff.toFixed(3)).toLocaleString()}%<p>
        <p><strong>Primary Energy Consumption (MJ):</strong></p>
        <p>Cyulum Snap Lights: ${Number(csl_pec_total.toFixed(3)).toLocaleString()} MJ</p>
        <p>Lux Bio Glow: ${Number(lb_pec_total.toFixed(3)).toLocaleString()} MJ<p>
        <p>Percent Difference: ${Number(pec_per_diff.toFixed(3)).toLocaleString()}%<p>
        <p><strong>Competitor Plastic Usage (kg):</strong> ${Number(csl_p.toFixed(0)).toLocaleString()} kg</p>
        <p><strong>Competitor Harmful Reagents (ml):</strong> ${Number(csl_hr.toFixed(0)).toLocaleString()} ml</p>
    `;

    document.body.style.height = "auto"; // prevents cutoff from top of page

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = resultHTML;

    const chartDiv = document.getElementById("charts");
    chartDiv.innerHTML = `<canvas id="gwpChart"></canvas><canvas id="pecChart"></canvas>`
    initCharts();

    updateChart(gwpChart, [csl_gwp_total, lb_gwp_total]);
    updateChart(pecChart, [csl_pec_total, lb_pec_total]);
}

function initCharts() {
    // Render GWP Chart
    const gwpCtx = document.getElementById('gwpChart').getContext('2d');
    gwpChart = new Chart(gwpCtx, {
        type: 'bar',
        data: {
            labels: ['Cyulum Snap Lights', 'Lux Bio Glow'],
            datasets: [{
                label: 'Global Warming Potential (kg CO2)',
                data: [], // Initialize with empty data
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Global Warming Potential Comparison',
                    font: { size: 18 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'kg CO2'
                    }
                }
            }
        }
    });

    // Render PEC Chart
    const pecCtx = document.getElementById('pecChart').getContext('2d');
    pecChart = new Chart(pecCtx, {
        type: 'bar',
        data: {
            labels: ['Cyulum Snap Lights', 'Lux Bio Glow'],
            datasets: [{
                label: 'Primary Energy Consumption (MJ)',
                data: [], // Initialize with empty data
                backgroundColor: ['rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Primary Energy Consumption Comparison',
                    font: { size: 18 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'MJ'
                    }
                }
            }
        }
    });
}



