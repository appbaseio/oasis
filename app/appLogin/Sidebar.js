import {
  default as React, Component } from 'react';
import { render } from 'react-dom';

export class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }
  
  render() {
      return ( 
        <div className="app-sidebar">
          <ul>
            <li>
              <a onClick={() => this.props.selectPlugin('gem')} title="GEM - GUI for Elasticsearch Mappings" className={this.props.selectedPlugin === 'gem' ? 'active' : ''} href="javascript:void;">
                G
              </a>
            </li>
            <li>
              <a onClick={() => this.props.selectPlugin('dejavu')} title="GEM - GUI for Elasticsearch Mappings" className={this.props.selectedPlugin === 'dejavu' ? 'active' : ''} href="javascript:void;">
                D
              </a>
            </li>
            <li>
              <a onClick={() => this.props.selectPlugin('mirage')} title="GEM - GUI for Elasticsearch Mappings"  className={this.props.selectedPlugin === 'mirage' ? 'active' : ''} href="javascript:void;">
                M
              </a>
            </li>
          </ul>
        </div>
      );
    }
  }
