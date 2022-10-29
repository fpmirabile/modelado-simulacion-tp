import * as React from 'react';

const initialValues = {

};

const LinearPhaseContext = React.createContext(initialValues);

type PropTypes = {
  children: React.ReactNode;
}

export function LinearPhaseProvider({ children }: PropTypes) {
  return (
    <LinearPhaseContext.Provider value={initialValues}>
      {children}
    </LinearPhaseContext.Provider>
  );
}