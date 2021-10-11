import { Command } from 'commander';
import { parse } from 'shell-quote';
import { COMMAND_HANDLER } from 'src/handlers';
import * as _ from 'lodash';
export class SubManager {
  private program;
  public subs = {};

  constructor() {
    this.program = new Command('start');
    this.program
      .option('-l, --list')
      .option('-c, --coin <type>', 'coin')
      .option('-p, --price <type>', 'price');
  }

  async addSub(msg) {
    const { channelId, content } = msg;
    console.log(`channelId: ${channelId} - content: ${content}`);
    this.program.parse(parse(`node ${content.toLowerCase()}`));
    const opts = this.program.opts();
    console.log(`opts: ${JSON.stringify(opts)}`);
    if (opts.list) {
      msg.reply(`LIST: ${JSON.stringify(this.subs)}`);
    } else if (opts.coin) {
      console.log(`Sub Key: ${channelId}/${opts.coin}`);
      this.subs[`${channelId}/${opts.coin}`] = opts;
      console.log(`Opts: ${JSON.stringify(opts)}`);
      const { getPrice } = COMMAND_HANDLER[opts.coin];
      const price = await getPrice();
      msg.reply(
        `SUBSCRIBE: Current ${opts.coin.toUpperCase()} Price: ${price}`,
      );
    }
  }

  getSubs() {
    return Object.entries(this.subs).map((entry: [string, any]) => ({
      channelId: entry[0].split('/')[0],
      ...entry[1],
    }));
  }
}
