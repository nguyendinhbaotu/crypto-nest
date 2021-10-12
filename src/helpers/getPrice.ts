import * as ccxt from 'ccxt';
// import * as moment from 'moment';

export function getPrice(symbol) {
  return async function () {
    try {
      const binance = new ccxt.binance();
      const pricesOHLCV = await binance.fetchOHLCV(symbol, '1m', undefined, 1);
      const prices = pricesOHLCV.map(
        (p) => p[1],
        // `Timestamp: ${moment(p[0]).format('LTS')} - Price: ${p[1]}`
        //     {
        //     timestamp: moment(p[0]).format(),
        //     open: p[1],
        //     high: p[2],
        //     low: p[3],
        //     close: p[4],
        //     volume: p[5]
        // }
      );

      return prices[0];
    }
    catch (ex) {
      console.log('ex', JSON.stringify(ex))
      return null;
    }
  };
}
