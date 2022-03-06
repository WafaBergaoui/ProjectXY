import React, { useEffect, useState, useContext } from "react";
import Button from "../components/Button";
import ViewButton from "../components/ViewButton";
import ViewButtonResult from "../components/ViewButtonResult";
import io from "socket.io-client";
import "../app.css";

import { GameContext } from "../context/GameContext";
import { SocketContext } from "../context/SocketContext";
import { MessagesContext } from "../context/MessagesContext";
import { UserContext } from "../context/UserContext";

/* 
I thought that only Home component needs a comment and 
the other components are easy to understand, if you already have some background in react
*/

// init 1-64 buttons with index and display status
const populateBtnList = () => {
  let temp = [];
  for (let i = 0; i < 64; i++) {
    temp.push({ index: i, showMe: false });
  }
  return temp;
};
const _socket = io.connect();

const PlayScreen = () => {
  const LeftCounter = [8, 7, 6, 5, 4, 3, 2, 1]; // Y axsis numbers
  const bottomCounter = [1, 2, 3, 4, 5, 6, 7, 8]; // X axsis numbers
  const [startMessage, setStartMessage] = useState("Start"); // command messages:- start or choose or M or A
  const [btnList] = useState(populateBtnList()); // array of 64 buttons

  const FM = 3; // M - for first button
  const FA = 1; // A - for first button
  const SM = 2; // M - for second button
  const SA = 2; // A - for second button
  const { user: _user, room: _room, player: _player } = useContext(UserContext);

  const [selectedTitle, setSelectedTitle] = useState("");
  const [xposition, setXPosition] = useState(""); // x - coordinate for 1st position
  const [yposition, setYPosition] = useState(""); // y - coordinate for 1st position
  const [secondXPosition, setSecondXPosition] = useState(""); // x - coordinate for 2nd position
  const [secondYPosition, setSecondYPosition] = useState(""); // y - coordinate for 2nd position
  const [thirdXPosition, setThirdXPosition] = useState(""); // x - coordinate for 3rd position
  const [thirdYPosition, setThirdYPosition] = useState(""); // y - coordinate for 3rd position
  const [viewBoldFirst, setViewBoldFirst] = useState(false); // bold first btn
  const [viewBoldSecond, setViewBoldSecond] = useState(false); // bold second btn
  // const [viewBoldSecond, setViewBoldSecond] = useState(false); // bold second btn
  const [firtValue, setFirstValue] = useState(0); // the 1st value of each btn displayed under the 2 command button
  const [secondValue, setSecondValue] = useState(0); // the 2nd value of each btn displayed under the 2 command button
  const [showResults, setShowResults] = useState(false); // show/hide all btns displayed under the 2 command button
  const [clickableBtn, setClickableBtn] = useState(false); // manage the clickable status of each btn
  const [showQuestionBtn, setShowQuestionBtn] = useState(false); // manage the status of ? btn
  const [showBackBtn, setShowBackBtn] = useState(false); // manage the status of 'Back' btn
  const [positionOne, setPositionOne] = useState(null); // the first F or S btn coordinates
  const [positionTwo, setPositionTwo] = useState(null); // the second F or S btn coordinates
  const [positionThree, setPositionThree] = useState(null); // the second F or S btn coordinates
  const [neighbour, setNeighbour] = useState(false); // the status of each btn that have background of blue
  const [neighbourInside, setNeighbourInside] = useState(false); // the status of each btn that have background of red

  const [blueBtns, setBlueBtns] = useState([]); //array of the indexes of the buttons that should turn blue
  const [redBtns, setRedBtns] = useState([]); //array of the indexes of the buttons that should turn red
  const [order, setOrder] = useState(""); // This controls the scene and should be set to either 'first', 'second' or 'third'
  const handleBtnTitle = (title) => {
    setSelectedTitle(title.charAt(0));
  };

  // start the program
  const handleStart = () => {
    if (startMessage === "Move" || startMessage === "Act") return;

    setStartMessage("Choose");
  };

  // set bold or normal font weight
  const handleViewBold = (title) => {
    if (title === "First") {
      setViewBoldFirst(true);
      setViewBoldSecond(false);
    } else {
      setViewBoldFirst(false);
      setViewBoldSecond(true);
    }
    setShowResults(true);
    setClickableBtn(true);
  };

  // the operation of ? btn
  const handleQuestion = () => {
    if (order === "third") {
      setXPosition(secondXPosition); // XP becomes XA
      setYPosition(secondXPosition); // YP becomes YA
      // setFromQuestionBtn((prev) => true);

      setPositionOne(positionTwo); // positionOne becomes positionTwo
      // setPositionTwo(null);
      // setPositionThree(null);

      setNeighbour(true);
      setNeighbourInside(false); // remove the red buttons

      // clear secondPosition X and Y values
      setSecondXPosition("");
      setSecondYPosition("");
      setShowBackBtn(false);

      handlePostion(positionTwo[2], "first"); // generate new acceptedBtns
      handleBackBtn(null, true); //null has to be past because handleBackBtn gets passed event by default from the onClick function
    } else if (startMessage === "Choose") {
      setStartMessage("Move");
      setShowBackBtn(false);
      setNeighbour(true);
    } else if (startMessage === "Move") {
      setStartMessage("Act");
      setShowBackBtn(true);
      setNeighbourInside(true);
    }
    setClickableBtn(false);
    setShowQuestionBtn(false);
  };

  // the operation of 'Back' btn
  const handleBackBtn = (e, fromQuestionBtn = false) => {
    // If the order is first and back is clicked it resets everything to the point where all buttons are green. This is no longer useful since the backbtn is hidden but I still kept it here incase you would want to implement that later.
    if (order === "first") {
      setPositionOne(null);
      setPositionTwo(null);
      setPositionThree(null);

      setShowBackBtn(false);
      setStartMessage("Choose");
      setClickableBtn(true);

      setXPosition("");
      setYPosition("");
      setSecondXPosition("");
      setSecondYPosition("");
      setThirdXPosition("");
      setThirdYPosition("");

      setNeighbour(false);
      setNeighbourInside(false);

      setBlueBtns([]);
      setRedBtns([]);
      for (let i = 0; i < 63; i++) {
        btnList[i].showMe = false;
      }
    } else if (order === "second") {
      // Resets the environment to XP and YP alone with the generated buttons
      setPositionTwo(null);
      setPositionThree(null);

      setStartMessage("Move");

      setSecondXPosition("");
      setSecondYPosition("");
      setThirdXPosition("");
      setThirdYPosition("");
      setShowBackBtn(false);
      setShowQuestionBtn(false);
      setOrder("first");

      setNeighbourInside(false);

      setRedBtns([]); // clears the red buttons array
      for (let i = 0; i < 64; i++) {
        if (btnList[i].index !== positionOne[2]) {
          btnList[i].showMe = false;
        }
      }
    } else if (order === "third") {
      let positionTwoIndex = positionTwo[2]; // get the index of the red button that was clicked
      let positionThreeIndex = positionThree[2]; // get the index of the red button that was clicked
      // setPositionTwo(null);
      // setPositionThree(null);
      setPositionThree(null);

      setThirdXPosition("");
      setThirdYPosition("");
      setOrder("second");

      if (fromQuestionBtn) {
        // if this was called from the handleQuestionBtn function then do this
        setPositionTwo(null);
        setPositionThree(null);
        setStartMessage("Move");
        setRedBtns([]);
        for (let i = 0; i < 64; i++) {
          if (btnList[i].index !== positionTwoIndex) {
            btnList[i].showMe = false;
          } else {
            btnList[i].showMe = true;
          }
        }
      } else {
        // else just hide the F on the red button
        if (btnList[positionOne[2]].index === positionThreeIndex) {
          // btnList[positionOne[2]].showMe = true;
          setShowQuestionBtn(false);
          return;
        } else {
          btnList[positionThree[2]].showMe = false;
          setShowQuestionBtn(false);
        }
      }
    }
  };

  // This function generates all the buttons that should be turned blue or red.
  // It accepts an index of the particular button that was clicked on, the distance
  // and a 'red' variable to differentiate between the blue and red buttons.
  // The function works by carrying out the following steps:
  // 1. Get the left, right, top and bottom of the selected button and add it to the list a list of red or blue btns depending on the value of red. This is the needed diamond shape.
  // 2. Perform checks to take care of edge cases like when the index is at the edge or vertexes.
  // 3. Recursively repeat the function for the left, right, top and bottom until the required distance is reached
  const generateAcceptedBtns = (index, distance, red = false) => {
    if (distance === 0 || distance === null || index === null) return;

    let left = index - 1;
    let right = index + 1;
    let top = index - 8;
    let bottom = index + 8;

    // if the Y position of the index is different from the Y position of the left value, then it has spilled out of bounds and should not be computed. Same thing for the right value
    // if the X position of the index is different from the X position of the bottom then it has spilled out of bounds and should not be computed. Same thing for the top value.
    if (calcYPosition(index) !== calcYPosition(left)) {
      left = null;
    } else if (calcYPosition(index) !== calcYPosition(right)) {
      right = null;
    } else if (calcXPosition(index) !== calcXPosition(bottom)) {
      bottom = null;
    } else if (calcXPosition(index) !== calcXPosition(top)) {
      top = null;
    }

    // Recursively run the function on the left, right, top and bottom
    if (!red) {
      setBlueBtns((prev) => [...prev, left, right, top, bottom]);
      generateAcceptedBtns(left, distance - 1);
      generateAcceptedBtns(right, distance - 1);
      generateAcceptedBtns(top, distance - 1);
      generateAcceptedBtns(bottom, distance - 1);
    } else {
      setRedBtns((prev) => [...prev, left, right, top, bottom]);
      generateAcceptedBtns(left, distance - 1, true);
      generateAcceptedBtns(right, distance - 1, true);
      generateAcceptedBtns(top, distance - 1, true);
      generateAcceptedBtns(bottom, distance - 1, true);
    }
  };

  // set the coordinates of each positions and call the generateAcceptedBtns function
  const handlePostion = (index, orderVar) => {
    // Get the X and Y position of index
    const x = calcXPosition(index);
    const y = calcYPosition(index);

    if (orderVar === "first") {
      // if true then the button clicked on is a green one, set XP, YP
      setXPosition(x);
      setYPosition(y);
      setOrder("first"); // switch the order to first to keep track of this point
      setBlueBtns((prev) => []); // clear array to remove left over indexes before new ones are generated
      setPositionOne([x, y, index]);
      generateAcceptedBtns(index, firtValue); // generate indexes to turn blue
    } else if (orderVar === "second") {
      // if true then the button clicked on is a blue one, set XM, YM
      setSecondXPosition(x);
      setSecondYPosition(y);
      setShowBackBtn(false);
      setOrder("second");
      setRedBtns((prev) => []);
      setPositionTwo([x, y, index]);
      generateAcceptedBtns(index, secondValue, true); // generate indexes to turn red
    } else if (orderVar === "third") {
      // if true then the button clicked on is a red one, set XA, YA
      setShowBackBtn(true);
      setOrder("third");
      setThirdXPosition(x);
      setThirdYPosition(y);
      setPositionThree([x, y, index]);
    }

    const current = btnList.findIndex((item) => item.index === index);
    btnList[current].showMe = true;

    if (startMessage === "Move") {
      for (let i = 0; i < 64; i++) {
        if (btnList[i].index !== index && btnList[i].index !== positionOne[2]) {
          btnList[i].showMe = false;
        }
      }
    } else if (startMessage === "Act") {
      for (let i = 0; i < 64; i++) {
        if (
          btnList[i].index !== index &&
          btnList[i].index !== positionOne[2] &&
          btnList[i].index !== positionTwo[2]
        ) {
          btnList[i].showMe = false;
        }
      }
    } else {
      for (let i = 0; i < 64; i++) {
        if (btnList[i].index !== index) {
          btnList[i].showMe = false;
        }
      }
    }
  };

  // this useEffect hook makes sure if the firstValue (MC) changes it regenerates the blue buttons is the distance of the updated MC.
  useEffect(() => {
    if (positionOne) {
      handlePostion(positionOne[2], "first");
    }
  }, [firtValue]);

  // calc the Y coordinates of btns
  const calcYPosition = (index) => {
    if (index >= 0 && index <= 7) {
      return 8;
    } else if (index >= 8 && index <= 15) {
      return 7;
    } else if (index >= 16 && index <= 23) {
      return 6;
    } else if (index >= 24 && index <= 31) {
      return 5;
    } else if (index >= 32 && index <= 39) {
      return 4;
    } else if (index >= 40 && index <= 47) {
      return 3;
    } else if (index >= 48 && index <= 55) {
      return 2;
    } else if (index >= 56 && index <= 63) {
      return 1;
    } else {
      return "";
    }
  };

  // calc the X coordinates of btns
  const calcXPosition = (index) => {
    if (
      index === 0 ||
      index === 8 ||
      index === 16 ||
      index === 24 ||
      index === 32 ||
      index === 40 ||
      index === 48 ||
      index === 56
    ) {
      return 1;
    } else if (
      index === 1 ||
      index === 9 ||
      index === 17 ||
      index === 25 ||
      index === 33 ||
      index === 41 ||
      index === 49 ||
      index === 57
    ) {
      return 2;
    } else if (
      index === 2 ||
      index === 10 ||
      index === 18 ||
      index === 26 ||
      index === 34 ||
      index === 42 ||
      index === 50 ||
      index === 58
    ) {
      return 3;
    } else if (
      index === 3 ||
      index === 11 ||
      index === 19 ||
      index === 27 ||
      index === 35 ||
      index === 43 ||
      index === 51 ||
      index === 59
    ) {
      return 4;
    } else if (
      index === 4 ||
      index === 12 ||
      index === 20 ||
      index === 28 ||
      index === 36 ||
      index === 44 ||
      index === 52 ||
      index === 60
    ) {
      return 5;
    } else if (
      index === 5 ||
      index === 13 ||
      index === 21 ||
      index === 29 ||
      index === 37 ||
      index === 45 ||
      index === 53 ||
      index === 61
    ) {
      return 6;
    } else if (
      index === 6 ||
      index === 14 ||
      index === 22 ||
      index === 30 ||
      index === 38 ||
      index === 46 ||
      index === 54 ||
      index === 62
    ) {
      return 7;
    } else if (
      index === 7 ||
      index === 15 ||
      index === 23 ||
      index === 31 ||
      index === 39 ||
      index === 47 ||
      index === 55 ||
      index === 63
    ) {
      return 8;
    } else {
      return "";
    }
  };

  // Now this functions checks if the index passed in it is in the acceptedBtns array, if it is it returns true else false.
  // This is for the blue buttons
  const checkFirstDistance = (index) => {
    let res = blueBtns.includes(index);
    return res;
  };

  // Now this functions checks if the index past is in the acceptedBtns array, if it is it returns true else false.
  // This is for the red buttons
  const checkSecondDistance = (index) => {
    let res = redBtns.includes(index);
    return res;
  };

  // retrun one btn and helps to shorten the code
  const customButton = (index, showMe) => {
    return (
      <Button
        key={index}
        clickable={clickableBtn}
        viewBoldFirst={viewBoldFirst}
        viewBoldSecond={viewBoldSecond}
        setShowQuestionBtn={setShowQuestionBtn}
        index={index}
        handlePostion={handlePostion}
        showMe={showMe}
        selectedTitle={selectedTitle}
        positionTwo={positionTwo}
        positionThree={positionThree}
      />
    );
  };

  return (
    <div className="homeWrapper">
      <h3>Project XY</h3>
      {/* Message div */}
      <div
        className={`${startMessage === "Start" && "clickable"} start ${
          (startMessage === "Move" || startMessage === "Act") && "makeMeDisable"
        }`}
        onClick={handleStart}
      >
        {startMessage}
      </div>

      {/* MC, AC, XP, Yp, XM, YM, XA and YA */}
      <div className="viewBtnWrapper">
        {startMessage === "Move" || startMessage === "Act" ? (
          <div className="viewBtns">
            {viewBoldFirst && (
              <ViewButton
                title="First"
                M={FM}
                A={FA}
                viewBold={viewBoldFirst}
                handleViewBold={handleViewBold}
                setFirstValue={setFirstValue}
                setSecondValue={setSecondValue}
                startMessage={startMessage}
                handleBtnTitle={handleBtnTitle}
              />
            )}
            {viewBoldSecond && (
              <ViewButton
                title="Second"
                M={SM}
                A={SA}
                viewBold={viewBoldSecond}
                handleViewBold={handleViewBold}
                setFirstValue={setFirstValue}
                setSecondValue={setSecondValue}
                startMessage={startMessage}
                handleBtnTitle={handleBtnTitle}
              />
            )}
          </div>
        ) : (
          startMessage === "Choose" && (
            <div className="viewBtns">
              <ViewButton
                title="First"
                M={FM}
                A={FA}
                viewBold={viewBoldFirst}
                handleViewBold={handleViewBold}
                setFirstValue={setFirstValue}
                setSecondValue={setSecondValue}
                handleBtnTitle={handleBtnTitle}
              />
              <ViewButton
                title="Second"
                M={SM}
                A={SA}
                viewBold={viewBoldSecond}
                handleViewBold={handleViewBold}
                setFirstValue={setFirstValue}
                setSecondValue={setSecondValue}
                handleBtnTitle={handleBtnTitle}
              />
            </div>
          )
        )}
        {showResults && (
          <div className="viewBtnResult">
            <ViewButtonResult title="MC" value1={firtValue} />
            <ViewButtonResult title="AC" value1={secondValue} />
            <ViewButtonResult title="XP" value1={xposition} />
            <ViewButtonResult title="YP" value1={yposition} />
            <ViewButtonResult title="XM" value1={secondXPosition} />
            <ViewButtonResult title="YM" value1={secondYPosition} />
            <ViewButtonResult title="XA" value1={thirdXPosition} />
            <ViewButtonResult title="YA" value1={thirdYPosition} />
          </div>
        )}
      </div>

      <div className="contentWrapper">
        <div className="btnWrapper">
          {/* empty vertical column helps to the bottom/x axsis verically */}
          <div className="labelGrid">
            {LeftCounter.map((item, index) => (
              <h6 key={index} className="counter">
                {""}
              </h6>
            ))}
          </div>
          <div className="btnGrid">
            {/* 
            1st condition: render all the 64 btns
            2nd condition: render each btn with blue background if they are within the specifying distance and dont include the current selected position(position one)
            3rd condition:
              3.1 condition: render each btn with red background if they are within the specifying distance from position two and position one as well and dont include the current selected position(position two)
              3.2 condition: repeat 2nd condition
              3.3 condition: render each button with green background
            */}
            {positionOne === null &&
            positionTwo === null &&
            positionThree === null
              ? btnList.map((item, index) => customButton(index, item.showMe))
              : (positionOne !== null &&
                  positionTwo === null &&
                  positionThree === null) ||
                startMessage === "Move"
              ? btnList.map((item, index) =>
                  checkFirstDistance(index, FM) &&
                  (positionOne[0] !== calcXPosition(index) ||
                    positionOne[1] !== calcYPosition(index)) ? (
                    <Button
                      key={index}
                      clickable={true}
                      viewBoldFirst={viewBoldFirst}
                      viewBoldSecond={viewBoldSecond}
                      setShowQuestionBtn={setShowQuestionBtn}
                      index={index}
                      handlePostion={handlePostion}
                      startMessage={startMessage}
                      neighbour={neighbour}
                      showMe={item.showMe}
                      selectedTitle={selectedTitle}
                      positionTwo={positionTwo}
                      positionThree={positionThree}
                    />
                  ) : (
                    customButton(index, item.showMe)
                  )
                )
              : btnList.map((value, index) =>
                  checkSecondDistance(index) &&
                  startMessage === "Act" &&
                  (positionTwo[0] !== calcXPosition(index) ||
                    positionTwo[1] !== calcYPosition(index)) ? (
                    <Button
                      key={index}
                      clickable={true}
                      viewBoldFirst={viewBoldFirst}
                      viewBoldSecond={viewBoldSecond}
                      setShowQuestionBtn={setShowQuestionBtn}
                      index={index}
                      handlePostion={handlePostion}
                      startMessage={startMessage}
                      neighbourInside={neighbourInside}
                      showMe={value.showMe}
                      selectedTitle={selectedTitle}
                      positionTwo={positionTwo}
                      positionThree={positionThree}
                    />
                  ) : checkFirstDistance(index) &&
                    (positionTwo[0] !== calcXPosition(index) ||
                      positionTwo[1] !== calcYPosition(index)) &&
                    (positionOne[0] !== calcXPosition(index) ||
                      positionOne[1] !== calcYPosition(index)) ? (
                    <Button
                      key={index}
                      clickable={false}
                      viewBoldFirst={viewBoldFirst}
                      viewBoldSecond={viewBoldSecond}
                      setShowQuestionBtn={setShowQuestionBtn}
                      index={index}
                      handlePostion={handlePostion}
                      startMessage={startMessage}
                      neighbour={neighbour}
                      showMe={value.showMe}
                      selectedTitle={selectedTitle}
                      positionTwo={positionTwo}
                      positionThree={positionThree}
                    />
                  ) : (
                    customButton(index, value.showMe)
                  )
                )}
          </div>
          {/* render Y axsis values */}
          <div className="labelGrid">
            {LeftCounter.map((item, index) => (
              <h6 key={index} className="counter">
                {item}
              </h6>
            ))}
          </div>
        </div>

        {/* render X axsis values */}
        <div className="bottomLabelGrid">
          <h6 className="bottomCounter">X</h6>
          {bottomCounter.map((item, index) => (
            <h6 key={index} className="bottomCounter">
              {item}
            </h6>
          ))}
          <h6 className="bottomCounter">Y</h6>
        </div>

        {/* Back button and ? button */}
        <div className="bottomBtnwrapper">
          {showBackBtn && (
            <div className="questionBtn" onClick={handleBackBtn}>
              Back
            </div>
          )}
          {showQuestionBtn && (
            <div className="questionBtn" onClick={handleQuestion}>
              Next
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayScreen;
