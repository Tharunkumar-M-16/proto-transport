// Expects:
//   "STATUS BUS101"             → passenger asking for bus status
//   "BUS101 Thiruvanmiyur"      → driver updating location
function parseSms(text) {
  if (!text) return null;
  const parts = text.trim().split(/\s+/);
  if (parts.length < 2) return null;

  const first = parts[0].toUpperCase();

  if (first === 'STATUS') {
    return { type: 'status', busId: parts[1].toUpperCase() };
  }

  return { type: 'location', busId: first, stopName: parts.slice(1).join(' ') };
}

module.exports = parseSms;
