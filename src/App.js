import React from 'react';
import AppRoutes from "./routes/AppRoutes";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#174A84',
    },
    secondary: {
      main: '#ff4040',
    }
  },
  typography: {
    fontFamily: [
      'lato',
    ].join(','),
  },
});
const App = () => {

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </MuiPickersUtilsProvider>

  );
}

export default App;
