import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import CopilotItem from './hoc';
import './index.scss';

export {
  CopilotItem
}


class CopilotContainer extends Component {
  lastScrollTop = 0;
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      step: 1,
      style: {},
      show: this.props.show ||  true
    }
    this.register = this.register.bind(this);
    this.unRegister = this.unRegister.bind(this);
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.skip = this.skip.bind(this);
    // this.excuteLazyLoad = this.excuteLazyLoad.bind(this);
  }
  static childContextTypes = {
    register: PropTypes.func,
    unRegister: PropTypes.func,
  };
  getChildContext() {
    return {
      register: this.register,
      unRegister: this.unRegister,
    };
  }
  register(item) {
    this.setState(({ items }) => ({
      items: items.concat(item)
    }));
  }
  unRegister(item) {
    this.setState(({ items }) => {
      const index = items.findIndex(i => i.el === item);
      if (index !== -1) {
        items.splice(index, 1);
      }
      return ({
        items: items
      })
    });
  }
  componentDidUpdate(prevProps, prevState){
    const {
      items,
      step
    } = this.state;
    if(items.length !== prevState.items.length || step !== prevState.step){
      this.setState({
        style: this.createStyle(items, step, prevState.step)
      })
    }
  }
  createStyle(items, newIndex, oldIndex){
    const newItem = items.find(i => {
      return parseInt(i.order) === newIndex
    });
    
    const oldItem = items.find(i => {
      return parseInt(i.order) === oldIndex
    });
    if(!newItem) return {};
    if(oldItem){
      const oldEl = ReactDOM.findDOMNode(oldItem.el.current);
      oldEl.classList.remove('copilot-item');
      oldEl.classList.remove('copilot-showElement');
    }
    const el = ReactDOM.findDOMNode(newItem.el.current);
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const wH = window.innerHeight;
    const isOnView = (el.offsetTop + el.offsetHeight / 2) >= st && ((el.offsetTop + el.offsetHeight / 2) - st) <= wH;
    el.classList.add('copilot-item');
    el.classList.add('copilot-showElement');
    if(!isOnView){
      setTimeout(() => {
        window.scrollTo(0, Math.max(el.offsetTop - 100), 0);
      }, 200);
    }
    return {
      layer: {
        width: el.offsetWidth,
        height: el.offsetHeight,
        top: el.offsetTop,
        left: el.offsetLeft,
      },
      tooltip: {
        opacity: 1,
        display: 'block',
        left: 0,
        bottom: -127
      },
      item: newItem
    }
  }
  next(e){
    e.preventDefault();
    const {
      step,
      items
    } = this.state;
    if(step === items.length) return;
    this.setState({
      step: step + 1
    })
  }
  back(e){
    e.preventDefault();
    const {
      step
    } = this.state;
    this.setState({
      step: Math.max(step - 1, 1)
    })
  }
  skip(e){
    e.preventDefault();
    const {
      onSkip
    } = this.props;
    this.setState({
      show: false
    });
    onSkip && onSkip();
  }
  render() {
    const {
      children
    } = this.props;
    const {
      items,
      step,
      style,
      show
    } = this.state;
    return (
      <Fragment>
        {children}
        {!!items.length && show && <Fragment>
          <div className="overlay"></div>
          <div className="helperLayer" style={style.layer}></div>
          <div className="copilot" style={style.layer}>
            <span className="copilot-stepNumber">{step}</span>
            <div className="copilot-control" style={style.tooltip}>
              <div className="copilot-tooltiptext">{(style.item || {}).text}</div>
              <div className="copilot-bullets">
                <ul>
                  {items.map((i, idx) => (
                    <li key={idx}>
                      <a href="true" className={`${step - 1 === idx ? 'active': '' }`} role="button" tabIndex="0">&nbsp;</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="copilot-arrow top"></div>
              <div className="copilot-tooltipbuttons">
                {step !== items.length && <a href="true" className="copilot-button copilot-skipbutton" onClick={this.skip} role="button" tabIndex="0">Skip</a>}
                {step === items.length && <a href="true" className="copilot-button copilot-skipbutton" onClick={this.skip} role="button" tabIndex="0">Done</a>}
                <a href="true" role="button" onClick={this.back} className="copilot-button copilot-prevbutton">← Back</a>
                <a href="true" role="button" onClick={this.next} className={`copilot-button copilot-nextbutton${step === items.length ? ' copilot-disabled' : ''}`}>Next →</a>
              </div>
            </div>
          </div>
        </Fragment>}
      </Fragment>
    );
  }
}

export default CopilotContainer;