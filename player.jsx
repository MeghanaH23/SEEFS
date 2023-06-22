// NewScene component
class NewScene extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        widgetData: '',
      };
    }
  
    handleWidgetInputChange = (event) => {
      this.setState({ widgetData: event.target.value });
    }
  
    handleAddWidget = () => {
      // Handle widget data addition
      // You can add the logic here to store the widget data or perform any desired actions
      const { widgetData } = this.state;
      console.log('Widget Data:', widgetData);
  
      // Clear the input field
      this.setState({ widgetData: '' });
    }
  
    render() {
      const { widgetData } = this.state;
  
      return (
        <div className="container">
          <h1>New Scene</h1>
          <div>
            <label>Widget Data:</label>
            <input type="text" value={widgetData} onChange={this.handleWidgetInputChange} placeholder="Enter widget data" />
          </div>
          <div>
            <button onClick={this.handleAddWidget}>Add Widget</button>
          </div>
        </div>
      );
    }
  }
  
  // Render the TeamPlayer and NewScene components
  ReactDOM.render(
    <div>
      <TeamPlayer />
      <NewScene />
    </div>,
    document.getElementById('app')
  );
  