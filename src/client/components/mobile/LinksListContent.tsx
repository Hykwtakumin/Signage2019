import * as React from "react";
import { FC } from "react";
import { css } from "emotion";
import { List, Avatar, Icon, Spin, Button } from "antd";
import { ConnecTouchLink } from "../../../share/types";
import "moment/locale/ja";
import * as moment from "moment";

const {} = React;

const demo_icon = "./fakeUser.png";

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
}

export const LinksListContent: FC<Props> = ({ links, isLoading }) => {
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
    <List
      className={linkListArea}
      itemLayout="vertical"
      dataSource={links}
      renderItem={item => {
        const { cardId, readerId, time } = readable(item);
        return (
          <List.Item key={item.cardId}>
            <List.Item.Meta
              avatar={<Avatar src={demo_icon} />}
              title={<div>{cardId}</div>}
              description={
                item.url ? (
                  <div>
                    <img src={item.url} style={{ width: "60vw" }} />
                    <br />
                    <span style={{ float: "right" }}>{time}</span>
                  </div>
                ) : (
                  <div>
                    {readerId} にタッチしました。
                    <span style={{ float: "right" }}>{time}</span>
                  </div>
                )
              }
            />
          </List.Item>
        );
      }}
    />
  );
};
