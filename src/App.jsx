import styled from 'styled-components';

import { SearchBar } from './components/searchBar';

import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './globalStyles';
import { lightTheme, darkTheme } from './components/themeSwitch';

import { useDarkMode } from './hooks/useDarkMode';
import Toggle from './components/toggle';

import './App.css';

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 8em;
`;

const Header = styled.div`
  padding: 10px;
  text-align: center;

  color: #f50f64;
  font-size: 16px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
`;

function App() {
  const [theme, themeToggler, mountedComponent] = useDarkMode();

  const themeMode = theme === 'light' ? lightTheme : darkTheme;

  if (!mountedComponent) return <div />;

  return (
    <ThemeProvider theme={themeMode}>
      <>
        <GlobalStyles />
        <Header>
          <HeaderWrapper>
            <Toggle theme={theme} toggleTheme={themeToggler} />
            {/* <button>oi</button> */}
          </HeaderWrapper>

          <h1>Lyceum Of Wisdom - Rise of Kingdom</h1>
        </Header>
        <AppContainer>
          <SearchBar />
        </AppContainer>
      </>
    </ThemeProvider>
  );
}

export default App;
