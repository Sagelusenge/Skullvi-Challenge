export function formatApplicationReference(sequenceNumber, date = new Date()) {
  const year = date.getFullYear();
  return `SK-${year}-${String(sequenceNumber).padStart(4, '0')}`;
}

