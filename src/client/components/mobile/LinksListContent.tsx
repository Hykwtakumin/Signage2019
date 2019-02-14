import * as React from "react";
import { FC } from "react";
import { css } from "emotion";
import { List, Avatar, Icon, Spin, Button, Modal } from "antd";
import { ConnecTouchLink, CardInfo } from "../../../share/types";
import "moment/locale/ja";
import * as moment from "moment";
import { readerTable } from "./readerTable";
import { userInfoTable } from "./userInfoTable";
import { cardIdList, readerIdList } from "./idList";

const demo_icon = "./fakeUser.png";

const { useState } = React;

const linkListArea = css({
  width: "90vw",
  marginLeft: "auto",
  marginRight: "auto",
});

const spinner = css({
  position: "relative",
  top: "50%",
  left: "40vw",
  transform: "translataY(-50%)",
});

const spinContainer = css({
  height: "50vh;",
});

const loadBtn = css({
  display: "block",
  marginTop: "10%",
  marginRight: "auto",
  marginLeft: "auto",
});

interface Props {
  links: ConnecTouchLink[];
  isLoading: boolean;
  // userInfoTable: CardInfo[];
}

export const LinksListContent: FC<Props> = ({
  links,
  isLoading,
  // userInfoTable,
}) => {
  const readable = (item: ConnecTouchLink) => {
    const readerId = item.link[0];
    const cardId = item.link[1];
    const time = moment.unix(parseInt(item.time)).fromNow();
    return {
      cardId,
      readerId,
      time,
    };
  };

  const SpinnerElm = <Icon type="loading" spin style={{ fontSize: "20vw" }} />;

  return isLoading ? (
    <div className={spinContainer}>
      <Spin className={spinner} indicator={SpinnerElm} />
    </div>
  ) : (
    <>
      <List
        className={linkListArea}
        itemLayout="vertical"
        dataSource={links}
        renderItem={item => {
          const { cardId, readerId, time } = readable(item);
          const userInfo = userInfoTable.find(i => i.id === cardId) || null;
          const readerInfo = readerTable.find(i => i.id === readerId) || null;
          const user = userInfo ? userInfo.email : "Guest";
          const place = readerInfo ? readerInfo.desc : "Test Area";
          const avatar = cardIdList.includes(cardId)
            ? userInfo.icon
            : demo_icon;
          const content = readerInfo ? readerInfo.content : "";
          return (
            <List.Item key={item.cardId}>
              <List.Item.Meta
                avatar={<Avatar src={avatar} />}
                title={<strong>{user}</strong>}
              />
              {item.url ? (
                <div>
                  <img src={item.url} alt="" style={{ width: "60vw" }} />
                  <br />
                  <b style={{ float: "right" }}>{time}</b>
                </div>
              ) : (
                <div style={{ wordWrap: "break-word" }}>
                  <b>{user}</b> が <b>{place}</b> でタッチ！
                  <br />
                  <img src={content} alt="" style={{ marginTop: "3%" }} />
                  <br />
                  <b style={{ float: "right" }}>{time}</b>
                </div>
              )}
            </List.Item>
          );
        }}
      />
    </>
  );
};
