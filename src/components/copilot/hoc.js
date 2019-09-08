import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

const CopilotItem = (WrappedComponent) => {
  return class extends Component {
    constructor(props){
      super(props);
      this.item = createRef();
    }
    static contextTypes = {
      register: PropTypes.func,
      unRegister: PropTypes.func,
    };
    componentDidMount(){
      this.context.register({
        el: this.item,
        order: this.props.order,
        text: this.props.text
      })
    }
    componentWillUnmount(){
      this.context.unRegister(this.item);
    }
    render() {
      return (
        <WrappedComponent ref={this.item} context={this.context} {...this.props}/>
      );
    }
  };
}
export default CopilotItem;