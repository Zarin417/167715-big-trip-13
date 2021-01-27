import SmartView from './smart';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const getUniqueItems = (items) => [...new Set(items)];

const getPointTypes = (points) => getUniqueItems(points.map((point) => point.type));

const sumPrice = (points) => points.reduce((total, point) => point.price + total, 0);

const sumPriceByType = (points, type) => {
  return sumPrice(points.filter((point) => point.type === type));
};

const getPointDurationInMs = (point) => {
  return dayjs.duration(dayjs(point.endTime).diff(dayjs(point.startTime))).asMilliseconds();
};

const sumPointDurationsInMs = (points) => points.reduce((totalMs, point) =>
  totalMs + getPointDurationInMs(point), 0);

const countDurationByPointType = (points, type) => {
  const totalDurationInMs = sumPointDurationsInMs(points.filter((point) => point.type === type));
  return totalDurationInMs;
};

const formatDurationMs = (ms) => {
  const durationToFormat = dayjs.duration(ms);

  const days = durationToFormat.days();
  const hours = durationToFormat.hours();
  const minutes = durationToFormat.minutes();

  let template;

  if (days) {
    template = `DD[D] HH[H] mm[M]`;
  } else if (hours) {
    template = `HH[H] mm[M]`;
  } else {
    template = `mm[M]`;
  }

  const durationBeforeFormat = `0000-00-${days} ${hours}:${minutes}`;
  const formattedDuration = dayjs(durationBeforeFormat).format(template);
  return formattedDuration;
};

const renderMoneyChart = (moneyCtx, points) => {
  const types = getPointTypes(points);
  const upperCaseTypes = types.map((type) => type.toUpperCase());
  const prices = types.map((type) => sumPriceByType(points, type));

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: upperCaseTypes,
      datasets: [{
        data: prices,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTypeChart = (typeCtx, points) => {
  const types = getPointTypes(points);
  const upperCaseTypes = types.map((type) => type.toUpperCase());
  const typeCounts = types.map((type) => points.filter((point) => point.type === type).length);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: upperCaseTypes,
      datasets: [{
        data: typeCounts,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TYPE`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeChart = (moneyCtx, points) => {
  const types = getPointTypes(points);
  const upperCaseTypes = types.map((type) => type.toUpperCase());
  const durationsByType = types.map((type) => countDurationByPointType(points, type));

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: upperCaseTypes,
      datasets: [{
        data: durationsByType,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${formatDurationMs(val)}`
        }
      },
      title: {
        display: true,
        text: `TIME-SPEND`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return `<section class="statistics">
            <h2 class="visually-hidden">Trip statistics</h2>
              <div class="statistics__item statistics__item--money">
                <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
              </div>
              <div class="statistics__item statistics__item--transport">
                <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
              </div>
              <div class="statistics__item statistics__item--time-spend">
                <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
              </div>
          </section>`;
};

export default class Statistics extends SmartView {
  constructor(points) {
    super();
    this._data = points;
    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  removeElement() {
    super.removeElement();

    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const moneyContextElement = this.getElement().querySelector(`.statistics__chart--money`);
    const typeContextElement = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeContextElement = this.getElement().querySelector(`.statistics__chart--time`);

    this._moneyChart = renderMoneyChart(moneyContextElement, this._data);
    this._typeChart = renderTypeChart(typeContextElement, this._data);
    this._timeChart = renderTimeChart(timeContextElement, this._data);
  }
}
