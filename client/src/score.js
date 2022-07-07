
function calculateGameScore(totalWords, elapsedSeconds, correctWords) {
    const grossWPM = totalWords / (elapsedSeconds / 60);
    const accuracy = correctWords / totalWords;
    const netWPM = grossWPM * accuracy;
    return {grossWPM, accuracy, netWPM}
}
export default calculateGameScore;