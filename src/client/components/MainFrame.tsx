import * as React from "react";
import {css} from 'emotion'
import {OsusumeJson} from "../../share/types";
import {OsusumeGird} from "./OsusumeGrid";

const container = css({});


export interface DefaultProps {
    defaultState : DefaultState
}

export interface DefaultState {
    dataArray : Array<OsusumeJson>
}

 class MainFrame extends React.Component<DefaultProps, DefaultState> {

    constructor(props) {
        super(props);
        const {dataArray} = props;
        this.state = {
            dataArray : dataArray
        }
    }

    componentDidMount() {
        //
    }

    render() {
        return (
            <div className={container}>
                <h1>ConnecTouch Signage</h1>
                {
                    console.dir(this.state)
                }
            </div>
        );
    }
}

export default MainFrame;