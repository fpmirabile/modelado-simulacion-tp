import { curveCatmullRom } from "d3-shape";
import * as React from "react";
import {
  CustomSVGSeries,
  HorizontalGridLines,
  LineSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from "react-vis";
import { parser as mathParser, Parser, eigs, transpose, column, multiply } from "mathjs";
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
      const parser = mathParser();
      parser.evaluate(
        isUsingDeterminant
          ? `f(x)=(${matrixValues.a}x)/${matrixValues.b > 0 ? "-" : ""}${
              matrixValues.b
            }`
          : xFunction
      );
      const xNulclines = getValuesForFunction(parser);
      parser.clear();
      parser.evaluate(
        isUsingDeterminant
          ? `f(x)=(${matrixValues.c}x)/${matrixValues.d > 0 ? "-" : ""}${
              matrixValues.d
            }`
          : yFunction
      );
      const yNulclines = getValuesForFunction(parser);
      return [xNulclines, yNulclines];
    } catch (e) {
      return [];
    }
  }, [xFunction, yFunction, isUsingDeterminant, matrixValues]);

  const calculateEigenVectors = React.useCallback(() => {
    // const roots = quadraticSolver(1, -trace, determinant);
    const a = [[matrixValues.a, matrixValues.b], [matrixValues.c, matrixValues.d]];
    // const traspuesta = transpose(a);
    const values = eigs(a);
    multiply(a, column(values.vectors, 0));
    const b = multiply(transpose(values.vectors), a);
    const c = multiply(b, values.vectors);
    console.log(c);
    // values.forEach((value) => {
    //   const nul = eigs([[matrixValues.a + value, matrixValues.b], [matrixValues.c, matrixValues.d + value]]);
    //   console.log('nul', nul);
    // })
  }, [matrixValues]);

  calculateEigenVectors();
  return (
    <div>
      <XYPlot height={600} width={1200}>
        <XAxis />
        <YAxis />
        <HorizontalGridLines />
        <VerticalGridLines />
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
          color="red"
          curve={curveCatmullRom.alpha(0.5)}
          strokeStyle="dashed"
        />
        <CustomSVGSeries
          className="custom-marking"
          data={[
            { x: 2, y: 5 },
            { x: 3, y: 15 },
          ]}
          customComponent={(row) => {
            return (
              <g style={{ rotate: row.x === 2 ? '45deg' : '150deg' }} className="inner-inner-component">
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
