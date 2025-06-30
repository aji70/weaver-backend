import { Injectable, Logger } from "@nestjs/common"
import { Repository, Between } from "typeorm"
import { NotificationHistory } from "../entities/notification-history.entity"
import { NotificationStatus, NotificationType } from "../enums/notification.enums"

@Injectable()
export class NotificationHistoryService {
  private readonly logger = new Logger(NotificationHistoryService.name)

  constructor(private historyRepository: Repository<NotificationHistory>) {}

  async recordNotification(
    userAddress: string,
    notificationId: string,
    type: NotificationType,
    status: NotificationStatus,
    transactionHash?: string,
    gasUsed?: string,
    errorMessage?: string,
  ): Promise<NotificationHistory> {
    const historyEntry = this.historyRepository.create({
      userAddress,
      notificationId,
      type,
      status,
      transactionHash,
      gasUsed,
      errorMessage,
      timestamp: new Date(),
    })

    return this.historyRepository.save(historyEntry)
  }

  async updateNotificationStatus(
    notificationId: string,
    status: NotificationStatus,
    transactionHash?: string,
    gasUsed?: string,
    errorMessage?: string,
  ): Promise<void> {
    await this.historyRepository.update(
      { notificationId },
      {
        status,
        transactionHash,
        gasUsed,
        errorMessage,
        updatedAt: new Date(),
      },
    )
  }

  async getUserHistory(
    userAddress: string,
    options: {
      startDate?: Date
      endDate?: Date
      type?: NotificationType
      status?: NotificationStatus
      limit?: number
      offset?: number
    } = {},
  ): Promise<{
    history: NotificationHistory[]
    total: number
    stats: {
      totalSent: number
      totalDelivered: number
      totalFailed: number
      deliveryRate: number
    }
  }> {
    const query = this.historyRepository
      .createQueryBuilder("history")
      .where("history.userAddress = :userAddress", { userAddress })

    if (options.startDate && options.endDate) {
      query.andWhere("history.timestamp BETWEEN :startDate AND :endDate", {
        startDate: options.startDate,
        endDate: options.endDate,
      })
    }

    if (options.type) {
      query.andWhere("history.type = :type", { type: options.type })
    }

    if (options.status) {
      query.andWhere("history.status = :status", { status: options.status })
    }

    const total = await query.getCount()

    const history = await query
      .orderBy("history.timestamp", "DESC")
      .limit(options.limit || 20)
      .offset(options.offset || 0)
      .getMany()

    // Calculate stats
    const statsQuery = this.historyRepository
      .createQueryBuilder("history")
      .select([
        "COUNT(*) as totalSent",
        `COUNT(CASE WHEN history.status = '${NotificationStatus.DELIVERED}' THEN 1 END) as totalDelivered`,
        `COUNT(CASE WHEN history.status = '${NotificationStatus.FAILED}' THEN 1 END) as totalFailed`,
      ])
      .where("history.userAddress = :userAddress", { userAddress })

    if (options.startDate && options.endDate) {
      statsQuery.andWhere("history.timestamp BETWEEN :startDate AND :endDate", {
        startDate: options.startDate,
        endDate: options.endDate,
      })
    }

    const statsResult = await statsQuery.getRawOne()
    const deliveryRate = statsResult.totalSent > 0 ? (statsResult.totalDelivered / statsResult.totalSent) * 100 : 0

    return {
      history,
      total,
      stats: {
        totalSent: Number.parseInt(statsResult.totalSent),
        totalDelivered: Number.parseInt(statsResult.totalDelivered),
        totalFailed: Number.parseInt(statsResult.totalFailed),
        deliveryRate: Math.round(deliveryRate * 100) / 100,
      },
    }
  }

  async getSystemStats(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalNotifications: number
    deliveryRate: number
    averageGasUsed: string
    notificationsByType: Record<NotificationType, number>
    notificationsByStatus: Record<NotificationStatus, number>
  }> {
    const query = this.historyRepository.createQueryBuilder("history")

    if (startDate && endDate) {
      query.where("history.timestamp BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
    }

    const [totalNotifications, deliveredCount, avgGasResult, typeStats, statusStats] = await Promise.all([
      query.getCount(),
      query.clone().where("history.status = :status", { status: NotificationStatus.DELIVERED }).getCount(),
      query.clone().select("AVG(CAST(history.gasUsed AS DECIMAL))", "avgGas").getRawOne(),
      query.clone().select("history.type", "type").addSelect("COUNT(*)", "count").groupBy("history.type").getRawMany(),
      query
        .clone()
        .select("history.status", "status")
        .addSelect("COUNT(*)", "count")
        .groupBy("history.status")
        .getRawMany(),
    ])

    const deliveryRate = totalNotifications > 0 ? (deliveredCount / totalNotifications) * 100 : 0

    const notificationsByType = typeStats.reduce(
      (acc, stat) => {
        acc[stat.type] = Number.parseInt(stat.count)
        return acc
      },
      {} as Record<NotificationType, number>,
    )

    const notificationsByStatus = statusStats.reduce(
      (acc, stat) => {
        acc[stat.status] = Number.parseInt(stat.count)
        return acc
      },
      {} as Record<NotificationStatus, number>,
    )

    return {
      totalNotifications,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      averageGasUsed: avgGasResult?.avgGas || "0",
      notificationsByType,
      notificationsByStatus,
    }
  }

  async cleanupOldHistory(daysToKeep = 90): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const result = await this.historyRepository.delete({
      timestamp: Between(new Date(0), cutoffDate),
    })

    this.logger.log(`Cleaned up ${result.affected} old notification history entries`)
    return result.affected || 0
  }
}
