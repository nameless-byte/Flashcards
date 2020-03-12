import React from "react";
import { connect } from "react-redux";
import { getWordById } from "../Redux/selectors";
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { deleteWord } from "../Redux/actions";
import cx from "classnames";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CacheManager from './Cache';

const useStyles = {
  root: {
    userSelect: 'none',
    width: 250,
    margin: '10px 10px',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  kanji: {
    fontFamily: 'Kosugi',
  },
  reading: {
    position: 'absolute',
    fontFamily: 'Kosugi',
    left: '50%',
    top: '-11%',
    transform: 'translate(-50%)',
  },
  hoverShow: {
    opacity: 1,
  },
  hoverHide: {
    opacity: 0,
  },
  grow: {
    flexGrow: 1,
  },
  kanjibox: {
    position: 'relative',
  }
};

class Word extends React.Component {

  constructor(props) {
    super(props);
    this.state = {hover: false, dialog: false};
    this.cache = new CacheManager();
  }

  handleDeleteWord = () => {
    this.props.deleteWord(this.props.wordId);
    const { word } = this.props;
    const data = this.cache.readData('words');
    data.then(value => {
      this.cache.writeData('words', value.filter(element => element.kanji !== word.kanji));
    })
  }

  handleOpen = () => {
    this.setState({dialog: true});
  };

  handleClose = () => {
    this.setState({dialog: false});
  };

  render() {
    const { word } = this.props;
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Card className={classes.root}>
          <CardContent>
            <div className={classes.kanjibox}>
              <Typography className={cx(
                  classes.reading,
                  this.state.hover && classes.hoverShow,
                  !this.state.hover && classes.hoverHide
                )} onMouseOver={() => this.setState({hover: true})} onMouseOut={() => this.setState({hover: false})} color="textSecondary" variant="body2" gutterBottom>
                {word.reading}
              </Typography>
              <Typography align='center' className={classes.kanji} variant="h2" component="h2">
                {word.kanji}
              </Typography>
            </div>  
            <Typography align='center' className={classes.pos} color="textSecondary">
              {word.partofspeech && word.partofspeech.length ? word.partofspeech.map((meaning, index) => ((index ? ', ' : '') + meaning)) : null}
            </Typography>
            <Typography align='center' variant="body2" component="p">
              {word.meaning && word.meaning.length ? word.meaning.map((meaning, index) => ((index ? ', ' : '') + meaning)) : null}
            </Typography>
          </CardContent>
          <CardActions>
            <Button href={word.link}>Learn More</Button>
            <div className={classes.grow} />
            <Button onClick={this.handleOpen} color="secondary">Delete</Button>
          </CardActions>
        </Card>
        <Dialog
          open={this.state.dialog}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"You sure?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you really wish to delete the word {word.kanji}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              YO, I MISCLICKED, CHILL
            </Button>
            <Button onClick={this.handleDeleteWord} color="primary" autoFocus>
              YEAH BOI
            </Button>
          </DialogActions>
        </Dialog>
        </React.Fragment>
    );
  }
}

export default connect(
  (state, ownProps) => ({ word: getWordById(state, ownProps.wordId) }),
  { deleteWord }
)(withStyles(useStyles)(Word));

