  let pieChartInstance = null;
    let barChartInstance = null;

    const sipAmountInput = document.getElementById('sip-amount');
    const sipAmountSlider = document.getElementById('sip-amount-slider');
    const rateOfReturnInput = document.getElementById('rate-of-return');
    const rateOfReturnSlider = document.getElementById('rate-of-return-slider');
    const timePeriodInput = document.getElementById('time-period');
    const timePeriodSlider = document.getElementById('time-period-slider');
    const investedAmountDisplay = document.getElementById('invested-amount');
    const estimatedReturnsDisplay = document.getElementById('estimated-returns');
    const totalFutureValueDisplay = document.getElementById('total-future-value');

    sipAmountInput.addEventListener('input', syncInputSlider);
    sipAmountSlider.addEventListener('input', syncSliderInput);
    rateOfReturnInput.addEventListener('input', syncInputSlider);
    rateOfReturnSlider.addEventListener('input', syncSliderInput);
    timePeriodInput.addEventListener('input', syncInputSlider);
    timePeriodSlider.addEventListener('input', syncSliderInput);

    function syncInputSlider() {
      sipAmountSlider.value = sipAmountInput.value;
      rateOfReturnSlider.value = rateOfReturnInput.value;
      timePeriodSlider.value = timePeriodInput.value;
      calculate();
    }

    function syncSliderInput() {
      sipAmountInput.value = sipAmountSlider.value;
      rateOfReturnInput.value = rateOfReturnSlider.value;
      timePeriodInput.value = timePeriodSlider.value;
      calculate();
    }

    function calculate() {
      const sipAmount = parseFloat(sipAmountInput.value);
      const rateOfReturn = parseFloat(rateOfReturnInput.value) / 100;
      const timePeriod = parseInt(timePeriodInput.value);
      const totalMonths = timePeriod * 12;
      const monthlyRate = rateOfReturn / 12;
      const investedAmount = sipAmount * totalMonths;
      const futureValue = sipAmount * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
      const estimatedReturns = futureValue - investedAmount;

      investedAmountDisplay.textContent = investedAmount.toFixed(0);
      estimatedReturnsDisplay.textContent = estimatedReturns.toFixed(0);
      totalFutureValueDisplay.textContent = futureValue.toFixed(0);

      updatePieChart(investedAmount, estimatedReturns);
      updateBarChart(investedAmount, estimatedReturns, timePeriod);
    }

    function updatePieChart(investedAmount, estimatedReturns) {
      const ctx = document.getElementById('pie-chart').getContext('2d');
      if (pieChartInstance) pieChartInstance.destroy();
      pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Invested Amount', 'Estimated Returns'],
          datasets: [{
            data: [investedAmount, estimatedReturns],
            backgroundColor: ['#4CAF50', '#FFC107'],
          }]
        }
      });
    }

    function updateBarChart(investedAmount, estimatedReturns, timePeriod) {
      const labels = Array.from({ length: timePeriod }, (_, i) => `Year ${i + 1}`);
      const investedData = Array(timePeriod).fill(investedAmount / timePeriod);
      const returnsData = Array(timePeriod).fill(estimatedReturns / timePeriod);

      const ctx = document.getElementById('bar-chart').getContext('2d');
      if (barChartInstance) barChartInstance.destroy();
      barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Invested Amount', data: investedData, backgroundColor: '#4CAF50' },
            { label: 'Estimated Returns', data: returnsData, backgroundColor: '#FFC107' }
          ]
        },
        options: {
          scales: {
            x: { stacked: true },
            y: { stacked: true }
          }
        }
      });
    }

    calculate();
