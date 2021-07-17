import React from "react";

import PuffLoader from "react-spinners/PuffLoader";

import {css} from "@emotion/react";

const override = css`
   position: absolute;
   top: 50%;
   left: 50%;
   margin-top: -25px;
   margin-left: -50px;
`;


function Loading() {
   return <PuffLoader color={"#000"} css={override} size={50} />;
}

export default Loading;
