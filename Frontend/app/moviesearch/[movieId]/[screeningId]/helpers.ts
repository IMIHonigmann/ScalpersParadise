export function generateRowsWithBoxes() {
  const rowStructure = [
    { rowId: 1, cols: 7 },
    { rowId: 2, cols: 6 },
    { rowId: 3, cols: 9 },
    { rowId: 4, cols: 6 },
    { rowId: 5, cols: 3 },
  ];
  let id = 1;
  const rows = rowStructure.map(row => {
    const rowBoxes = [];

    for (let col = 1; col <= row.cols; col++) {
      let normalizedValue;

      if (row.cols % 2 === 0) {
        // Even number of columns - two middle columns
        const middleLeft = row.cols / 2;
        const middleRight = middleLeft + 1;

        const distanceLeft = Math.abs(col - middleLeft);
        const distanceRight = Math.abs(col - middleRight);
        const distanceFromMiddle = Math.min(distanceLeft, distanceRight);

        const maxDistance = row.cols / 2;
        normalizedValue = 1 - distanceFromMiddle / maxDistance;
      } else {
        // Odd number of columns - one middle column
        const middle = Math.ceil(row.cols / 2);
        const distanceFromMiddle = Math.abs(col - middle);
        const maxDistance = Math.floor(row.cols / 2);
        normalizedValue = 1 - distanceFromMiddle / maxDistance;
      }

      const color = normalizedValue >= 0 ? normalizedValue * 2 : 0;

      rowBoxes.push({
        id: id++,
        color: `hsl(${(color * 25) % 360}, 70%, 60%)`,
        value: normalizedValue.toFixed(2),
      });
    }

    return {
      rowId: row.rowId,
      cols: row.cols,
      boxes: rowBoxes,
    };
  });

  return rows;
}
