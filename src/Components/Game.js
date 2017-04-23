import React, { Component } from 'react';
import Stars from './Stars';
import Button from './Button';
import Answer from './Answer';
import Numbers from './Numbers';
import DoneFrame from './DoneFrame';

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

class Game extends Component {
  static initialState = () => ({
    selectedNumbers: [],
    randomNumberOfStars: 1 + Math.floor(Math.random()*9),
    usedNumbers: [],
    answerisCorrect: null,
    redraws: 5,
    doneStatus: null
  });

  state = Game.initialState();

  resetGame= () => this.setState(Game.initialState());

  selectNumber = (clickedNumber) => {
    if(this.state.selectedNumbers.indexOf(clickedNumber) >= 0 || this.state.usedNumbers.indexOf(clickedNumber) >= 0){return ;}
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber),
      answerIsCorrect: null
    }));
  };

  revertSelectNumber = (clickedNumber) => {
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber),
      answerIsCorrect: null
    }));
  };

  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect: prevState.randomNumberOfStars ===
        prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  };

  acceptAnswer = () => {
    this.setState(prevState => ({
      usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      randomNumberOfStars: 1 + Math.floor(Math.random()*9)
    }), this.updateDoneStatus);
  };

  redraw = () => {
    if(this.state.redraws === 0){return ;}
    this.setState(prevState => ({
      redraws: this.state.redraws - 1,
      randomNumberOfStars: 1 + Math.floor(Math.random()*9),
      answerIsCorrect: null,
      selectedNumbers: []
    }), this.updateDoneStatus);
  };

  updateDoneStatus = () => {
    this.setState(prevState => {
      if(prevState.usedNumbers.length === 9){
        return {doneStatus: 'Done.Nice!'}
      }
      if(prevState.redraws === 0 && !this.possibleSolutions(prevState)){
        return {doneStatus: 'Game Over!'}
      }
    })
  };

  possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
    const possibleNumbers = [1,2,3,4,5,6,7,8,9].filter(number =>
      usedNumbers.indexOf(number) === -1
    );

    return possibleCombinationSum(possibleNumbers, randomNumberOfStars)
  };

  render() {
    const {
      selectedNumbers,
      randomNumberOfStars,
      usedNumbers,
      redraws,
      answerIsCorrect,
      doneStatus } = this.state;
    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars randomNumberOfStars={randomNumberOfStars}/>
          <Button selectedNumbers={selectedNumbers}
                  acceptAnswer={this.acceptAnswer}
                  checkAnswer={this.checkAnswer}
                  redraws={redraws}
                  redraw={this.redraw}
                  answerIsCorrect={answerIsCorrect}/>
          <Answer selectedNumbers={selectedNumbers}
                  revertSelectNumber={this.revertSelectNumber}/>
        </div>
        <br />
        {doneStatus ? <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus}/> :
        <Numbers selectedNumbers={selectedNumbers}
                selectNumber={this.selectNumber}
                usedNumbers={usedNumbers}/>
        }

        <br />
      </div>
    );
  }
}

export default Game;
