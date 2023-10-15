import * as React from "react";
import "beercss";

export default function Loader() {
  return (
    <div className="fill medium-height middle-align center-align">
      <div className="center-align">
        <progress className="circle large"></progress>
      </div>
    </div>
  );
}
