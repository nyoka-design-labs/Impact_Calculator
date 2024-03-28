function calculateAndDisplayWaste() {
    const numberOfGlowSticks = document.getElementById("numberOfGlowSticks").value;
    const plasticWaste = numberOfGlowSticks * 15; // Assuming 15 grams of plastic waste per glow stick
    const chemicalWaste = numberOfGlowSticks * 5; // Assuming 5 grams of chemical waste per glow stick

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<p>Plastic Waste: ${plasticWaste} grams</p>
                           <p>Chemical Waste: ${chemicalWaste} grams</p>`;
}
