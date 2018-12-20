function setChart(id, processedData) {
    console.log("setChart()");
    var chartCanvas = $("#" + id);
    Chart.defaults.global.defaultFontFamily = "Lato";
    Chart.defaults.global.defaultFontSize = 18;




    var barChartData = {
         labels: Object.keys(processedData.gridData).map(function (previous, key) {
            return processedData.gridData[key]["Aanvrager"];
        }),
         datasets: [
//            {
//                  label: 'Orders',
//                  data: Object.keys(processedData.gridData).map(function (previous, key) {
//                    return processedData.gridData[key]["Orders"];
//                }),
//                  backgroundColor: 'rgba(75, 104, 139, 1)',
//                  borderWidth: 0
//                  
//            },

            {
                  label: 'Gekende testen',
                  data: Object.keys(processedData.gridData).map(function (previous, key) {
                    return processedData.gridData[key]["Gekende testen"];
                }),
                  backgroundColor: 'rgba(112, 156, 52, 1)',
                  borderWidth: 0
                  
            },

            {
                  label: 'Openstaande testen',
                  data: Object.keys(processedData.gridData).map(function (previous, key) {
                    return processedData.gridData[key]["Openstaande testen"];
                }),
                  backgroundColor: 'rgba(170, 146, 57, 1)',
                  borderWidth: 0
                  
            }
        ]
    }

    var chartOptions = {
        type: 'bar',
        data: barChartData,
        options: {
            maintainAspectRatio: false,
            title: {
                display: false,
                text: ''
            },
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            },
            responsive: true,
            scales: {
                xAxes: [{
                        stacked: true,
                        display: false
                    }],
                yAxes: [{
                        stacked: true,
                        display: false
                    }]
            }
        }
    };

    var barChart = new Chart(chartCanvas, chartOptions);

}


