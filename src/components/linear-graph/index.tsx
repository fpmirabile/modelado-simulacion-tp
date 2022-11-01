import { curveCatmullRom } from "d3-shape";
import * as React from "react";
import { CustomSVGSeries, DecorativeAxis, LineSeries, XYPlot } from "react-vis";
import { parser as mathParser, Parser, eigs } from "mathjs";
import { createRangeBetweenNumbers } from "../../util/math-helper";
import { MatrixValues } from "../../App";

const getValuesForFunction = (f: Parser) => {
  const result: { x: number; y: number }[] = [];
  const rangeNumbers = createRangeBetweenNumbers(-10, 10);
  rangeNumbers.forEach((num) => {
    const y = f.evaluate(`f(${num})`);
    result.push({ x: num, y });
  });

  return result;
};

interface PropTypes {
  isUsingDeterminant: boolean;
  xFunction: string;
  yFunction: string;
  matrixValues: MatrixValues;
  enableArrows: boolean;
}

export function LinearGraph({
  xFunction,
  yFunction,
  isUsingDeterminant,
  matrixValues,
  enableArrows,
}: PropTypes) {
  const xFunctionFinal = React.useCallback(() => {
    const { a, b } = matrixValues;
    return isUsingDeterminant
      ? `f(x)=${a < 0 || Math.abs(a) === 1 ? a * -1 : a}*x/${
          Math.abs(b) === 1 ? b * -1 : b
        }`
      : xFunction;
  }, [matrixValues, isUsingDeterminant, xFunction]);

  const yFunctionFinal = React.useCallback(() => {
    const { c, d } = matrixValues;
    return isUsingDeterminant
      ? `f(x)=${c < 0 || Math.abs(c) === 1 ? c * -1 : c}*x/${
          Math.abs(d) === 1 ? d * -1 : d
        }`
      : yFunction;
  }, [isUsingDeterminant, matrixValues, yFunction]);

  const calculateXNulclines = React.useCallback(() => {
    try {
      const parser = mathParser();
      parser.evaluate(xFunctionFinal());
      const xNulclines = getValuesForFunction(parser);
      parser.clear();
      parser.evaluate(yFunctionFinal());
      const yNulclines = getValuesForFunction(parser);
      return [xNulclines, yNulclines];
    } catch (e) {
      return [[{ x: 0, y: 0 }], [{ x: 0, y: 0 }]];
    }
  }, [xFunctionFinal, yFunctionFinal]);

  const calculateEigenVectors = React.useCallback(() => {
    const { a, b, c, d } = matrixValues;
    if (a === 0 && b === 0 && c === 0 && d === 0) {
      return [];
    }

    try {
      const matrix = [
        [a, b],
        [c, d],
      ];
      const eigen = eigs(matrix);
      const vectors = eigen.vectors as number[][];
      console.log(vectors);
      return [
        [vectors[0][0], vectors[0][1]],
        [vectors[1][0], vectors[1][1]],
      ];
    } catch {
      return [];
    }
  }, [matrixValues]);

  const arrows = React.useCallback(() => {
    const { a, b, c, d } = matrixValues;
    if (a === 0 && b === 0 && c === 0 && d === 0) {
      return [];
    }

    const derivativeX = `f(x, y)=${a}*x+${b}*y`;
    const derivativeY = `f(x, y)=${c}*x+${d}*y`;
    const up = "45deg";
    const down = "-135deg";
    const right = "135deg";
    const left = "-45deg";
    const parser = mathParser();
    parser.evaluate(derivativeX);
    const aboveXNumber = parser.evaluate("f(10, 0)");
    const aboveX = aboveXNumber > 0 ? right : left;

    const belowXNumber = parser.evaluate("f(-10, 0)");
    const belowX = belowXNumber > 0 ? right : left;

    parser.clear();
    parser.evaluate(derivativeY);
    const aboveYNumber = parser.evaluate("f(0, 10)");
    const aboveY = aboveYNumber > 0 ? up : down;

    const belowYNumber = parser.evaluate("f(0, -10)");
    const belowY = belowYNumber > 0 ? up : down;
    return [
      [
        { direction: aboveX, position: { x: 5, y: 10 } },
        { direction: belowX, position: { x: -5, y: -9 } },
      ],
      [
        { direction: aboveY, position: { x: 2, y: 10 } },
        { direction: belowY, position: { x: -1, y: -10 } },
      ],
    ];
  }, [matrixValues]);

  const eigenVectors = calculateEigenVectors();
  const v1 = !!eigenVectors[0] && [
    {
      x: eigenVectors[0][0] * 12,
      y: eigenVectors[0][1] * 12,
    },
    {
      x: -eigenVectors[0][0] * 12,
      y: -eigenVectors[0][1] * 12,
    },
  ];
  const v2 = !!eigenVectors[1] && [
    {
      x: eigenVectors[1][0] * 12,
      y: eigenVectors[1][1] * 12,
    },
    {
      x: -eigenVectors[1][0] * 12,
      y: -eigenVectors[1][1] * 12,
    },
  ];

  return (
    <div>
      {v1.some((value) => isNaN(value.x) || isNaN(value.y)) ||
        (v2.some((value) => isNaN(value.x) || isNaN(value.y)) && (
          <span>Numeros complejos (Imaginarios)</span>
        ))}
      <XYPlot height={600} width={1200}>
        <DecorativeAxis
          axisDomain={[-100, 100]}
          axisStart={{ x: -100, y: 0 }}
          axisEnd={{ x: 100, y: 0 }}
          tickValue={() => ""}
        />
        <DecorativeAxis
          axisDomain={[-100, 100]}
          axisStart={{ x: 0, y: -100 }}
          axisEnd={{ x: 0, y: 100 }}
        />
        <LineSeries
          className="first-series"
          data={calculateXNulclines()[0]}
          color="gray"
          curve={curveCatmullRom.alpha(0.5)}
          strokeStyle="dashed"
        />
        <LineSeries
          className="first-series"
          data={calculateXNulclines()[1]}
          color="gray"
          curve={curveCatmullRom.alpha(0.5)}
          strokeStyle="dashed"
        />
        <LineSeries
          color="red"
          data={[
            {
              x: 0,
              y: 0,
            },
            ...v1,
          ]}
        />
        <LineSeries
          color="green"
          data={[
            {
              x: 0,
              y: 0,
            },
            ...v2,
          ]}
        />
        {enableArrows &&
          arrows().map((arrows) => {
            return arrows.map((arrow) => {
              return (
                <CustomSVGSeries
                  className="custom-marking"
                  data={[arrow.position]}
                  customComponent={(row) => {
                    return (
                      <g
                        style={{ rotate: arrow.direction }}
                        className="inner-inner-component"
                      >
                        <path
                          d="M3.41 2H16V0H1a1 1 0 0 0-1 1v16h2V3.41l28.29 28.3 1.41-1.41z"
                          data-name="7-Arrow Up"
                        />
                      </g>
                    );
                  }}
                />
              );
            });
          })}
        {/* <CustomSVGSeries
          className="custom-marking"
          data={[
            { x: 2, y: 5 },
            { x: 3, y: 15 },
          ]}
          customComponent={(row) => {
            return (
              <g style={{ rotate: "-45deg" }} className="inner-inner-component">
                <path
                  d="M3.41 2H16V0H1a1 1 0 0 0-1 1v16h2V3.41l28.29 28.3 1.41-1.41z"
                  data-name="7-Arrow Up"
                />
              </g>
            );
          }}
        /> */}
      </XYPlot>
    </div>
  );
}
