// Expects format: "BUS101 STOPNAME"
function parseSms(text) {
  if (!text) return null;
  const parts = text.trim().split(' ');
  if (parts.length < 2) return null;

  const busId = parts[0].toUpperCase();
  const stopName = parts.slice(1).join(' ');

  return { busId, stopName };
}

module.exports = parseSms;