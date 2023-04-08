import React, { createContext } from 'react';

type ThemeType = { style: string, setStyle: React.Dispatch<React.SetStateAction<string>> };

// Context lets us pass a value deep into the component tree
// without explicitly threading it through every component.
// Create a context for the current theme (with "light" as the default).
// @ts-ignore
const ThemeContext = createContext<ThemeType>({ style: false, setStyle: 'light' });

export default ThemeContext;
