import React, { Component, Fragment } from 'react';
import { CopilotItem } from '../copilot';
import Header from './header';
import Infor from './infor';


const HeaderItem = CopilotItem(Header);
const InforItem = CopilotItem(Infor);

class WrapperHeaderInfor extends Component {
  render() {
    return (
      <Fragment>
        <div>
          <HeaderItem order="1" text="My name"/>
          <InforItem order="2" text="About me"/>
        </div>
      </Fragment>
    );
  }
}

export default WrapperHeaderInfor;