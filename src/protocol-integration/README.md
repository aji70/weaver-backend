# Protocol Integration Module

A NestJS module for integrating with blockchain protocols and monitoring on-chain events in real-time.

## Features

- Real-time event monitoring for multiple protocols
- Support for various event types (rewards, transfers, mints)
- Persistent event storage with TypeORM
- Configurable retry mechanisms
- Event processing status tracking
- Flexible querying of historical events

## Installation

1. Install required dependencies:
```bash
npm install ethers @nestjs/config @nestjs/typeorm typeorm rxjs
```

2. Configure environment variables:
```env
EXAMPLE_PROTOCOL_RPC_URL=wss://your-rpc-url
EXAMPLE_PROTOCOL_CONTRACT_ADDRESS=0x...
```

## Usage

1. Import the module in your `app.module.ts`:
```typescript
import { ProtocolIntegrationModule } from './protocol-integration/protocol-integration.module';

@Module({
  imports: [
    ProtocolIntegrationModule,
    // ... other imports
  ],
})
export class AppModule {}
```

2. Configure protocols in your environment or configuration:
```typescript
// config/protocol.config.ts
export default {
  protocols: {
    defaultProtocols: [
      {
        id: 'your-protocol',
        rpcUrl: process.env.YOUR_PROTOCOL_RPC_URL,
        contractAddress: process.env.YOUR_PROTOCOL_CONTRACT_ADDRESS,
        abi: [...], // Your contract ABI
        eventTypes: ['REWARD_CLAIM', 'TOKEN_TRANSFER'],
      },
    ],
  },
};
```

3. Inject and use the service:
```typescript
import { ProtocolEventListenerService } from './protocol-integration/services/protocol-event-listener.service';

@Injectable()
export class YourService {
  constructor(private readonly eventListener: ProtocolEventListenerService) {
    // Subscribe to events
    this.eventListener.getEventStream().subscribe(event => {
      console.log('New event:', event);
    });
  }
}
```

## Event Types

The module supports the following event types:
- `REWARD_CLAIM`: For tracking reward claim events
- `TOKEN_TRANSFER`: For monitoring token transfers
- `NFT_MINT`: For tracking NFT minting events

## Error Handling

The module includes built-in error handling:
- Automatic retry for failed event processing
- Error logging with detailed context
- Event processing status tracking
- Block reorganization handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 