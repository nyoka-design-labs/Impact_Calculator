let gwpChart;
let pecChart;


document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from causing a page reload
    calculateAndDisplayWaste();
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
        ["p", 0.015], // g
        ["pp", 0.002], // g
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
        ["pha", 0.01],
        ["average_enzyme", 0.01446]
    ])

    const lb_pec = new Map([ // Lux bio glow primary energy consumption (MJ/kg product)
        ["pha", 0.5],
        ["average_enzyme", 0.189]
    ])
    // Raw values Production Imapct
    csl_gwp_total = multiplyMapValues(csl_gwp, (csl_weight * numberOfGlowSticks));
    csl_pec_total = multiplyMapValues(csl_pec, (csl_weight * numberOfGlowSticks));

    lb_gwp_total = multiplyMapValues(lb_gwp, (lb_weight * numberOfGlowSticks));
    lb_pec_total = multiplyMapValues(lb_pec, (lb_weight * numberOfGlowSticks));

    // Differences
    gwp_difference = csl_gwp_total - lb_gwp_total;
    pec_difference = csl_pec_total - lb_pec_total;
    // Percecnt Difference Values Production Imapct
    gwp_per_diff = ((csl_gwp_total - lb_gwp_total) / (lb_gwp_total + csl_gwp_total)) * 100;
    pec_per_diff = ((lb_pec_total - csl_pec_total) / (lb_pec_total + csl_pec_total)) * 100;
    
    // Raw Values Product Impact
    csl_p = (csl_pi.get("p") + csl_pi.get("pp")) * numberOfGlowSticks;
    csl_hr = csl_pi.get("hr") * numberOfGlowSticks;
    
    const resultHTML = `
        <div class="header-div">
        <h3>Impact summary for ${Number(numberOfGlowSticks).toLocaleString()} glow sticks</h3>
        </div>

        <div class="data-div">
        <p><b>${Number(csl_p.toFixed(2)).toLocaleString()}</b> kgs plastic</p>
        <p><b>${Number(csl_hr.toFixed(0)).toLocaleString()}</b> ml harmful chemicals</p>
        <p><b>${Number(csl_gwp_total.toFixed(2)).toLocaleString()}</b> kg CO2</p>
        </div>

        <div class="header-div">
        <h3>We can reduce your impact by ~92%</h3>
        </div>

        <div class="graph-div" style="width:50%; float:left;">
        <p class="data" style="font-size: 20px;"><b>Plastic Pollution</b></p>
        <p class="data" style="font-size: 20px;"><b>100% reduction</b></p>
        <br>
        <p class="data">Snap Light &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Lux Bio</p>
        <p class="data">${Number(csl_p.toFixed(2)).toLocaleString()} kg &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ${0} kg</p>
        <br>
        <div class="yellow-circle">
        <p class="data"><b>save ${Number(csl_p.toFixed(2)).toLocaleString()} kg plastic</b></p>
        <p class="data"><b>(100% reduction)</b></p>
        </div>
        <br>
        <div id="chart1">
        </div>
        </div>

        <div class="graph-div" style="width:50%; float:right;">
        <p class="data" style="font-size: 20px;"><b>Carbon Emissions</b></p>
        <p class="data" style="font-size: 20px;"><b>100% reduction</b></p>
        <br>
        <p class="data">Snap Light &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Lux Bio</p>
        <p class="data">${Number(csl_gwp_total.toFixed(2)).toLocaleString()} kg &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ${Number(lb_gwp_total.toFixed(2)).toLocaleString()} kg</p>
        <br>
        <div class="yellow-circle">
        <p class="data"><b>save ${Number(gwp_difference.toFixed(2)).toLocaleString()} kg CO2</b></p>
        <p class="data"><b>(${Number(gwp_per_diff.toFixed(0)).toLocaleString()}% reduction)</b></p>
        </div>
        <br>
        <div id="chart2">
        </div>
        </div>
    `;

    document.body.style.height = "auto"; // prevents cutoff from top of page

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = resultHTML;

    const chart1Div = document.getElementById("chart1");
    chart1Div.innerHTML = `<canvas id="gwpChart"></canvas>`

    const chart2Div = document.getElementById("chart2");
    chart2Div.innerHTML = `<canvas id="pecChart"></canvas>`

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
                backgroundColor: ['rgba(10, 10, 10, 0.2)', 'rgba(10, 10, 10, 0.2)'],
                borderColor: ['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Global Warming Potential',
                    font: { size: 18 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'kg CO2'
                    },
                    grid: {
                        display: false // Remove the background grid
                    }
                },
                x: {
                    grid: {
                        display: false // Remove the background grid
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
                backgroundColor: ['rgba(10, 10, 10, 0.2)', 'rgba(10, 10, 10, 0.2)'],
                borderColor: ['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Primary Energy Consumption',
                    font: { size: 18 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'MJ'
                    },
                    grid: {
                        display: false // Remove the background grid
                    }
                },
                x: {
                    grid: {
                        display: false // Remove the background grid
                    }
                }
            }
        }
    });
}



{/* <p style="font-size: 20px;"><strong>Global Warming Potential (kg CO2):</strong></p>
<p style="font-size: 20px;">Cyulum Snap Lights: ${Number(csl_gwp_total.toFixed(0)).toLocaleString()} kg</p>
<p style="font-size: 20px;">Lux Bio Glow: ${Number(lb_gwp_total.toFixed(0)).toLocaleString()} kg<p>
<p style="font-size: 20px;">Percent Difference: ${Number(gwp_per_diff.toFixed(0)).toLocaleString()}%<p>
<p style="font-size: 20px;"><strong>Primary Energy Consumption (MJ):</strong></p>
<p style="font-size: 20px;">Cyulum Snap Lights: ${Number(csl_pec_total.toFixed(0)).toLocaleString()} MJ</p>
<p style="font-size: 20px;">Lux Bio Glow: ${Number(lb_pec_total.toFixed(0)).toLocaleString()} MJ<p>
<p style="font-size: 20px;">Percent Difference: ${Number(pec_per_diff.toFixed(0)).toLocaleString()}%<p>
<p style="font-size: 20px;"><strong>Competitor Plastic Usage (kg):</strong> ${Number(csl_p.toFixed(0)).toLocaleString()} kg</p>
<p style="font-size: 20px;"><strong>Competitor Harmful Reagents (ml):</strong> ${Number(csl_hr.toFixed(0)).toLocaleString()} ml</p> */}