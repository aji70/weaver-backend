import { registerAs } from '@nestjs/config';
import { ProtocolEventType } from '../entities/protocol-event.entity';

export default registerAs('protocols', () => ({
  retryAttempts: 3,
  retryDelay: 5000, // 5 seconds
  blockConfirmation: 12, // Number of blocks to wait for confirmation
  defaultProtocols: [
    {
      id: 'example-protocol',
      rpcUrl: process.env.EXAMPLE_PROTOCOL_RPC_URL,
      contractAddress: process.env.EXAMPLE_PROTOCOL_CONTRACT_ADDRESS,
      abi: [], // Add your contract ABI here
      eventTypes: [
        ProtocolEventType.REWARD_CLAIM,
        ProtocolEventType.TOKEN_TRANSFER,
      ],
      startBlock: 0,
    },
  ],
})); 