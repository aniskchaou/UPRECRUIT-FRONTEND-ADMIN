import React from 'react';
import PropTypes from 'prop-types';


export default class AlertMsgs extends React.Component {
  constructor (props){
      super(props);
      this.state = {msg: props.msg}
  }

  componentWillReceiveProps(props) {
      this.setState({msg: props.msg});
  }

  render() {
     
      return (    
          <div >
              <div className="overlay-menu-wrapper">
                  <span></span>
              </div>
          </div>
     );
  }
}
