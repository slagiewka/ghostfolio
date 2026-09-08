import { DataGatheringItem } from '@ghostfolio/api/services/interfaces/interfaces';

import { Job } from 'bull';
import type { Mock } from 'vitest';

import { DataGatheringProcessor } from './data-gathering.processor';

describe('DataGatheringProcessor in a time zone behind UTC', () => {
  let dataGatheringProcessor: DataGatheringProcessor;
  let dataProviderService: { getHistoricalRaw: Mock };
  let marketDataService: { replaceForSymbol: Mock; updateMany: Mock };
  const previousTimeZone = process.env.TZ;

  beforeAll(() => {
    process.env.TZ = 'America/New_York';
    // 2026-08-23 21:30 in New York, but already 2026-08-24 in UTC
    vi.useFakeTimers().setSystemTime(new Date('2026-08-24T01:30:00.000Z'));
  });

  beforeEach(() => {
    dataProviderService = {
      getHistoricalRaw: vi.fn().mockResolvedValue({
        'COINGECKO-bitcoin': {
          '2026-08-21': { marketPrice: 5 },
          '2026-08-22': { marketPrice: 6 },
          '2026-08-23': { marketPrice: 7 }
        }
      })
    };
    marketDataService = {
      replaceForSymbol: vi.fn(),
      updateMany: vi.fn()
    };

    dataGatheringProcessor = new DataGatheringProcessor(
      null,
      dataProviderService as any,
      marketDataService as any,
      null
    );
  });

  afterAll(() => {
    if (previousTimeZone === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = previousTimeZone;
    }
    vi.useRealTimers();
  });

  it('gathers up to the last complete UTC day and does not shift the dates', async () => {
    await dataGatheringProcessor.gatherHistoricalMarketData({
      data: {
        dataSource: 'COINGECKO',
        // The queue enqueues dates at midnight (UTC), not at local midnight
        date: new Date('2026-08-21T00:00:00.000Z').toISOString(),
        symbol: 'bitcoin'
      }
    } as unknown as Job<DataGatheringItem>);

    const { data } = marketDataService.updateMany.mock.calls[0][0];

    expect(
      data.map(({ date, marketPrice }) => {
        return { date, marketPrice };
      })
    ).toEqual([
      { date: new Date('2026-08-21T00:00:00.000Z'), marketPrice: 5 },
      { date: new Date('2026-08-22T00:00:00.000Z'), marketPrice: 6 },
      { date: new Date('2026-08-23T00:00:00.000Z'), marketPrice: 7 }
    ]);
  });
});
