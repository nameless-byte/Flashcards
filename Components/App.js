import React, { Component } from 'react';
import AddWord from './AddWord';
import WordList from './WordList'
import { connect } from "react-redux";
import { refreshState } from "../Redux/actions";
import CacheManager from './Cache';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import VisibilityFilters from './VisibilityFilters';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';

const useStyles = theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  filters: {
    color: 'inherit',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(2, 4, 3),
    width: 400,
    height: 100,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showModal: false, loading: false};
    this.cache = new CacheManager();
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
  }

  refreshState = async () => {
    const data = this.cache.readData('words');
    data.then(value => {
      if (value !== null && value.length !== 0) {
        let newState = {
          allIds: [],
          byIds: {}
        };
        for (let word of value) {
          newState.byIds[newState.allIds.length] = word;
          newState.allIds.push(newState.allIds.length);        
        }
        this.props.refreshState(newState);    
      }
      this.setState({loading: false});
    })
  } 
  componentDidMount() {
    this.setState({loading: true});
    setTimeout(() => this.refreshState(), 2000);
  }
  handleShow() {
    console.log(this.state.showModal);
    this.setState({showModal: true});
  }
  
  handleHide() {
    this.setState({showModal: false});
  }
  render() {
    const {classes} = this.props;
    return (
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} onClick={this.handleShow} color="inherit" aria-label="menu">
              <AddIcon />
            </IconButton>
            <div className={classes.grow} />
            <VisibilityFilters className={classes.filters} />
          </Toolbar>
        </AppBar>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.showModal}
          onClose={this.handleHide}
          closeAfterTransition
          BackdropComponent={Backdrop}
        >
          <Fade in={this.state.showModal}>
            <Paper className={classes.paper} elevation={0}>
              <AddWord />
            </Paper> 
          </Fade>
        </Modal>
        <WordList loading={this.state.loading} />
      </div>
    );
  }
}

export default connect(
  null,
  { refreshState }
)(withStyles(useStyles)(App));
