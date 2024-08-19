import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;

    if (!redisHost || !redisPort) {
      throw new Error('Redis host and port are required');
    }

    const store = await redisStore({
      socket: {
        host: configService.get<string>(redisHost),
        port: parseInt(configService.get<string>(redisPort)!),
      },
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};
