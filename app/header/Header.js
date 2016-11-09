import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { SubscribeModal } from '../others/SubscribeModal';

export class Header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
    <header className="header text-center">
      <div className="img-container">
        <img src={"assets/images/"+this.props.selectedPlugin+"/logo.png"} alt="Gem" className={"img-responsive "+this.props.selectedPlugin} />
      </div>
      <div className="tag-line">
        {this.props.pluginList[this.props.selectedPlugin].text}
      </div>
      <SubscribeModal selectedPlugin={this.props.selectedPlugin} />
    </header> 
    );
  }
}

Header.propTypes = {  
};
// Default props value
Header.defaultProps = {
};