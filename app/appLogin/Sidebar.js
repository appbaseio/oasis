import {
  default as React, Component } from 'react';
import { render } from 'react-dom';

export class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }
  sidebarList() {
    let list = [];
    for(let itemKey in this.props.pluginList) {
      let item = this.props.pluginList[itemKey];
      let finalItem = (
        <li key={itemKey}>
          <a onClick={() => this.props.selectPlugin(itemKey)} title={item.tooltip} className={this.props.selectedPlugin === itemKey ? 'active' : ''} href="javascript:void;">
            {item.icon}
          </a>
        </li>
      );
      list.push(finalItem);
    };
    return list;
  }  
  render() {
      return ( 
        <div className="app-sidebar">
          <ul>
            {this.sidebarList()}
          </ul>
        </div>
      );
    }
  }
