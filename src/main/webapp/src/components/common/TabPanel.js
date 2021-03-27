import React from "react";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


export default class TabPanel extends React.Component {
  
  render(){
    const { children, value, index, ...other } = this.props;
    return (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
          
        >
          {value === index && (
            <Box>
              <Typography>{children}</Typography>
            </Box>
          )}
        </div>
      );
  }
  
}