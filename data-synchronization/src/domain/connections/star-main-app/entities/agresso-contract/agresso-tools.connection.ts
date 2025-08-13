import { env } from 'process';
import { Client, createClientAsync } from 'soap';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { LoggerUtil } from '../../../../shared/utils/logger.util';

export class Agresso implements ConnectionInterface {
  private client: Client;
  private readonly xmlToJson: XMLParser;
  private readonly xmlBuilder: XMLBuilder;
  private readonly logger: LoggerUtil = new LoggerUtil({
    name: Agresso.name,
  });
  private readonly isProduction: boolean;

  constructor(isProduction = false) {
    this.xmlToJson = new XMLParser();
    this.xmlBuilder = new XMLBuilder();
    this.initializeClient();
    this.isProduction = isProduction;
  }

  xmlToObject<T>(data: string): Partial<T> {
    return this.xmlToJson.parse(data);
  }

  objectToXml(data: any): string {
    return this.xmlBuilder.build(data);
  }

  private async initializeClient() {
    try {
      const baseUrl = this.isProduction
        ? env.DS_ARI_AGRESSO_URL
        : env.DS_ARI_AGRESSO_URL_DEV;
      this.client = await createClientAsync(
        baseUrl + 'abwinterface/DataManagementPort?wsdl',
      );
      this.client.addHttpHeader(
        'username',
        this.isProduction
          ? env.DS_ARI_AGRESSO_USER
          : env.DS_ARI_AGRESSO_USER_DEV,
      );
      this.client.addHttpHeader(
        'password',
        this.isProduction
          ? env.DS_ARI_AGRESSO_PASS
          : env.DS_ARI_AGRESSO_PASS_DEV,
      );
    } catch (err) {
      this.logger.error(err);
    }
  }

  async get<T>(methodName: string, args: any = {}): Promise<T> {
    if (!this.client) {
      await this.initializeClient();
    }
    const [result] = await this.client[`${methodName}Async`](args);
    const { return: data } = result;
    return data;
  }
}

export interface ConnectionInterface {
  get<T>(path: string): Promise<T>;
}
