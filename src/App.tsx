import * as React from "react";
import {
  AppBar,
  InputLabel,
  Switch,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { SelectInput } from "./components/select-input";
import { Qvst } from "./components/qvst";
import { Stack } from "@mui/material";
import { LinearGraph } from "./components/linear-graph";
import "./App.sass";
import { calculateDeterminant, calculateTrace } from "./util/math-helper";

export type MatrixValues = {
  a: number;
  b: number;
  c: number;
  d: number;
};

function App() {
  const [enableArrows, setEnableArrows] = React.useState<boolean>(false);
  const [showRootsInChart, setRootsInChart] = React.useState<boolean>(false);
  const [isUsingFunction, setUsingFunction] = React.useState<boolean>(false);
  const [xFunction, setXFunction] = React.useState<string>("");
  const [yFunction, setYFunction] = React.useState<string>("");
  const [matrixValues, setMatrixValues] = React.useState<MatrixValues>({
    a: 0,
    b: 0,
    c: 0,
    d: 0,
  });

  const onSwitchChange = React.useCallback(
    (_: React.SyntheticEvent, checked: boolean) => {
      setUsingFunction(!checked);
    },
    [setUsingFunction]
  );

  const handleMatrixChanged = (field: string, value: string) => {
    try {
      setMatrixValues({ ...matrixValues, [field]: Number(value) });
    } catch (e) {
      console.log("not a number");
    }
  };

  const determinant = React.useCallback(
    () =>
      calculateDeterminant(
        matrixValues.a,
        matrixValues.b,
        matrixValues.c,
        matrixValues.d
      ),
    [matrixValues]
  );

  const trace = React.useCallback(
    () => calculateTrace(matrixValues.a, matrixValues.d),
    [matrixValues]
  );

  return (
    <div className="app">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" color="inherit">
            Sistemas lineales homogéneos
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack
        justifyContent="center"
        alignItems="center"
        direction="row"
        className="container-page"
      >
        <Stack marginRight={10}>
          <SelectInput
            onSwitchChange={onSwitchChange}
            isUsingFunctionField={isUsingFunction}
            onXFunctionChange={setXFunction}
            onYFunctionChange={setYFunction}
            onABCDChange={handleMatrixChanged}
          />
          <Qvst
            showRootInChart={showRootsInChart}
            traza={trace()}
            determinante={determinant()}
          />
          <Stack direction="row">
            <InputLabel style={{ alignSelf: "center" }}>
              Mostrar flechas
            </InputLabel>
            <Switch onChange={(_, checked) => setEnableArrows(checked)} />
          </Stack>
          <Stack direction="row">
            <InputLabel style={{ alignSelf: "center" }}>
              Raices en el chart:{" "}
            </InputLabel>
            <Switch
              onChange={() => {
                setRootsInChart(!showRootsInChart);
              }}
            />
          </Stack>
        </Stack>
        <div>
          <LinearGraph
            enableArrows={enableArrows}
            isUsingDeterminant={!isUsingFunction}
            xFunction={xFunction}
            yFunction={yFunction}
            matrixValues={matrixValues}
          />
        </div>
      </Stack>
    </div>
  );
}

export default App;
