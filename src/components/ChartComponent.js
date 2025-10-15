import React from "react";
import ReactEcharts from "echarts-for-react";

const ChartComponent = ({ option }) => {
  return (
    <ReactEcharts
      option={option}
      style={{ width: "100%", height: "100%" }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};

export default ChartComponent;
