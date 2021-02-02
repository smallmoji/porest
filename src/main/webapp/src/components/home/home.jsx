import React from 'react'

class Home extends React.Component{
  constructor(props){
    super(props);
    const prop = this.props.location.state;
    this.state = {
      role: prop.role,
      id: prop.id,
    }

    document.title = "Porest | Home";
  }

  render(){
    return(
      <div>
        HOME
      </div>
    )
  }
}

export default Home;