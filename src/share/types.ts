
export type OsusumeJson = {
    title : string,
    url : string,
    keywords : Array<string>
}

export type ConnecTouchLink = {
    _id : {
        $oid : string
    },
    time : string,
    url : string | null,
    link : pairLink

}

export type pairLink = {
    readerId : string,
    cardId : string
}

export type CardInfo = {
    _id : {
        $oid : string
    },
    id : string
    desc : string,
    email : string,
    keywords : Array<string>,
    secrets : Array<string>
}
