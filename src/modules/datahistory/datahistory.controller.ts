import { Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { DataHistoryService } from './datahistory.service';
import { DataHistoryQueryDto } from './datahistory.requestdto';

@Controller('datahistories')
export class DataHistoryController {
  @Inject()
  private readonly dataHistoryService: DataHistoryService;

  @Post('/:device/:status')
  async controlDevice(
    @Param('device') device: 'led' | 'fan' | 'air_conditioner',
    @Param('status') status: 'ON' | 'OFF',
  ) {
    await this.dataHistoryService.publishAndWait(device, status);
  }

  @Get()
  async getDataHistory(@Query() query: DataHistoryQueryDto) {
    return this.dataHistoryService.getDataHistory(query);
  }
}
