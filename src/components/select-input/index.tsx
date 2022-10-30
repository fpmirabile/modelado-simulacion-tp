import * as React from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Switch,
  Typography,
} from "@material-ui/core";
import { Stack } from "@mui/material";
import { MathInput } from "../function-input";

interface PropTypes {
  isUsingFunctionField: boolean;
  onSwitchChange?: (evt: React.SyntheticEvent, checked: boolean) => void;
  onXFunctionChange: (newValue: string) => void;
  onYFunctionChange: (newValue: string) => void;
  onABCDChange: (field: string, value: string) => void;
}

export function SelectInput({
  isUsingFunctionField,
  onSwitchChange,
  onXFunctionChange,
  onYFunctionChange,
  onABCDChange,
}: PropTypes) {
  const fieldChanged = (field: string) => (event: any) => {
    onABCDChange(field, event.currentTarget.value);
  };

  return (
    <Stack direction="column">
      <Stack marginTop={5} direction="row" alignItems="center">
        <Typography>Funciones</Typography>
        <Switch defaultChecked onChange={onSwitchChange} />
        <Typography>Por ABCD</Typography>
      </Stack>
      <Stack direction="row" alignItems="center">
        {isUsingFunctionField ? (
          <>
            <Stack direction="column">
              <Stack
                display="flex"
                alignItems="center"
                justifyContent="center"
                direction="row"
              >
                <InputLabel style={{ marginRight: 6 }}>X':</InputLabel>{" "}
                <MathInput onInputChange={onXFunctionChange} />
              </Stack>
              <Stack
                display="flex"
                alignItems="center"
                justifyContent="center"
                direction="row"
              >
                <InputLabel style={{ marginRight: 6 }}>Y':</InputLabel>{" "}
                <MathInput onInputChange={onYFunctionChange} />
              </Stack>
            </Stack>
          </>
        ) : (
          <>
            <span style={{ fontSize: 106, paddingBottom: 16 }}>(</span>
            <Stack>
              <Stack marginBottom={1} direction="row">
                <FormControl>
                  <InputLabel htmlFor="a">A</InputLabel>
                  <OutlinedInput
                    onChange={fieldChanged("a")}
                    style={{ maxWidth: 60, marginRight: 6 }}
                    id="a"
                    label="a"
                  />
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="b">B</InputLabel>
                  <OutlinedInput
                    onChange={fieldChanged("b")}
                    style={{ maxWidth: 60 }}
                    id="b"
                    label="b"
                  />
                </FormControl>
              </Stack>
              <Stack direction="row">
                <FormControl>
                  <InputLabel htmlFor="c">C</InputLabel>
                  <OutlinedInput
                    onChange={fieldChanged("c")}
                    style={{ maxWidth: 60, marginRight: 6 }}
                    id="c"
                    label="c"
                  />
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="d">D</InputLabel>
                  <OutlinedInput
                    onChange={fieldChanged("d")}
                    style={{ maxWidth: 60 }}
                    id="d"
                    label="d"
                  />
                </FormControl>
              </Stack>
            </Stack>
            <span style={{ fontSize: 106, paddingBottom: 16 }}>)</span>
          </>
        )}
      </Stack>
    </Stack>
  );
}
