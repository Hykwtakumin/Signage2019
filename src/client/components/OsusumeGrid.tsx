import * as React from "react";
import {ReactDOM, ReactNode, SFC} from "react";
import {OsusumeJson} from "../../share/types";
import {css} from "emotion";

const gridContainer = css({});
const gridItem = css({});

export const OsusumeGird:SFC<{dataLists : Array<OsusumeJson>}> = props => {

    const dataLists = props.dataLists.forEach((item, index) => {
            <div className={gridItem}>
                <h3>{item.title}</h3>
            </div>
    });

    return (
        <div className={gridContainer}>
            {{dataLists}}
        </div>
    );
};