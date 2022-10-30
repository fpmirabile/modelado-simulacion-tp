import * as React from "react";
import MathView, { MathViewRef } from "react-math-view";
import MathExpression from "math-expressions";
import "./styles.sass";

interface PropTypes {
  onInputChange?: (newValue: string) => void;
}

const functionPreffix = "f(x)=";
export function MathInput({ onInputChange }: PropTypes) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [invalidInput, setInvalidInput] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("x");
  const mathViewRef = React.useRef<MathViewRef>(null);

  const onChange = React.useCallback(
    (newValue: string) => {
      setValue(newValue);
      if (onInputChange) {
        onInputChange(functionPreffix + newValue);
      }
    },
    [setValue, onInputChange]
  );

  const handleMathChange = React.useCallback(() => {
    try {
      let value = mathViewRef.current?.getValue("latex") || "";
      if (value.includes(functionPreffix)) {
        value = value.replace(functionPreffix, "");
      }

      const parsedTex: string = MathExpression.fromLatex(value).toString();
      if (parsedTex.endsWith("＿")) {
        return;
      }
      
      onChange(parsedTex.toString());
      setInvalidInput(false);
    } catch (e) {
      setInvalidInput(true);
    }
  }, [onChange]);

  return (
    <div className="function-input">
      <input
        hidden
        className="real-input"
        value={value}
        ref={inputRef}
        readOnly
      />
      <MathView
        onChange={handleMathChange}
        value={`${functionPreffix}${value}`}
        ref={mathViewRef}
      />
      {invalidInput && <span>La formula es incorrecta</span>}
    </div>
  );
}
