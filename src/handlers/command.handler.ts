import axios from 'axios';
import { getPrice } from 'src/helpers';

export const COMMAND_HANDLER = {
  eth: { getPrice: getPrice('ETH/USDT'), handler: ethHandler },
  matic: { getPrice: getPrice('MATIC/USDT'), handler: maticHandler },
};

export async function maticHandler(sub) {
  try {
    const priceETH = await getPrice('ETH/USDT')();
    const priceMATIC = await getPrice('MATIC/USDT')();
    const {
      data: {
        currentStats: { difficulty },
      },
    } = await axios.get<any>('https://etherchain.org/api/basic_stats', {
      responseType: 'json',
    });
    if (priceMATIC < +sub.price) return;
    let msg = `ETH/MATIC: ${(priceETH / priceMATIC).toFixed(2)}`;
    msg += ` (${priceETH}/${priceMATIC})`;
    msg += ` - ETH DIFF ${(difficulty / Math.pow(10, 15)).toFixed(2)} P`;
    return msg;
  } catch (ex) {
    return `${JSON.stringify(ex)}`;
  }
}

export async function ethHandler(sub) {
  try {
    const priceETH = await getPrice('ETH/USDT')();
    const priceMATIC = await getPrice('MATIC/USDT')();
    const {
      data: {
        currentStats: { difficulty },
      },
    } = await axios.get<any>('https://etherchain.org/api/basic_stats', {
      responseType: 'json',
    });
    if (priceETH < +sub.price) return;
    let msg = `ETH/MATIC: ${(priceETH / priceMATIC).toFixed(2)}`;
    msg += ` (${priceETH}/${priceMATIC})`;
    msg += ` - ETH DIFF ${(difficulty / Math.pow(10, 15)).toFixed(2)} P`;
    return msg;
  } catch (ex) {
    return `${JSON.stringify(ex)}`;
  }
}

export async function handleCommand(sub) {
  const { coin, price } = sub;
  const { handler } = COMMAND_HANDLER[coin];
  const msg = await handler(sub);
  return `ALERT: ${sub.coin} price >= ${sub.price} ${msg}`;
}
