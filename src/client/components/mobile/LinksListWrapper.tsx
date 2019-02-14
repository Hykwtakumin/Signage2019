import * as React from "react";
import { FC } from "react";
import { css } from "emotion";
import { notification } from "antd";
import { LinksListContent } from "./LinksListContent";
import { CardInfo, ConnecTouchLink } from "../../../share/types";
import { isKeyWordContained } from "../../../share/util";

import { readerTable } from "./readerTable";
import { userInfoTable } from "./userInfoTable";
import { cardIdList, readerIdList } from "./idList";
// import "dotenv/config";

const { useState, useEffect, useLayoutEffect } = React;
const fetchURL = process.env.FETCH_URL || "http://192.168.0.200";
const myCardID = "010104128215612b";
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
  // const [userInfoTable, setUserInfoTable] = useState([] as CardInfo[]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const loadingId = setTimeout(() => setLoading(false), 1500);
    () => clearTimeout(loadingId);
  }, []);

  // useLayoutEffect(() => {
  //   console.log("layout effect");
  //   fetch(`${fetchURL}/info`)
  //     .then(async response => {
  //       const data = await response.json();
  //       await setUserInfoTable(data);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  //   return () => console.log("end layout");
  // }, []);

  useEffect(() => {
    const timerId = setInterval(polingLinks, 1000);
    return () => clearInterval(timerId);
  }, [links]);

  const polingLinks = async () => {
    const currentLinks = links;
    const endPointUrl = `${fetchURL}/links?limit=${20}`;
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

  const filterLink = async (newLink: ConnecTouchLink) => {
    /*自分のIDと一致する*/
    if (newLink.link.cardId === myCardID) {
      filteredLinks.push(newLink);
    } else {
      /*自分のsecretと一致する*/
      const myInfo = userInfoTable.find(user => {
        return user.id === myCardID;
      });
      const newInfo = userInfoTable.find(user => {
        return user.id === newLink.link.cardId;
      });

      if (await isKeyWordContained(myInfo.secrets, newInfo.secrets)) {
        filteredLinks.push(newLink);
      }
    }
  };

  const getLinksDiff = (
    oldLinks: ConnecTouchLink[],
    newLinks: ConnecTouchLink[]
  ) => {
    const oldIdArray = oldLinks.map(item => item._id.$oid);

    const isContained = (link: ConnecTouchLink): boolean => {
      return oldIdArray.includes(link._id.$oid);
    };

    const diffLinks = newLinks.reduce((prev, curr) => {
      !isContained(curr) && prev.push(curr);
      return prev;
    }, []);

    if (diffLinks.length === 1) {
      diffLinks.forEach(link => {
        const parsedLink = link;
        const readerId = parsedLink.link[0] as string;
        const cardId = parsedLink.link[1] as string;
        const userInfo = userInfoTable.find(i => i.id === cardId) || null;
        const readerInfo = readerTable.find(i => i.id === readerId) || null;
        const user = userInfo ? userInfo.email : "Guest";
        const place = readerInfo ? readerInfo.desc : "Test Area";
        notification.info({
          message: (
            <div>
              <span>
                <b>{user}</b> が
              </span>
              <br />
              <span>
                <b>{place}</b> で
              </span>
              <br />
              <span>タッチ！</span>
            </div>
          ),
        });
      });
      const newLink = diffLinks[0];
    }
  };

  return (
    <div className={container}>
      <LinksListContent
        links={links}
        isLoading={isLoading}
        // userInfoTable={userInfoTable}
      />
    </div>
  );
};
