import React, { useState } from "react";
import { connect } from "react-redux";
import Word from "./Word";
import Backdrop from '@material-ui/core/Backdrop';
import { getWordsByVisibilityFilter } from "../Redux/selectors";
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

const WordList = ({ words, loading }) => {
  return (
    <Container style={{marginTop: 50, flexWrap: 'wrap', display: 'flex',}} maxWidth='xl'>
        {!loading ? words && words.length
          ? words.map((word, index) => {
              return (
                <Word
                  key={`word-${word.id}`}
                  wordId={word.id}
                  ref={r => {
                    console.log(r);
                  }}
                />
              );
            }) : 'Nothing, Chef!'
          : 
          <Backdrop open={true} style={{zIndex: 10, color: '#fff'}}>
            <CircularProgress color="inherit" />
          </Backdrop>}
    </Container>
  );
};



const mapStateToProps = state => {
  const { visibilityFilter } = state;
  const words = getWordsByVisibilityFilter(state, visibilityFilter);
  return { words };
};


export default connect(mapStateToProps)(WordList);
