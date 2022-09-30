import React, { useEffect, useState } from "react";
import "./style.css";

type OpenType = Array<{
  index: number;
  number: number;
}>;

export function Game() {
  const [size, setSize] = useState<number>(0);
  const [gridArr, setGridArr] = useState<Array<number>>([]);
  const [solved, setSolved] = useState<Array<number>>([]);
  const [opened, setOpened] = useState<OpenType | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (size > 0) {
      setStatus("play");
      const arr = new Array((size * size) / 2).fill(0);
      arr.forEach((e: number, i: number) => {
        arr[i] = i + 1;
      });
      setGridArr([...shuffleArray(arr), ...shuffleArray(arr)]);
      setSolved([]);
      setOpened(null);
    }
  }, [size]);

  useEffect(() => {
    if (size > 0 && solved.length === (size * size) / 2) {
      setStatus("finish");
    }
  }, [size, solved]);

  const shuffleArray = (arr: Array<any>) => {
    return arr.sort(() => Math.random() - 0.5);
  };

  const handleGridSize = (): JSX.Element => {
    return (
      <div>
        <span style={{ paddingLeft: 10 }}>
          <select
            style={{ width: 150 }}
            onChange={(e: any) => setSize(parseInt(e.target.value))}
          >
            <option value={0}>Select Grid Size</option>
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
          </select>
        </span>
      </div>
    );
  };

  const getClassNames = (num: number, index: number) => {
    if (solved.includes(num)) return "removed";

    if (opened && opened.find((item) => item.index === index)) return "show";

    return "hidden";
  };

  const cardReveal = (num: number, index: number) => {
    if (opened === null) {
      setOpened([
        {
          index: index,
          number: num,
        },
      ]);
    } else if (opened.length === 1) {
      if (opened[0].number === num) {
        setOpened([...opened, { index: index, number: num }]);
        setTimeout(() => {
          setOpened(null);
          setSolved([...solved, num]);
        }, 1000);
      } else {
        setOpened([...opened, { index: index, number: num }]);
        setTimeout(() => {
          setOpened(null);
        }, 1000);
      }
    } else {
      console.log("else");
    }
  };

  return (
    <>
      <h1>Memory Game</h1>
      {/* Select Grid Size */}
      {size === 0 ? (
        handleGridSize()
      ) : (
        <button
          type="button"
          onClick={() => {
            setSize(0);
            setGridArr([]);
          }}
        >
          Restart
        </button>
      )}

      <div className="gridContainer">
        {status === "play" && (
          <div
            className="cards"
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
          >
            {gridArr.length > 0 &&
              gridArr.map((num: number, i: number) => (
                <div
                  key={`card-${i}`}
                  className={`card ${getClassNames(num, i)}`}
                  onClick={() => cardReveal(num, i)}
                >
                  {num}
                </div>
              ))}
          </div>
        )}
        {status === "finish" && <div>You Win</div>}
      </div>
    </>
  );
}
