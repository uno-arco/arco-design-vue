// @ts-ignore
import React from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';
import Navbar from '@arco-materials/site-navbar-new';
import { ConfigProvider } from '@arco-design/web-react';
import './index.less';
import './navbar.css';

interface NavBarOptions {
  version?: string;
  lang?: string;
  handleLanguageChange?: (lang: string) => void;
}

const siteBase = '/arco-design-vue/';

const ReactApp = ({
  lang = 'zh-CN',
  handleLanguageChange = () => {},
  version,
}: NavBarOptions) => {
  return (
    <ConfigProvider prefixCls={'arco-react'}>
      {/* @ts-ignore site-navbar types omit ThemeProvider */}
      <Navbar.NavbarThemeProvider>
        <Navbar
          lang={lang}
          onChangeLanguage={handleLanguageChange}
          algoliaTag="vue"
          defaultVersion={version}
          onChangeTheme={(theme: string) => {
            document
              .querySelector('#react-root')
              ?.setAttribute('arco-theme', theme);
          }}
          hideRtl
          hideUser
          hideSearch
          logoHref={siteBase}
          versions={[{ version, link: siteBase }]}
        />
      </Navbar.NavbarThemeProvider>
    </ConfigProvider>
  );
};

const renderNavBar = (options?: NavBarOptions) => {
  ReactDOM.render(
    <ReactApp {...(options ?? {})} />,
    document.getElementById('react-root')
  );
};
export default renderNavBar;
