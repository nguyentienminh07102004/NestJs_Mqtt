import { Controller, Inject, Param, Post } from '@nestjs/common';
import { DataHistoryService } from './datahistory.service';

@Controller()
export class DataHistoryController {
  @Inject()
  private readonly dataHistoryService: DataHistoryService;

  @Post('/:device/:status')
  async controlDevice(
    @Param('device') device: 'led' | 'fan' | 'air_conditioner',
    @Param('status') status: "ON" | "OFF",
  ) {
    await this.dataHistoryService.publishAndWait(device, status);
  }
}
