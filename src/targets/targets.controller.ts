import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TargetsService } from './targets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('targets')
export class TargetsController {
  constructor(private readonly targetsService: TargetsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/events')
  get_events(@Param('id') id: number) {
    return this.targetsService.get_events(id);
  }

  // @Post()
  // create(@Body() createTargetDto: CreateTargetDto) {
  //   return this.targetsService.create(createTargetDto);
  // }

  // @Get()
  // findAll() {
  //   return this.targetsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.targetsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTargetDto: UpdateTargetDto) {
  //   return this.targetsService.update(+id, updateTargetDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.targetsService.remove(+id);
  // }
}
