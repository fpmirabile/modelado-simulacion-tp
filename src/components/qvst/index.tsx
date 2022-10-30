import * as React from "react";
import { curveCatmullRom } from "d3-shape";
import {
  Hint,
  HorizontalGridLines,
  LineSeries,
  MarkSeries,
  MarkSeriesPoint,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from "react-vis";
import { parser as mathParser, evaluate } from "mathjs";
import {
  createRangeBetweenNumbers,
  quadraticSolver,
} from "../../util/math-helper";

const qvstFunction = "q(p)=(p^2)/4";
interface PropTypes {
  traza: number;
  determinante: number;
  showRootInChart?: boolean;
}
export function Qvst({ traza, determinante, showRootInChart }: PropTypes) {
  const [nearest, setNearest] = React.useState<MarkSeriesPoint | null>(null);

  const serieDismiss = React.useCallback(() => {
    setNearest(null);
  }, [setNearest]);

  const evaluateTrazaAndDeterminante = React.useCallback((): {
    x: number;
    y: number;
  }[] => {
    const result: {
      x: number;
      y: number;
    }[] = [];
    const roots = quadraticSolver(1, -traza, determinante);
    const parser = mathParser();
    parser.evaluate(qvstFunction);
    roots.forEach((root) => {
      const x = typeof root === "string" ? evaluate(root).re : root;
      const y =
        typeof root === "string"
          ? parser.evaluate(`q(${root})`).im
          : parser.evaluate(`q(${root})`);
      result.push({
        x,
        y,
      });
    });

    return result;
  }, [traza, determinante]);

  const calculatePvsQ = React.useCallback(() => {
    const linePointValues: { x: number; y: number }[] = [];
    const range = createRangeBetweenNumbers(-10, 10);
    const parser = mathParser();
    parser.evaluate(qvstFunction);
    range.forEach((num) => {
      const qValue = parser.evaluate(`q(${num})`);
      linePointValues.push({
        x: num,
        y: qValue,
      });
    });

    return linePointValues;
  }, []);

  return (
    <XYPlot height={200} width={200}>
      <XAxis />
      <YAxis />
      <HorizontalGridLines />
      <VerticalGridLines />
      {showRootInChart && (
        <MarkSeries
          onValueMouseOver={setNearest}
          data={evaluateTrazaAndDeterminante()}
          onValueMouseOut={serieDismiss}
          color={"blue"}
        />
      )}
      <MarkSeries
        onValueMouseOver={setNearest}
        data={[{ x: traza, y: determinante }]}
        onValueMouseOut={serieDismiss}
        color={"red"}
      />
      {nearest && (
        <Hint value={nearest} align={{ horizontal: "auto", vertical: "auto" }}>
          <div className="rv-hint__content">{`(${nearest.x}, ${nearest.y})`}</div>
        </Hint>
      )}
      <LineSeries
        className="first-series"
        color="red"
        data={calculatePvsQ()}
        curve={curveCatmullRom.alpha(0.5)}
      />
    </XYPlot>
  );
}
