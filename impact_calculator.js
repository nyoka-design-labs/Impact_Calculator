function multiplyMapValues(map, factor) {
    let sum = 0;
    map.forEach((value) => {
      sum += value * factor;
    });
    return sum;
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
    csl_gwp_total = multiplyMapValues(csl_gwp, csl_weight); // SHOW THIS VALUE
    csl_pec_total = multiplyMapValues(csl_pec, csl_weight); // SHOW THIS VALUE

    lb_gwp_total = multiplyMapValues(lb_gwp, lb_weight); // SHOW THIS VALUE
    lb_pec_total = multiplyMapValues(lb_pec, lb_weight); // SHOW THIS VALUE


    // Percecnt Difference Values Production Imapct
    gwp_per_diff = ((lb_gwp_total - csl_gwp_total) / (lb_gwp_total + csl_gwp_total)) * 100; // SHOW THIS VALUE
    pec_per_diff = ((lb_pec_total - csl_pec_total) / (lb_pec_total + csl_pec_total)) * 100; // SHOW THIS VALUE

    // Raw Values Product Impact
    csl_p = (csl_pi.get("p") + csl_pi.get("pp")) * numberOfGlowSticks; // SHOW THIS VALUE
    csl_hr = csl_pi.get("hr") * numberOfGlowSticks; // SHOW THIS VALUE
    
    const resultHTML = `
        <h3>Impact Comparison</h3>
        <p><strong>Global Warming Potential (kg CO2):</strong></p>
        <p>Cyulum Snap Lights: ${csl_gwp_total} kg</p>
        <p>Lux Bio Glow: ${lb_gwp_total} kg<p>
        <p>Percent Difference: ${gwp_per_diff}%<p>
        <p><strong>Primary Energy Consumption (MJ):</strong></p>
        <p>Cyulum Snap Lights: ${csl_pec_total} MJ</p>
        <p>Lux Bio Glow: ${lb_pec_total} MJ<p>
        <p>Percent Difference: ${pec_per_diff}%<p>
        <p><strong>Competitor Plastic Usage (kg):</strong> ${csl_p} kg</p>
        <p><strong>Competitor Harmful Reagents (ml):</strong> ${csl_hr} ml</p>
    `;
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = resultHTML;
    
}
