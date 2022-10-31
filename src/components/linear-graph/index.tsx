import { curveCatmullRom } from "d3-shape";
import * as React from "react";
import {
  CustomSVGSeries,
  DecorativeAxis,
  HorizontalGridLines,
  LineSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from "react-vis";
import { parser as mathParser, Parser, eigs } from "mathjs";
import {
  createRangeBetweenNumbers,
  // quadraticSolver,
} from "../../util/math-helper";
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
  determinant: number;
  trace: number;
  xFunction: string;
  yFunction: string;
  matrixValues: MatrixValues;
}

export function LinearGraph({
  xFunction,
  yFunction,
  isUsingDeterminant,
  determinant,
  trace,
  matrixValues,
}: PropTypes) {
  const calculateXNulclines = React.useCallback(() => {
    try {
      const { a, b, c, d } = matrixValues;
      const parser = mathParser();
      const xFinalFunc = isUsingDeterminant
        ? `f(x)=${a < 0 || Math.abs(a) === 1 ? a * -1 : a}*x/${
            Math.abs(b) === 1 ? b * -1 : b
          }`
        : xFunction;
      parser.evaluate(xFinalFunc);
      const xNulclines = getValuesForFunction(parser);
      parser.clear();
      const yFinalFunction = isUsingDeterminant
        ? `f(x)=${c < 0 || Math.abs(c) === 1 ? c * -1 : c}*x/${
            Math.abs(d) === 1 ? d * -1 : d
          }`
        : yFunction;
      parser.evaluate(yFinalFunction);
      console.log("a", a, "c", c, "x", xFinalFunc, "y", yFinalFunction);
      const yNulclines = getValuesForFunction(parser);
      return [xNulclines, yNulclines];
    } catch (e) {
      return [[{ x: 0, y: 0 }], [{ x: 0, y: 0 }]];
    }
  }, [xFunction, yFunction, isUsingDeterminant, matrixValues]);

  const calculateEigenVectors = React.useCallback(() => {
    try {
      const a = [
        [matrixValues.a, matrixValues.b],
        [matrixValues.c, matrixValues.d],
      ];
      const eigen = eigs(a);
      const vectors = eigen.vectors as number[][];
      return [
        [vectors[0][0], vectors[0][1]],
        [vectors[1][0], vectors[1][1]],
      ];
    } catch {
      return [[0], [0]];
    }
  }, [matrixValues]);

  const eigenVectors = calculateEigenVectors();
  const v1 = !!eigenVectors[0] && {
    x: eigenVectors[0][0] * 12,
    y: eigenVectors[0][1] * 12,
  };
  const v2 = !!eigenVectors[1] && {
    x: eigenVectors[1][0] * 12,
    y: eigenVectors[1][1] * 12,
  };
  return (
    <div>
      <XYPlot height={600} width={1200}>
        <XAxis />
        <YAxis />
        <HorizontalGridLines />
        <VerticalGridLines />
        <DecorativeAxis
          axisDomain={[-100, 100]}
          axisStart={{ x: -100, y: 0 }}
          axisEnd={{ x: 100, y: 0 }}
        />
        <DecorativeAxis
          axisDomain={[-100, 100]}
          axisStart={{ x: 0, y: -100 }}
          axisEnd={{ x: 0, y: 100 }}
        />
        <LineSeries
          className="first-series"
          data={calculateXNulclines()[0]}
          color="red"
          curve={curveCatmullRom.alpha(0.5)}
          strokeStyle="dashed"
        />
        <LineSeries
          className="first-series"
          data={calculateXNulclines()[1]}
          color="blue"
          curve={curveCatmullRom.alpha(0.5)}
          strokeStyle="dashed"
        />
        <LineSeries
          color="green"
          data={[
            {
              x: 0,
              y: 0,
            },
            v1,
          ]}
        />
        <LineSeries
          color="red"
          data={[
            {
              x: 0,
              y: 0,
            },
            v2
          ]}
        />
        <CustomSVGSeries
          className="custom-marking"
          data={[
            { x: 2, y: 5 },
            { x: 3, y: 15 },
          ]}
          customComponent={(row) => {
            return (
              <g
                style={{ rotate: row.x === 2 ? "45deg" : "150deg" }}
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
      </XYPlot>
    </div>
  );
}
