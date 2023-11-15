import { Module } from '@nestjs/common';
import { FormController } from 'src/forms/forms.controller';
import { FormService } from 'src/forms/forms.service';
@Module({
  controllers: [FormController],
  providers: [FormService],
  exports: [FormService],
})
export class FormModule {}
