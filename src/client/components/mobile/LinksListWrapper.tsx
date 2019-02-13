import * as React from "react";
import {FC} from "react";
import {css} from "emotion";
import {notification} from "antd";
import {LinksListContent} from "./LinksListContent";
import "dotenv/config";
import {CardInfo, ConnecTouchLink} from "../../../share/types";
import {getUserInfo, isKeyWordContained} from "../../../share/util";

const {useState, useEffect, useContext} = React;
const fetchURL = process.env.FETCH_URL || "http://192.168.0.200";
const myCardID= window.location.search.substr(1);
console.log(`myCardID: ${myCardID}`);
const filteredLinks: ConnecTouchLink[] = [];
//const userInfoTable: CardInfo[] = [];

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
    const [userInfoTable, setUserInfoTable] = useState([] as CardInfo[]);

    useEffect(() => {
        // fetch(`${fetchURL}/info`)
        //     .then(async (response) => {
        //         const data = await response.json();
        //         setUserInfoTable(data);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });
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
                const filteredLinks = await getLinksDiff(loadedLinks);
                setLinks(filteredLinks);
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


    const filterLink = async (newLink: ConnecTouchLink) => {
        /*自分のIDと一致する*/
        if (newLink.link.cardId === myCardID) {
            filteredLinks.push(newLink);
        } else {
            /*自分のsecretと一致する*/
            const myInfo = userInfoTable.find(user => { return user.id === myCardID });
            const newInfo = userInfoTable.find(user => { return user.id === newLink.link.cardId });

            if (await isKeyWordContained(myInfo.secrets, newInfo.secrets)) {
                filteredLinks.push(newLink);
            }
        }
    };

    /*フィルタしたものだけ返す*/
    const getLinksDiff = async (loadedLinks: ConnecTouchLink[]): Promise<Array<ConnecTouchLink>> => {
        const filteredLinks :ConnecTouchLink[] = [];
        loadedLinks.forEach(  async (link) => {
                const parsedLink = link as ConnecTouchLink;
                const readerId = parsedLink.link[0];
                const cardId = parsedLink.link[1];
                console.log(`readerId : ${readerId}, cardId : ${cardId}`);
                // notification.info({
                //     message: "Suicaがタッチされました。",
                //     description: `リーダー：${readerId}\nカード：${cardId}`,
                // });
                if (readerId === myCardID) {
                    console.log("readerId === myCardID");
                    filteredLinks.push(parsedLink);
                } else {
                    const me = await getUserInfo(myCardID);
                    const you = await getUserInfo(cardId);
                    if (await isKeyWordContained(me.secrets, you.secrets)) {
                        /*知り合いの情報だけ*/
                        console.log("same secrets");
                        filteredLinks.push(parsedLink);
                    }
                }
            });
            return new Promise((resolve, reject) => {
                resolve(filteredLinks);
            });
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
