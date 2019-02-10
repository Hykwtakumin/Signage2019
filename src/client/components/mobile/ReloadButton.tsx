import * as React from "react";
import {css} from "emotion";
import { List, Avatar, Icon, Spin, Button } from "antd";
import "antd/dist/antd.css";
import {ConnecTouchLink} from "../../../share/types";
import "moment/locale/ja";
import * as moment from "moment";

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
    limit: number;
    limitIncr: () => void;
}

const ReloadButton: React.SFC<Props> = props => {
    const { links } = props;

    //linkをヒューマンリーダブルな文字列に変換して表示する
    const readable = (item: ConnecTouchLink) => {
        const readerId = item.link[0];
        const cardId = item.link[1];
        const time = moment.unix(parseInt(item.time)).fromNow();
        // const time = moment.unix(parseInt(item.time)).format("YYYY-MM-DD HH:mm") as string;
        // return `${cardId}が${readerId}にタッチしました :${time}`;
        return {
            cardId,
            readerId,
            time,
        };
    };

    const Spinner = <Icon type="loading" spin style={{ fontSize: "20vw" }} />;

    return links.length === 0 ? (
        <div className={spinContainer}>
            <Spin className={spinner} indicator={Spinner} />
        </div>
    ) : (
        <>
            <List
                className={linkListArea}
                itemLayout="vertical"
                dataSource={links}
                loadMore={
                    <Button
                        onClick={props.limitIncr}
                        className={loadBtn}
                        loading={links.length != props.limit}
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
        </>
    );
};

export default ReloadButton;
