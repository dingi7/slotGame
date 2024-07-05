import { Text } from "@pixi/react";
import { TextStyle } from "@pixi/text";

type Props = {
  tempWinning: number;
  slotHeight: number;
  windowWidth: number;
  isMobile: boolean;
  winningMatrix: boolean[][];
};

const SlotMachineWinText = ({
  tempWinning,
  isMobile,
  slotHeight,
  windowWidth,
  winningMatrix,
}: Props) => {

  const columnWidth = windowWidth / 3;
  let textX = windowWidth / 5.1;
  let textY = slotHeight * 1.5;

  const checkDiagonalWin = (matrix: boolean[][]): boolean[] => {
    const diagonal1 = matrix[0][0] && matrix[1][1] && matrix[2][2];
    const diagonal2 = matrix[0][2] && matrix[1][1] && matrix[2][0];
    return [diagonal1, diagonal2];
  };

  const checkVerticalWin = (matrix: boolean[][]): boolean[] => {
    return matrix[0].map(
      (_, colIndex) =>
        matrix[0][colIndex] && matrix[1][colIndex] && matrix[2][colIndex]
    );
  };
  const [diagonal1, diagonal2] = checkDiagonalWin(winningMatrix);

  if (diagonal1 || diagonal2) {
    textX = windowWidth / 5.1;
    textY = slotHeight * 1.5;
  } else {
    const verticalWins = checkVerticalWin(winningMatrix);
    for (let col = 0; col < 3; col++) {
      if (verticalWins[col]) {
        const x = columnWidth * (col + 0.5);
        textX = (x + slotHeight * col) / 3.05;
        textY = slotHeight * 1.5;
        break;
      }
    }

    for (let row = 0; row < 3; row++) {
      const horizontalWin = winningMatrix[row].every((cell) => cell);
      if (horizontalWin) {
        textY = slotHeight * (row + 0.5);
        break;
      }
    }
  }

  return (
    <>
      <Text
        text={tempWinning.toString() || "10"}
        x={textX}
        y={textY}
        anchor={0.5}
        style={
          new TextStyle({
            align: "center",
            fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
            fontSize: isMobile ? 45 : 70,
            fontWeight: "400",
            fill: ["#ffffff", "#F8DE22"], // gradient
            stroke: "black",
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "#ccced2",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
          })
        }
      />
    </>
  );
};

export default SlotMachineWinText;
