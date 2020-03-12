import React from "react";
import { connect } from "react-redux";
import { addWord, refreshState } from "../Redux/actions";
import { getWordList } from "../Redux/selectors";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import CacheManager from './Cache';

const ranges = [[12353, 12439], [12445, 12448], [110593, 110879], [127488, 127489], [12449, 12539], [12540, 12544], [12784, 12800], [13008, 13055], [13056, 13144], [65382, 65392], [65393, 65438], [110592, 110593]];
const useStyles = theme => ({
  addButton: {
    marginTop: 10,
    width: '100%',
    height: 40,
  },
});

class AddWord extends React.Component {

  constructor(props) {
    super(props);
    this.state = {input: '', options: [], loading: false, cache: []};
    this.timeout = null;
    this.cache = new CacheManager();
  }

  fetchAPI = async (kanji) => {
    const result = await fetch(`https://cors-anywhere.herokuapp.com/https://jisho.org/api/v1/search/words?keyword=${kanji}`);
    const item = await result.json();
    return item.data;
  }

  isInKana = (input) => {
      const checkKanaRanges = (character) => ranges.some(([from, to]) => (character.charCodeAt(0) - from >= 0 && to - character.charCodeAt(0) >= 0)) ? 1 : 0;
      let count = 0;
      for (let character of input) {
        count += checkKanaRanges(character);
      }
      return count == input.length ? true : false;
  }

  handleAddWord = () => {
    if (!this.state.input) return null; 
    const { allids } = this.props;
    const { cache, input } = this.state;
    const maxId = allids.length ? Math.max(...allids) : 0;
    const value = cache[cache.findIndex((element) => element.slug == input)];
    const newWord = {
      kanji: `${input}`, 
      reading: `${this.isInKana(input) ? '' : value.japanese[0].reading}`, 
      meaning: value.senses[0].english_definitions.slice(0, 3), link: `https://jisho.org/search/${input}`, 
      partofspeech: value.senses[0].parts_of_speech, 
      dateadded: new Date()
    };
    const data = this.cache.readData('words');
    data.then(value => {
      this.cache.writeData('words', value == null ? [newWord] : [...value, newWord]);
    })
    this.props.addWord(newWord, maxId + 1);
  };

  handleOnChange = () => {
    this.setState({loading: true});
    const input = this.state.input;
    let fetchPromise = this.fetchAPI(input);
    fetchPromise.then(value => {
      this.setState({options: value.map(word => word.slug).filter((element) => isNaN(parseInt(element))), loading: false, cache: value});
    }); 
  }

  render() {
    const {classes} = this.props;
    return (
      <React.Fragment>
        <Autocomplete
          id="combo-box-demo"
          options={this.state.options}
          clearOnEscape
          value={this.state.input}
          onInputChange={(_, value, reason) => {
            this.setState({input: value})
            if (reason == 'input') {
              window.clearTimeout(this.timeout);
              this.timeout = setTimeout(() => this.handleOnChange(), 1000);
            }
            else if (reason == 'clear' || (reason == 'reset' && !value)) {
              this.setState({options: [], cache: []});
            }
          }}
          autoComplete
          loading={this.state.loading}
          getOptionSelected={(option, value) => option === value}
          renderInput={params => (
            <TextField {...params} label="Add Word" variant="outlined" fullWidth InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {this.state.loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }} />
          )}
        />
        <Button variant="contained" className={classes.addButton} onClick={this.handleAddWord} color="primary">
          Add
        </Button>
      </React.Fragment>  
    )
  }
}

export default connect(
  (state) => ({ allids: getWordList(state) }),
  { addWord, refreshState }
)(withStyles(useStyles)(AddWord));