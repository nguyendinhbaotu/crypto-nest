import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Client, Intents } from 'discord.js';

import { SubManager } from 'src/models';
import { COMMAND_HANDLER, handleCommand } from 'src/handlers';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private client;
  private subManager = new SubManager();

  constructor(private configService: ConfigService) {
    this.client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });
    this.client.on('ready', () => {
      this.logger.debug(`Logged in as ${this.client.user.tag}!`);
    });
    this.client.on('message', async (msg) => {
      if (msg.content.startsWith('sub')) {
        this.subManager.addSub(msg);
      }
    });
    this.client.login(this.configService.get<string>('DISCORD_CLIENT_TOKEN'));
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const subs = this.subManager.getSubs();
    subs.forEach(async (sub) => {
      console.log('sub', JSON.stringify(sub));
      const channel = await this.client.channels.fetch(sub.channelId);
      if (!channel) return;
      const msg = await handleCommand(sub);
      if (msg) channel.send(msg);
    });
  }
}
