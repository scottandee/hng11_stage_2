import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class CustomValidationPipe extends ValidationPipe {
  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const formattedErrors = validationErrors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints || {}).join(', '),
      }));

      return new UnprocessableEntityException({
        errors: formattedErrors,
      });
    };
  }
}
