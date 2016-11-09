import { default as React, Component } from 'react';
var ReactDOM = require('react-dom');
import { dataOperation } from './service/DataOperation';
import { storageService } from './service/StorageService';
import { Header } from './header/Header';
import { Footer } from './footer/Footer';
import { ShareFrame } from './ShareFrame';
import { AppLogin } from './appLogin/AppLogin';
import { Sidebar } from './appLogin/Sidebar';

class Main extends Component {
  constructor(props) {
      super(props);
      this.state = {
      	inputState: null,
      	mapping: null,
        connecting: false
      };
      this.pluginList = {
        'gem': {
          icon: 'G',
          // url: 'https://opensource.appbase.io/gem/',
          url: 'http://127.0.0.1:8000',
          text: 'GUI for Elasticsearch Mappings',
          tooltip: 'GUI for Mappings'
        },
        'dejavu': {
          icon: 'D',
          url: 'https://opensource.appbase.io/dejavu/live/',
          text: 'The Missing Web UI for Elasticsearch',
          tooltip: 'GUI for Data view'
        },
        'mirage': {
          icon: 'M',
          url: 'https://opensource.appbase.io/mirage/',
          text: 'GUI for Elasticsearch Queries',
          tooltip: 'GUI for Queries'
        }
      };
      this.getMapping = this.getMapping.bind(this);
      this.setField = this.setField.bind(this);
      this.disconnect = this.disconnect.bind(this);
      this.selectPlugin = this.selectPlugin.bind(this);
  }
  componentDidMount() {
  	this.getInputState();
    let queryParam = this.getQueryParameters();
    let selectedPlugin = queryParam && queryParam.plugin ? queryParam.plugin : 'gem';
    this.setState({
      selectedPlugin: selectedPlugin
    }, function() {
      dataOperation.selectPlugin(selectedPlugin);
    });
  }
  getQueryParameters(str) {
      let hash = window.location.hash.split('#');
      if(hash.length > 1) {
        return (str || hash[1]).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
      } else {
        return null;
      }
  }
  getInputState() {
    let localConfig = dataOperation.getLocalConfig();
    dataOperation.getInputState().then((inputState) => {
      if(localConfig.url && !inputState.url) {
        inputState = {
          url: localConfig.url,
          appname: localConfig.appname
        };
        dataOperation.updateInputState(inputState);
      }
      this.setState({
        inputState: inputState,
        appsList: localConfig.appsList
      });
    }).catch(() => {
      this.setState({
        inputState: dataOperation.inputState,
        appsList: localConfig.appsList
      });
    });
  }
  getMapping() {
    this.setState({
      connecting: true
    });
    dataOperation.updateMappingState(null);
    dataOperation.getMapping().done((mapping) => {
      this.setMappingData(mapping);
      this.setState({
        connecting: false
      });
      dataOperation.updateMappingState(mapping);
    }).fail((res) => {
      this.setState({
        connecting: false
      });
    });
  }
  setMappingData(mappingData) {
    if(mappingData && dataOperation.inputState.appname) {
      let appsList = this.setAppsList();
      let mappings = mappingData[dataOperation.inputState.appname].mappings;
      this.setState({
        mappings: mappings,
        appsList: appsList
      });
    }
  }
  setAppsList() {
    let appsList = this.state.appsList;
    let obj = {
      url: dataOperation.inputState.url,
      appname: dataOperation.inputState.appname
    };
    if(appsList.length) {
      appsList = appsList.filter(function(app) {
        return app.appname !== obj.appname;
      });
    }
    appsList.push(obj);
    storageService.set('gem-appsList', JSON.stringify(appsList));
    return appsList;
  }
  setField(mappings) {
    this.setState({
      mappings: mappings
    });
  }
  disconnect() {
    this.setState({
      mappings: null
    });
    dataOperation.updateMappingState(null);
  }
  selectPlugin(pluginName) {
    this.setState({
      selectedPlugin: pluginName
    });
    dataOperation.selectPlugin(pluginName);
  }
  afterConnectContainer() {
    let res;
    if(this.state.mappings) {
      res = (
        <ShareFrame
          selectedPlugin={this.state.selectedPlugin}
          pluginList={this.pluginList}
        >
        </ShareFrame>
      );
    }
    return res;
  }
  render() {
  	let appContainer, mappingMarkup;
  	if(this.state.inputState) {
  		appContainer = (
        <div className="container-fluid app-container">
  	      <Header selectedPlugin={this.state.selectedPlugin} pluginList={this.pluginList} />
          <div className="app-with-sidebar-container container-fluid">
            <Sidebar 
              selectPlugin={this.selectPlugin} 
              selectedPlugin={this.state.selectedPlugin}
              pluginList={this.pluginList} />
    	      <div className="app-main-container">
              <AppLogin 
                appsList = {this.state.appsList} 
                inputState = {this.state.inputState} 
                getMapping = {this.getMapping}
                mappings = {this.state.mappings}
                disconnect = {this.disconnect} 
                selectedPlugin={this.state.selectedPlugin}
                pluginList={this.pluginList}
              />
              {this.afterConnectContainer()}
            </div>
          </div>
	     </div>
      );
  	}
    return (
      <div className="appContainer">
        <section className={(this.state.connecting ? 'loading' : 'hide')}>
          <div className="is-loadingApp">
            <div className="loadingBar"></div>
          </div>
        </section>
      	<section className={(this.state.inputState ? "hide" : "loading")}>
    			<div className="is-loadingApp">
    				<div className="loadingBar"></div>
    			</div>
  		  </section>
      	{appContainer}
        <Footer selectedPlugin={this.state.selectedPlugin} />
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('gem-container'));