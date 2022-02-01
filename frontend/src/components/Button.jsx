import React, { useState } from "react";

const Button = ({
  clickable,
  viewBoldFirst,
  viewBoldSecond,
  setShowQuestionBtn,
  handlePostion,
  index,
  neighbour = false,
  neighbourInside = false,
  startMessage,
  showMe,
  selectedTitle,
  positionTwo,
  positionThree,
}) => {
  const [showText, setShowText] = useState(false);
  const [btnTitle, setBtnTitle] = useState("");

  const handleClick = () => {
    if (clickable) {
      viewBoldFirst
        ? setBtnTitle("F")
        : viewBoldSecond
        ? setBtnTitle("S")
        : setBtnTitle("");

      setShowQuestionBtn(true);

      if (neighbourInside) {
        // if true then it is the red button
        handlePostion(index, "third");
      } else {
        if (!neighbour) {
          handlePostion(index, "first");
        } else {
          setShowQuestionBtn(true);
          handlePostion(index, "second");
        }
      }

      setShowText(true);
    }
  };

  return (
    <div
      className={`${clickable && "clickable"} ${
        (neighbour || (positionTwo && positionTwo[2] === index)) &&
        "neighbourBtn"
      } ${
        (neighbourInside || (positionThree && positionThree[2] === index)) &&
        "neighbourInsideBtn"
      } commandBtn`}
      onClick={handleClick}
    >
      {showMe && showText && selectedTitle}
    </div>
  );
};
export default Button;
