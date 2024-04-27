import React from 'react';
import { Dimensions } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const data = {
  labels: ["Swim", "Bike", "Run"], // Labels for the rings
  data: [0.5, 0.3, 0.2], // Corresponding values for each ring
  colors: ["#0096c7", "#ff7043", "#43a047"], // Blue, orange, and green colors
};


const chartConfig = {
  backgroundColor: '#121212', // A dark grey that is almost black
  backgroundGradientFrom: '#121212', // Dark grey
  backgroundGradientTo: '#121212', // Medium grey
  color: (opacity = 1) => `rgba(205, 215, 155, ${opacity})`, // Still need this for labels and such
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 16,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  fillShadowGradient: '#262626', // Same as background to 'hide' the actual chart's progress
  fillShadowGradientOpacity: 1,
};

const MyProgressChart = () => {
  return (
    <ProgressChart
      data={data}
      width={screenWidth}
      height={220}
      strokeWidth={16}
      radius={32}
      chartConfig={chartConfig}
      hideLegend={false}

    />
  );
};

export default MyProgressChart;
