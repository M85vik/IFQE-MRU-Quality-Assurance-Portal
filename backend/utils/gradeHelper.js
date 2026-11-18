/**
 * Grade helper utility for IFQE MRU Quality Assurance Portal.
 * Rules provided:
 * Below 30%: D
 * 30% - 39.99%: C
 * 40% - 49.99%: C+
 * 50% - 59.99%: B
 * 60% - 69.99%: B+
 * 70% - 79.99%: A
 * 80% - 89.99%: A+
 * 90% above: A++
 */

function calculateGrade(percentage) {
  if (percentage === undefined || percentage === null || isNaN(percentage)) {
    return 'D';
  }
  const val = Number(percentage);
  if (val >= 90) return 'A++';
  if (val >= 80) return 'A+';
  if (val >= 70) return 'A';
  if (val >= 60) return 'B+';
  if (val >= 50) return 'B';
  if (val >= 40) return 'C+';
  if (val >= 30) return 'C';
  return 'D';
}

module.exports = {
  calculateGrade
};
