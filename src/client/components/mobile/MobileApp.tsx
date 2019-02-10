import * as React from "react";
import {Layout, BackTop} from "antd";

const {Header, Content} = Layout;
import {css} from "emotion";
import {LinksListWrapper} from "./LinksListWrapper";

const headerArea = css({
    width: "100vw",
    height: "10vh"
});

const headerTxt = css({
    color: "#ffffff",
    textAlign: "center",
    position: "relative",
    top: "50%",
    transform: "translateY(-50%)"
});

const contentArea = css({
    fontFamily: "sans-serif",
    width: "100vw",
    height: "100vh"
});

export const MobileApp = () => (
    <div className={headerArea}>
        <Layout>
            <Header className={headerArea}>
                <h2 className={headerTxt}>ConnecTouch Mobile</h2>
            </Header>
            <Content>
                <LinksListWrapper/>
            </Content>
            <BackTop/>
        </Layout>
    </div>
);