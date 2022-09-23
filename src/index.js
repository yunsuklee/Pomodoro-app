import React from 'react';
import ReactDOM, { render } from 'react-dom';
import './CSS/main.css';

let sessionInterval, breakInterval;

function getTimer(currentTime) {
  if (currentTime < 0) return "00:00";
  let minutes = Math.floor(currentTime / 60);
  let seconds = currentTime % 60;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return minutes + ':' + seconds;
}

class Clock extends React.Component {
  state = {
    sessionLength: 25,
    breakLength: 5,
    startStop: "START",
    currentTimer: 1500,
    displayTimer: '25:00',
    timerMessage: 'Time to focus!',
    timerState: 'stopped'
  };

  handleSessionIncrement = () => {
    if (this.state.sessionLength < 60) {
      this.setState({
        sessionLength: this.state.sessionLength + 1,
        currentTimer: this.state.currentTimer + 60,
        displayTimer: getTimer(this.state.currentTimer + 60)
      });
    }
  }
  handleSessionDecrement = () => {
    if (this.state.sessionLength > 1) {
      this.setState({
        sessionLength: this.state.sessionLength - 1,
        currentTimer: this.state.currentTimer - 60,
        displayTimer: getTimer(this.state.currentTimer - 60)
      });
    }
  }
  handleBreakIncrement = () => {
    if (this.state.breakLength < 60) {
      this.setState({
        breakLength: this.state.breakLength + 1,
      });
    }
  }
  handleBreakDecrement = () => {
    if (this.state.breakLength > 1) {
      this.setState({
        breakLength: this.state.breakLength - 1,
      });
    }
  }
  handleStartStop = () => {
    // In case the timer wasn't running
    if (this.state.timerState === 'stopped') {
      if (this.state.timerMessage === 'Time to focus!') {
        this.startSession();
      } else {
        this.startBreak();
      } 
      this.setState({     
        startStop: 'STOP',
        timerState: 'running'
      });
    } else {
      this.setState({
        startStop: 'START',
        timerState: 'stopped'
      });
      clearInterval(sessionInterval);
      clearInterval(breakInterval);
    }
  }
  startSession = () => {
    if (this.state.timerState === 'running') {
      this.setState({
        currentTimer: this.state.sessionLength * 60,
        displayTimer: getTimer(this.state.sessionLength * 60),
        timerMessage: 'Time to focus!'
      });
    }
    sessionInterval = setInterval(() => {
      if (this.state.currentTimer === 0) {
        this.audioBeep.currentTime = 0;
        this.audioBeep.play();
        clearInterval(sessionInterval);
        this.startBreak();
      } else {
        this.setState({
          currentTimer: this.state.currentTimer - 1,
          displayTimer: getTimer(this.state.currentTimer -1)
        });
      }
    }, 1000);
  }
  startBreak = () => {
    if (this.state.timerState === 'running') {
      this.setState({
        currentTimer: this.state.breakLength * 60,
        displayTimer: getTimer(this.state.breakLength * 60),
        timerMessage: 'Time to rest'
      });
    }
    breakInterval = setInterval(() => {
      if (this.state.currentTimer === 0) {
        this.audioBeep.currentTime = 0;
        this.audioBeep.play();
        clearInterval(breakInterval);        
        this.startSession();
      } else {
        this.setState({
          currentTimer: this.state.currentTimer - 1,
          displayTimer: getTimer(this.state.currentTimer - 1)
        });
      }
    }, 1000);
  }
  handleReset = () => {
    clearInterval(sessionInterval);
    clearInterval(breakInterval);

    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
    
    this.setState({
      sessionLength: 25,
      breakLength: 5,
      currentTimer: 1500,
      displayTimer: getTimer(1500),
      timerState: 'stopped',
      timerMessage: "Time to focus!"
    });
  }

  render() {
    return(
      <div id="clock">
        <h1>Pomodoro</h1>
        <fieldset id="session-label">
          <label>Session Length</label>
          <button id="session-increment" onClick={this.handleSessionIncrement}>
            <i className="fa-solid fa-arrow-up"></i>
          </button>
          <p id="session-length">{this.state.sessionLength}</p>
          <button id="session-decrement" onClick={this.handleSessionDecrement}>
            <i className="fa-solid fa-arrow-down"></i>
          </button>
        </fieldset>
        <fieldset id="break-label">
          <label>Break Length</label>
          <button id="break-increment" onClick={this.handleBreakIncrement}>
            <i className="fa-solid fa-arrow-up"></i>
          </button>
          <p id="break-length">{this.state.breakLength}</p>
          <button id="break-decrement" onClick={this.handleBreakDecrement}>
            <i className="fa-solid fa-arrow-down"></i>
          </button>
        </fieldset>
        <fieldset id="timer">
          <h2 id="timer-label">{this.state.timerMessage}</h2>
          <div id="time-left">{this.state.displayTimer}</div>
          <button id="start_stop" onClick={this.handleStartStop}>{this.state.startStop}</button>
          <button id="reset" onClick={this.handleReset}>
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </fieldset>
        <div id="credits">
          <h3>Designed and Coded by</h3>
          <h3>Yunusk Lee</h3>
        </div>
        <audio
          id="beep"
          preload="auto"
          ref={(audio) => {
            this.audioBeep = audio;
          }}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    );
  }  
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);

