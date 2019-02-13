import * as React from "react";
import { Layout, BackTop } from "antd";
import { css, injectGlobal } from "emotion";
import { LinksListWrapper } from "./LinksListWrapper";

const { Header, Content } = Layout;

injectGlobal({
  body: {
    backgroundColor: "#f0f2f5 !important",
    overflowX: "hidden",
  },
});

const headerArea = css({
  width: "100vw",
  height: "10vh",
});

const headerTxt = css({
  color: "#ffffff",
  textAlign: "center",
  position: "relative",
  top: "50%",
  transform: "translateY(-50%)",
});

const contentArea = css({
  fontFamily: "sans-serif",
  width: "100vw",
  height: "100vh",
});

export const MobileApp = () => (
  <div className={headerArea}>
    <Layout>
      <Header className={headerArea}>
        <h2 className={headerTxt}>ConnecTouch Mobile</h2>
      </Header>
      <Content>
        <LinksListWrapper />
      </Content>
      <BackTop />
    </Layout>
  </div>
);
