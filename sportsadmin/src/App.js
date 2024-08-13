import { ThemeProvider } from "@material-ui/styles";

import theme from "./config/theme";
import Layout from "./app/common/layout/components/Layout";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
}

export default App;
