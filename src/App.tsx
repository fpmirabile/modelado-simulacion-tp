import * as React from "react";
import { AppBar, Toolbar, Typography, Switch } from "@material-ui/core";
import Stack from "@mui/material/Stack";
import { MathInput } from "./components/function-input";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeriesCanvas,
  LineSeries,
  VerticalGridLines,
  ChartLabel,
} from "react-vis";
import { curveCatmullRom } from "d3-shape";
import "./App.sass";

function App() {
  const [isUsingFunction, setUsingFunction] = React.useState<boolean>(true);

  const onSwitchChange = React.useCallback(
    (_: React.SyntheticEvent, checked: boolean) => {
      setUsingFunction(!checked);
    },
    [setUsingFunction]
  );

  const a = Array.from(Array(20).keys());
  const b = (): { x: number, y: number }[] => {
    const result: { x: number, y: number }[] = [];
    a.forEach(num => {
      // Numero actual - limite de costados
      const currentNumber = num - 10;
      // console.log(currentNumber)
      result.push({
        x: currentNumber,
        y: currentNumber ** 2
      })
    });
    console.log(result)
    return result;
  };
  return (
    <div className="app">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" color="inherit">
            Sistemas homogeneos
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack
        marginTop={5}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        {isUsingFunction ? (
          <>
            <MathInput />
            <MathInput />
          </>
        ) : (
          <>
            <FormControl>
              <InputLabel htmlFor="traza">Traza</InputLabel>
              <OutlinedInput id="traza" label="Traza" />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="determinante">Determinante</InputLabel>
              <OutlinedInput id="determinante" label="Determinante" />
            </FormControl>
          </>
        )}
      </Stack>
      <Stack direction="row" alignItems="center">
        <Typography>Funciones</Typography>
        <Switch onChange={onSwitchChange} />
        <Typography>Traza y determinante</Typography>
      </Stack>
      <div>
        <XYPlot height={600} width={600}>
          <XAxis tickFormat={d => { return d + 10}} />
          <YAxis />
          <HorizontalGridLines />
          <VerticalGridLines />
          <LineSeries
            className="first-series"
            color="red"
            data={b()}
            curve={curveCatmullRom.alpha(0.5)}
          />
        </XYPlot>
      </div>
      <div>
        <XYPlot height={600} width={600}>
          <XAxis />
          <YAxis />
          <HorizontalGridLines />
          <VerticalGridLines />
          <ChartLabel
            text="X Axis"
            className="alt-x-label"
            includeMargin={false}
            xPercent={0.025}
            yPercent={1.01}
          />
          <ChartLabel
            text="Y Axis"
            className="alt-y-label"
            includeMargin={false}
            xPercent={0.06}
            yPercent={0.06}
            style={{
              transform: "rotate(-90)",
              textAnchor: "end",
            }}
          />
          <LineSeriesCanvas
            color="red"
            data={[
              { x: 1, y: 10 },
              { x: 2, y: 5 },
              { x: 3, y: 15 },
            ]}
          />
          <LineSeries
            className="first-series"
            data={[
              { x: 1, y: 3 },
              { x: 2, y: 5 },
              { x: 3, y: 15 },
              { x: 4, y: 12 },
            ]}
          />
          <LineSeries className="second-series" data={[]} />
          <LineSeries
            className="third-series"
            curve={"curveMonotoneX"}
            data={[
              { x: 1, y: 10 },
              { x: 2, y: 4 },
              { x: 3, y: 2 },
              { x: 4, y: 15 },
            ]}
            // strokeDasharray={[7, 3]}
          />
          <LineSeries
            className="fourth-series"
            curve={curveCatmullRom.alpha(0.5)}
            style={{
              // note that this can not be translated to the canvas version
              strokeDasharray: "2 2",
            }}
            data={[
              { x: 1, y: 7 },
              { x: 2, y: 11 },
              { x: 3, y: 9 },
              { x: 4, y: 2 },
            ]}
          />
        </XYPlot>
      </div>
    </div>
  );
}

export default App;
