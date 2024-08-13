import { createMuiTheme } from "@material-ui/core/styles";

const spPrimary = "#97BFB4";
const spSecondary = "#DD4A48";

const theme = createMuiTheme({
  drawerWidth: 280,
  drawerCloseWidth: 72,
  palette: {
    common: {},
    primary: {
      main: `${spPrimary}`,
    },
    secondary: {
      main: `${spSecondary}`,
    },
  },
  pageHeading: {
    fontFamily: "Roboto, Helvetica, Arial, 'sans-serif'",
    fontWeight: 400,
    fontSize: "2.125rem",
    lineHeight: 1.235,
    letterSpacing: "0.00735em",
    marginBottom: "0.5rem",
    color: `${spPrimary}`,
  },
  overrides: {
    MUIDataTable: {
      root: {
        height: "70%",
      },
    },
  },
});

export default theme;
