// Placeholder for future interactivity or animations.
// Currently, navigation scrolls smoothly to each section.
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

document
  .getElementById("calculator-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const height = parseFloat(document.getElementById("height").value);
    const width = parseFloat(document.getElementById("width").value);
    const ratio = height / width;
    const resolution = closestResolution(ratio);
    const resultElement = document.getElementById("result");
    if (resolution) {
      resultElement.textContent = `The closest resolution is ${resolution[0]}x${resolution[1]}`;
    } else {
      resultElement.textContent = "No valid resolution found.";
    }
  });

function closestResolution(ratio) {
  const targetArea = 1024 ** 2; // Area in pixels
  let minDifference = Infinity;
  let bestResolution = null;

  // Search through all valid dimensions that are multiples of 8
  for (let height = 8; height <= 1024 * 8; height += 8) {
    const width = Math.floor(height / ratio);
    if (width % 8 !== 0) {
      continue;
    }
    const area = height * width;
    if (Math.abs(area - targetArea) < minDifference) {
      minDifference = Math.abs(area - targetArea);
      bestResolution = [width, height];
    }
  }

  return bestResolution;
}
