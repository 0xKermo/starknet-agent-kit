import { Account, uint256, CallData } from 'starknet';
import { StarknetAgentInterface } from 'src/lib/agent/tools/tools';
import { ERC20_ABI } from '../../../plugins/core/token/abis/erc20Abi';

export class ApprovalService {
  constructor(private agent: StarknetAgentInterface) {}

  async checkAndGetApproveToken(
    account: Account,
    tokenAddress: string,
    spenderAddress: string,
    amount: string
  ): Promise<string[]> {
    try {
      const contract = this.agent.contractInteractor.createContract(
        ERC20_ABI,
        tokenAddress,
        account
      );

      const allowanceResult = await contract.call('allowance', [
        account.address,
        spenderAddress,
      ]);

      let currentAllowance: bigint;
      if (Array.isArray(allowanceResult)) {
        currentAllowance = BigInt(allowanceResult[0].toString());
      } else if (
        typeof allowanceResult === 'object' &&
        allowanceResult !== null
      ) {
        const value = Object.values(allowanceResult)[0];
        currentAllowance = BigInt(value.toString());
      } else {
        currentAllowance = BigInt(allowanceResult.toString());
      }

      const requiredAmount = BigInt(amount);

      if (currentAllowance < requiredAmount) {
        const calldata = CallData.compile({
          spender: spenderAddress,
          amount: uint256.bnToUint256(amount),
        });

        console.log('Calldata:', calldata);

        return calldata;
      } else {
        console.log('Sufficient allowance already exists');
        return [];
      }
    } catch (error) {
      console.error('Approval error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        type: error instanceof Error ? error.constructor.name : typeof error,
      });
      throw new Error(
        `Failed to approve token: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async approveToken(/* ... */) {
    const provider = this.agent.getProvider();
    const credentials = this.agent.getAccountCredentials();
    const account = new Account(
      provider,
      credentials.accountPublicKey,
      credentials.accountPrivateKey
    );
    // ... rest of the method
  }
}
