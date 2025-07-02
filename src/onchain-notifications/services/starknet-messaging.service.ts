import { Injectable, Logger, BadRequestException } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import { Account, Contract, CallData, cairo, type RpcProvider } from "starknet"
import type { StarkNetProviderService } from "../../modules/starknet/provider/starknet-provider.service"
import { OnchainNotification } from "../schemas/onchain-notification.schema"

@Injectable()
export class StarknetMessagingService {
  private readonly logger = new Logger(StarknetMessagingService.name)
  private account: Account
  private messagingContract: Contract

  constructor(
    private configService: ConfigService,
    private starknetProvider: StarkNetProviderService,
  ) {
    this.initializeAccount()
    this.initializeContract()
  }

  async sendOnchainMessage(notification: OnchainNotification): Promise<{
    transactionHash: string
    success: boolean
    gasUsed?: string
  }> {
    try {
      const messageData = this.encodeNotificationData(notification)

      const contractAddress = this.configService.get<string>("MESSAGING_CONTRACT_ADDRESS")
      if (!contractAddress) {
        throw new Error("MESSAGING_CONTRACT_ADDRESS is not configured")
      }
      const call = {
        contractAddress,
        entrypoint: "send_notification",
        calldata: CallData.compile([
          notification.recipientAddress,
          messageData.messageType,
          messageData.title,
          messageData.content,
          messageData.metadata,
          Math.floor(Date.now() / 1000), // timestamp
        ]),
      }

      // Estimate fee first
      const feeEstimate = await this.account.estimateFee([call])
      this.logger.log(`Estimated fee: ${feeEstimate.overall_fee} wei`)

      // Execute the transaction
      const result = await this.account.execute([call])

      // Wait for transaction confirmation
      await this.starknetProvider.getProvider().waitForTransaction(result.transaction_hash)

      this.logger.log(`Onchain notification sent: ${result.transaction_hash}`)

      return {
        transactionHash: result.transaction_hash,
        success: true,
        gasUsed: feeEstimate.overall_fee.toString(),
      }
    } catch (error) {
      this.logger.error(`Failed to send onchain message: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to send onchain message: ${error.message}`)
    }
  }

  async verifyMessageDelivery(transactionHash: string): Promise<boolean> {
    try {
      const receipt = await this.starknetProvider.getProvider().getTransactionReceipt(transactionHash)
      return receipt.execution_status === "SUCCEEDED"
    } catch (error) {
      this.logger.error(`Failed to verify message delivery: ${error.message}`)
      return false
    }
  }

  async getMessageFromTransaction(transactionHash: string): Promise<any> {
    try {
      const transaction = await this.starknetProvider.getTransaction(transactionHash)
      const receipt = await this.starknetProvider.getProvider().getTransactionReceipt(transactionHash)

      // Parse events to extract notification data
      const events = (receipt as any).events || (receipt as any).execution_resources?.events || []
      const notificationEvents = events.filter(
        (event: any) => event.from_address === this.configService.get<string>("MESSAGING_CONTRACT_ADDRESS"),
      )

      return {
        transaction,
        events: notificationEvents,
        status: receipt.status,
      }
    } catch (error) {
      this.logger.error(`Failed to get message from transaction: ${error.message}`)
      throw error
    }
  }

  async getUserMessages(userAddress: string, fromBlock?: number): Promise<any[]> {
    try {
      const events = await this.messagingContract.getEvents({
        from_block: fromBlock || "latest",
        to_block: "latest",
        address: this.configService.get<string>("MESSAGING_CONTRACT_ADDRESS"),
        keys: [cairo.getSelectorFromName("NotificationSent"), userAddress],
      })

      return events.map((event) => this.parseNotificationEvent(event))
    } catch (error) {
      this.logger.error(`Failed to get user messages: ${error.message}`)
      throw error
    }
  }

  private initializeAccount(): void {
    const provider = this.starknetProvider.getProvider() as RpcProvider
    const privateKey = this.configService.get<string>("STARKNET_PRIVATE_KEY")
    const accountAddress = this.configService.get<string>("STARKNET_ACCOUNT_ADDRESS")

    if (!privateKey || !accountAddress) {
      throw new Error("Starknet account configuration missing")
    }

    this.account = new Account(provider, accountAddress, privateKey)
  }

  private initializeContract(): void {
    const contractAddress = this.configService.get<string>("MESSAGING_CONTRACT_ADDRESS")
    const contractAbi = this.getMessagingContractAbi()

    if (!contractAddress) {
      throw new Error("Messaging contract address not configured")
    }

    this.messagingContract = new Contract(contractAbi, contractAddress, this.starknetProvider.getProvider())
  }

  private encodeNotificationData(notification: OnchainNotification): {
    messageType: string
    title: string
    content: string
    metadata: string
  } {
    return {
      messageType: notification.type,
      title: notification.title,
      content: notification.message,
      metadata: JSON.stringify(notification.metadata || {}),
    }
  }

  private parseNotificationEvent(event: any): any {
    // Parse the event data based on the contract ABI
    return {
      recipient: event.data[0],
      messageType: event.data[1],
      title: event.data[2],
      content: event.data[3],
      timestamp: Number.parseInt(event.data[4]),
      blockNumber: event.block_number,
      transactionHash: event.transaction_hash,
    }
  }

  private getMessagingContractAbi(): any[] {
    // This should be loaded from a file or configuration
    return [
      {
        type: "function",
        name: "send_notification",
        inputs: [
          { name: "recipient", type: "felt" },
          { name: "message_type", type: "felt" },
          { name: "title", type: "felt" },
          { name: "content", type: "felt" },
          { name: "metadata", type: "felt" },
          { name: "timestamp", type: "felt" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "event",
        name: "NotificationSent",
        inputs: [
          { name: "recipient", type: "felt" },
          { name: "message_type", type: "felt" },
          { name: "title", type: "felt" },
          { name: "content", type: "felt" },
          { name: "timestamp", type: "felt" },
        ],
      },
    ]
  }
}
