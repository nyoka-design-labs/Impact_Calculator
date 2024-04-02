function multiplyMapValues(map, factor) {
    let sum = 0;
    map.forEach((value) => {
      sum += value * factor;
    });
    return sum;
  }

function calculateAndDisplayWaste() {
    const numberOfGlowSticks = document.getElementById("numberOfGlowSticks").value;

    const csl_gwp = new Map([ // Cyulum snap lights global warming potential
        ["ldpe", 0.0798],
        ["h202", 0.01743],
        ["glass", 0.1271646424]
    ])

    const csl_pec = new Map([ // Cyulum snap lights primary energy consumption
        ["ldpe", 1.281],
        ["h202", 0.307468],
        ["glass", 0.0219]
    ])

    const lb_gwp = new Map([ // Lux bio glow global warming potential
        ["pha", 0],
        ["average_enzyme", 0.01446]
    ])

    const lb_pec = new Map([ // Lux bio glow primary energy consumption
        ["pha", 0],
        ["average_enzyme", 0.189]
    ])

    a = multiplyMapValues(csl_gwp, numberOfGlowSticks);
    b = multiplyMapValues(csl_pec, numberOfGlowSticks);
    c = multiplyMapValues(lb_gwp, numberOfGlowSticks);
    d = multiplyMapValues(lb_pec, numberOfGlowSticks);

    gwp_diff = a-c;
    pec_diff = b-d;

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<p>Carbon emissions reduced by: <b>${gwp_diff.toFixed(3)}</b> kg CO2</p>
                           <p>Energy consumption reduced by: <b>${pec_diff.toFixed(3)}</b> MJ</p>`;
}
