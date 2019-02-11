import * as React from "react";
import { FC } from "react";
import {css} from "emotion";
import { notification } from "antd";
import { LinksListContent } from "./LinksListContent";
import "dotenv/config";
import {ConnecTouchLink} from "../../../share/types";

const { useState, useEffect, useContext } = React;
const fetchURL = process.env.FETCH_URL || "http://connectouch.org";


const container = css({
    fontFamily: "sans-serif",
    width: "100vw",
    marginTop: "5%",
    marginBottom: "5%",
});

/*リストビューの本体*/
/*ClassComponentではない*/
export const LinksListWrapper: FC<{}> = () => {
    const [isActivated, setActivate] = useState(false);
    const [filter, setFilter] = useState("");
    const [links, setLinks] = useState([] as ConnecTouchLink[]);
    const [fetchLimitNum, setLimit] = useState(10);

    useEffect(() => {
        const timerId = setInterval(polingLinks, 1000);
        return () => clearInterval(timerId);
    }, [fetchLimitNum, links]);

    const polingLinks = async () => {
        const currentLinks = links;
        const endPointUrl = `${fetchURL}/links?limit=${fetchLimitNum}`;
        const request = await fetch(endPointUrl);
        if (request.status === 200) {
            try {
                const loadedLinks = (await request.json()) as ConnecTouchLink[];
                getLinksDiff(currentLinks, loadedLinks);
                setLinks(loadedLinks);
            } catch (err) {
                console.error(err);
            }
        } else {
            console.log("something went wrong");
        }
    };

    const IncrementFetchLimitNum = () => {
        setLimit(fetchLimitNum + 10);
    };

    const getLinksDiff = (oldLinks: ConnecTouchLink[], newLinks: ConnecTouchLink[]) => {
        const oldIdArray = oldLinks.map(item => item._id.$oid);

        const isContained = (link: ConnecTouchLink): boolean => {
            return oldIdArray.includes(link._id.$oid);
        };

        const diffLinks = newLinks.reduce((prev, curr) => {
            !isContained(curr) && prev.push(curr);
            return prev;
        }, []);

        if (diffLinks.length < 5) {
            diffLinks.forEach(link => {
                const parsedLink = link;
                const readerId = parsedLink.link[0] as string;
                const cardId = parsedLink.link[1] as string;
                notification.info({
                    message: "Suicaがタッチされました。",
                    description: `リーダー：${readerId}\nカード：${cardId}`,
                });
            });
        }
    };

    return (
        <div className={container}>
            <LinksListContent
                links={links}
                fetchLimitNum={fetchLimitNum}
                setLimit={IncrementFetchLimitNum}
            />
        </div>
    );
};
