import * as React from "react";
import { FC } from "react";
import {css} from "emotion";
import { List, Avatar, Icon, Spin, Button } from "antd";
import {ConnecTouchLink} from "../../../share/types";
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
    fetchLimitNum: number;
    setLimit: () => void;
}

export const LinksListContent: FC<Props> = ({
                                                links,
                                                fetchLimitNum,
                                                setLimit,
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

    return links.length === 0 ? (
        <div className={spinContainer}>
            <Spin className={spinner} indicator={SpinnerElm} />
        </div>
    ) : (
        <List
            className={linkListArea}
            itemLayout="vertical"
            dataSource={links}
            loadMore={
                <Button
                    onClick={setLimit}
                    className={loadBtn}
                    loading={links.length != fetchLimitNum}
                    size="large"
                    shape="round"
                >
                    Load more
                </Button>
            }
            renderItem={item => {
                const { cardId, readerId, time } = readable(item);
                return (
                    <List.Item key={item.cardId}>
                        <List.Item.Meta
                            avatar={<Avatar src={demo_icon} />}
                            title={<div>{cardId}</div>}
                            description={
                                <div>
                                    {readerId} にタッチしました。
                                    <span style={{ float: "right" }}>{time}</span>
                                </div>
                            }
                        />
                    </List.Item>
                );
            }}
        />
    );
};
