import { getRoute } from 'src/lib/agent/methods/fibrous/actions/fetchRoute';
import { SwapParams } from 'src/lib/agent/methods/fibrous/types';
import { StarknetAgentInterface } from 'src/lib/agent/tools/tools';

describe('Swap Token with fibrous-sdk', () => {
  describe('With perfect match inputs', () => {
    it('should swap token 0.1 ETH to STRK', async () => {
      const agent = {
        getAccountCredentials: () => ({
          accountPublicKey: process.env.ACCOUNT_PUBLIC_KEY,
          accountPrivateKey: process.env.ACCOUNT_PRIVATE_KEY,
        }),
        getProvider: () => process.env.PROVIDER_URL,
      } as unknown as StarknetAgentInterface;
      const params: SwapParams = {
        sellTokenSymbol: 'STRK',
        buyTokenSymbol: 'ETH',
        sellAmount: 1,
      };

      const result = await getRoute(agent, params);
      expect(result).toMatchObject({
        status: 'success',
      });
    });
  });
});
