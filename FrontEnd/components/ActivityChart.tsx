import React from 'react';
import { View, Dimensions } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import { sub, subDays } from 'date-fns';
import { RectProps } from 'react-native-svg';
import { ContributionChartValue } from 'react-native-chart-kit/dist/contribution-graph/ContributionGraph';

const ActivityContributionGraph = ({ activityData }) => {
    const screenWidth = Dimensions.get('window').width;
    //set end date to 10 days after today
    const endDate = new Date();


    const chartConfig = {
        backgroundColor: '#121212',  // Dark background
        backgroundGradientFrom: '#121212',  // Deep blue
        backgroundGradientTo: '#121212',  // Purple
        color: (opacity = 1) => `rgba(255, 235, 59, ${opacity})`, // Bright yellow
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White for labels
        strokeWidth: 2,
        barPercentage: 0.5,
    };
    
    // Function to provide SVG attributes for tooltips
    const tooltipDataAttrs = (value) => ({
        'data-tooltip': `Activity count: ${value.count}`
    });

    return (
        <View>
            <ContributionGraph
                values={activityData}
                endDate={endDate}
                numDays={100}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                gutterSize={2}
                squareSize={20}
                showMonthLabels={true}
                showOutOfRangeDays={false}
                tooltipDataAttrs={(value: ContributionChartValue & { count: number }) => ({
                    'data-tooltip': `Activity count: ${value.count}`
                }) as Partial<RectProps>}
            />
        </View>
    );
};

export default ActivityContributionGraph;
