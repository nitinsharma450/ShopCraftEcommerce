import { useState } from "react";

export default function xyz(initialNumber : number) {
  const [myState, setMyState] = useState(initialNumber);

  return {
    myState,
    increaseMyState: () => {
      setMyState((ps) => ps + 1);
    },
  };
}

